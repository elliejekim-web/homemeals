"use server";

import { createClient } from "@/lib/supabase/server";



type AddVacationInput = {

  start_date: string;

  end_date: string;

};





export async function addVacation(

  input: AddVacationInput

) {


  const supabase =
    await createClient();




  const {

    data: {
      user

    }

  } =

    await supabase.auth.getUser();




  if(!user){

    throw new Error(
      "Not authenticated"
    );

  }





  const {

    data,

    error

  } =

    await supabase

    .from(
      "vacations"
    )

    .insert({

      user_id:
        user.id,

      start_date:
        input.start_date,

      end_date:
        input.end_date,

 
    })

    .select()

    .single();





  if(error){

    console.error(
      "addVacation error:",
      error
    );


    throw new Error(
      error.message
    );

  }





  return data;

}








export async function deleteVacation(

  id:string

){


  const supabase =
    await createClient();




  const {

    error

  } =

    await supabase

    .from(
      "vacations"
    )

    .delete()

    .eq(
      "id",
      id
    );





  if(error){

    console.error(
      "deleteVacation error:",
      error
    );


    throw new Error(
      error.message
    );

  }



  return true;

}