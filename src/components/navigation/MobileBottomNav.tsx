'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isMember = pathname.startsWith('/member');
  const isAdmin = pathname.startsWith('/admin');

  if (!isMember && !isAdmin) return null;

  const links = isMember
    ? [
        { label: 'Home', href: '/member', icon: '🏠' },
        { label: 'Schedule', href: '/member/schedule', icon: '📅' },
        { label: 'Vacation', href: '/member/vacation', icon: '✈️' },
        { label: 'Messages', href: '/member/messages', icon: '✉️' },
      ]
    : [
        { label: 'Dashboard', href: '/admin', icon: '📊' },
        { label: 'Members', href: '/admin/members', icon: '👥' },
        { label: 'Messages', href: '/admin/messages', icon: '✉️' },
        { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/90 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-0.5 text-[11px] font-semibold transition-colors ${
                active ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}