"use client";

import Link from "next/link";
import { useState } from "react";

import MealCard from "@/components/member/MealCard";
import MassCheckbox from "@/components/member/MassCheckbox";

import { getMealStatus } from "@/lib/schedule/getMealStatus";
import { saveDailySchedule } from "@/lib/schedule/saveDailySchedule";



type MealOption = "EARLY" | "NORMAL" | "LATE";

type Schedule = {
  id: string;
  date: string;
  mass: boolean;
  breakfast: MealOption;
  lunch: MealOption;
  dinner: MealOption;
};

type Props = {
  schedule: Schedule;
};

export default function MemberForm({ schedule }: Props) {
  const [mass, setMass] = useState(schedule.mass);

  const [breakfast, setBreakfast] = useState<MealOption>(
    schedule.breakfast
  );

  const [lunch, setLunch] = useState<MealOption>(
    schedule.lunch
  );

  const [dinner, setDinner] = useState<MealOption>(
    schedule.dinner
  );

  const [saving, setSaving] = useState(false);

  const mealStatus = getMealStatus(
    new Date(schedule.date)
  );

  async function save() {
    setSaving(true);

    const { error } = await saveDailySchedule(
      schedule.id,
      {
        mass,
        breakfast,
        lunch,
        dinner,
      }
    );

    setSaving(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert("Saved!");
  }

  return (
    <div className="max-w-2xl mx-auto">

      <div className="flex items-center justify-between mb-8">
  

  <div className="flex items-center justify-between mb-8">
  <h1 className="text-3xl font-bold">
    Today's Meals
  </h1>

  <div className="flex gap-2">
    <Link
      href="/member/settings"
      className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
    >
      ⚙️ Weekly Defaults
    </Link>

    <Link
      href="/member/messages"
      className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
    >
      ✉️ Contact Admin
    </Link>
  </div>
</div>

</div>

      <MassCheckbox
        value={mass}
        onChange={setMass}
      />

      <MealCard
        icon="🍳"
        title="Breakfast"
        status={mealStatus.breakfast.status}
        closeTime={mealStatus.breakfast.message}
        value={breakfast}
        disabled={mealStatus.breakfast.locked}
        onChange={setBreakfast}
      />

      <MealCard
        icon="🥪"
        title="Lunch"
        status={mealStatus.lunch.status}
        closeTime={mealStatus.lunch.message}
        value={lunch}
        disabled={mealStatus.lunch.locked}
        onChange={setLunch}
      />

      <MealCard
        icon="🍛"
        title="Dinner"
        status={mealStatus.dinner.status}
        closeTime={mealStatus.dinner.message}
        value={dinner}
        disabled={mealStatus.dinner.locked}
        onChange={setDinner}
      />

      <button
        onClick={save}
        disabled={saving}
        className="
          mt-8
          w-full
          rounded-xl
          bg-blue-600
          py-4
          text-lg
          font-semibold
          text-white
          hover:bg-blue-700
          disabled:bg-gray-400
        "
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
}