export type DailySchedule = {
  id: string;
  user_id: string;
  date: string;

  mass: boolean;

  breakfast: "EARLY" | "NORMAL" | "LATE";
  lunch: "EARLY" | "NORMAL" | "LATE";
  dinner: "EARLY" | "NORMAL" | "LATE";

  presence: "HOME" | "OUT" | "OVERNIGHT";
};