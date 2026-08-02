"use server";

import { createClient } from "@/lib/supabase/server";
import * as XLSX from "xlsx";

export async function downloadMealReport(
  year: number,
  month: number
) {
  const supabase = await createClient();

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

  const { data, error } = await supabase
    .from("daily_schedule")
    .select(`
      date,
      mass,
      breakfast,
      lunch,
      dinner,
      users (
        display_name
      )
    `)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date");

  if (error) {
    throw error;
  }

  const rows = (data ?? []).map((item) => {
    // 💡 users가 배열 형태일 수도, 단일 객체일 수도 있으므로 안전하게 추출
    const userObj = Array.isArray(item.users) ? item.users[0] : item.users;

    return {
      Date: item.date,
      Name: userObj?.display_name ?? "",
      Mass: item.mass ? "YES" : "NO",
      Breakfast: item.breakfast,
      Lunch: item.lunch,
      Dinner: item.dinner,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Meal Report");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return {
    filename: `meal-report-${year}-${month}.xlsx`,
    file: buffer.toString("base64"),
  };
}