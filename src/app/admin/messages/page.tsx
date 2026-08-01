
import { createClient } from '@/lib/supabase/server';
import Card from '@/components/ui/Card';

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  // 1. 메시지 조회
  const { data: messages, error } = await supabase
    .from('member_messages')
    .select(`
      id,
      sender_id,
      subject,
      body,
      is_read,
      created_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
  }

  // 2. sender_id 목록 추출
  const userIds = [
    ...new Set((messages ?? []).map((m) => m.sender_id)),
  ];

  // 3. 사용자 이름 조회
  const { data: users } = await supabase
    .from('users')
    .select('id, display_name')
    .in('id', userIds);

  // 4. id -> display_name 매핑
  const userMap = new Map(
    (users ?? []).map((u) => [u.id, u.display_name])
  );

  // 5. 읽지 않은 메시지 읽음 처리
  const unreadIds =
    (messages ?? [])
      .filter((m) => !m.is_read)
      .map((m) => m.id);

  if (unreadIds.length > 0) {
    await supabase
      .from('member_messages')
      .update({ is_read: true })
      .in('id', unreadIds);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Messages
      </h1>

      {(messages ?? []).length === 0 ? (
        <Card>
          <p className="text-gray-500">
            No messages.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {message.subject}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    From: {userMap.get(message.sender_id) ?? 'Unknown'}
                  </p>
                </div>

                {!message.is_read && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                    New
                  </span>
                )}
              </div>

              <p className="mt-4 whitespace-pre-wrap text-gray-700">
                {message.body}
              </p>

              <p className="mt-4 text-xs text-gray-400">
                {new Date(message.created_at).toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

