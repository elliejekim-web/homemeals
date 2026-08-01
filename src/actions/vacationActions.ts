"use server";

import { createClient } from "@/lib/supabase/server";


type AddVacationInput = {

  start_date: string;

  end_date: string;

};




export async function addVacation(
  input: AddVacationInput
) {
  const supabase = await createClient();

  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();


  if (!user) {
    throw new Error(
      "Not authenticated"
    );
  }


  // 1. vacation 저장
  const {
    data,
    error
  } = await supabase
    .from("vacations")
    .insert({
      user_id: user.id,
      start_date: input.start_date,
      end_date: input.end_date
    })
    .select()
    .single();


  if (error) {
    console.error(
      "addVacation error",
      error
    );

    throw error;
  }


  // 2. daily_schedule 상태 변경
  const {
    error: scheduleError
  } = await supabase
    .from("daily_schedule")
    .update({
      presence: "VACATION"
    })
    .eq(
      "user_id",
      user.id
    )
    .gte(
      "date",
      input.start_date
    )
    .lte(
      "date",
      input.end_date
    );


  if (scheduleError) {
    console.error(
      "update daily_schedule error",
      scheduleError
    );

    throw scheduleError;
  }


  return data;
}




export async function deleteVacation(
  id:string
){

  const supabase =
    await createClient();


  // 삭제 전 정보 조회
  const {
    data: vacation,
    error: fetchError
  } = await supabase
    .from("vacations")
    .select(
      "user_id,start_date,end_date"
    )
    .eq(
      "id",
      id
    )
    .single();


  if(fetchError){
    throw fetchError;
  }


  // vacation 삭제
  const {
    error
  } = await supabase
    .from("vacations")
    .delete()
    .eq(
      "id",
      id
    );


  if(error){
    throw error;
  }


  // daily_schedule 복구
  const {
    error: restoreError
  } = await supabase
    .from("daily_schedule")
    .update({
      presence:"HOME"
    })
    .eq(
      "user_id",
      vacation.user_id
    )
    .gte(
      "date",
      vacation.start_date
    )
    .lte(
      "date",
      vacation.end_date
    );


  if(restoreError){
    throw restoreError;
  }


  return true;
}