"use client";

import { downloadMealReport } from "@/actions/reportActions";

export default function MealReportButton({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  async function download() {
    try {
      const result = await downloadMealReport(
        year,
        month
      );

      const byteCharacters = atob(result.file);

      const byteNumbers = new Array(
        byteCharacters.length
      );

      for (
        let i = 0;
        i < byteCharacters.length;
        i++
      ) {
        byteNumbers[i] =
          byteCharacters.charCodeAt(i);
      }

      const byteArray =
        new Uint8Array(byteNumbers);

      const blob = new Blob(
        [byteArray],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        result.filename;

      document.body.appendChild(a);

      a.click();

      a.remove();

      URL.revokeObjectURL(url);

    } catch (error) {
      console.error(
        "Excel download failed:",
        error
      );

      alert(
        "Failed to download report."
      );
    }
  }


  return (
    <button
      onClick={download}
      className="
        rounded
        bg-blue-600
        px-4
        py-2
        text-white
      "
    >
      Download Excel
    </button>
  );
}