"use client";

import { useState } from "react";
import { saveVacation } from "@/actions/saveVacation";

export default function VacationForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");

  async function save() {
  try {
    if (!startDate || !endDate) {
      alert("Please select start and end dates");
      return;
    }

    await saveVacation({
      startDate,
      endDate,
      note,
    });

    alert("Vacation saved");

    setStartDate("");
    setEndDate("");
    setNote("");
  } catch (error) {
    console.error(error);
    alert("Failed to save vacation");
  }
}

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">
          Start date
        </label>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          End date
        </label>

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Note (optional)
        </label>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Family trip, retreat, pilgrimage, etc."
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={save}
          className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Save Vacation
        </button>
      </div>
    </div>
  );
}