"use server";

import { createClient } from "@/lib/supabase/server";


type ScheduleUpdate = {

  date: string;

  mass: boolean;

  breakfast: "EARLY" | "NORMAL" | "LATE" | "NONE";

  lunch: "EARLY" | "NORMAL" | "LATE" | "NONE";

  dinner: "EARLY" | "NORMAL" | "LATE" | "NONE";

};



export async function saveDailySchedule(

  schedules: ScheduleUpdate[]

) {


  const supabase =
    await createClient();



  /*
    현재 로그인 사용자 확인
  */

  const {
    data:{
      user
    }

  } =
    await supabase.auth.getUser();



  if(!user){

    throw new Error(
      "User is not authenticated"
    );

  }





  /*
    저장할 데이터 생성

    변경된 날짜만 들어옴

  */

  const rows =

    schedules.map(

      item => ({

        user_id: user.id,

        date: item.date,

        mass: item.mass,

        breakfast: item.breakfast,

        lunch: item.lunch,

        dinner: item.dinner,

      })

    );





  /*
    변경된 날짜만 upsert

  */

  if(rows.length > 0){

    const {
      error
    } =

      await supabase
      .from(
        "daily_schedule"
      )
      .upsert(

        rows,

        {
          onConflict:
            "user_id,date"
        }

      );



    if(error){

      console.error(
        "saveDailySchedule error:",
        error
      );


      throw error;

    }

  }




  return {

    success:true,

  };

}