import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import { fileURLToPath } from "url";

import { connectDB } from "../config/db.js";
import Location from "../models/Location.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(
  __dirname,
  "../../data/Locations - RIVO.xlsx"
);

async function seedLocations() {
  try {
    console.log("Reading Excel file...");

    if (!fs.existsSync(filePath)) {
      throw new Error(`Excel file not found at: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      defval: null,
    });

    console.log(`Rows found in Excel: ${rows.length}`);
console.log(rows[0]);
    await connectDB();

    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      // Ignore completely empty rows
      if (
        !row.State &&
        !row.District &&
        !row.Subdistt &&
        !row["Town/Village"]
      ) {
        skipped++;
        continue;
      }

      const locationData = {
        state: row.State?.toString().trim(),
        district: row.District?.toString().trim(),
        subDistrict: row.Subdistt
          ? row.Subdistt.toString().trim()
          : undefined,

        village: row["Town/Village"]
          ? row["Town/Village"].toString().trim()
          : undefined,

        population: Number(row.population) || 0,

        malePopulation: Number(row.TOT_M) || 0,

        femalePopulation: Number(row.TOT_F) || 0,

        households: Number(row.MAIN_HH_P) || 0,

        censusYear: Number(row["census year"]) || 2011,
      };

      // Basic validation
      if (!locationData.state || !locationData.district) {
        skipped++;
        continue;
      }

      await Location.updateOne(
        {
          state: locationData.state,
          district: locationData.district,
          subDistrict: locationData.subDistrict,
          village: locationData.village,
        },
        {
          $set: locationData,
        },
        {
          upsert: true,
        }
      );

      inserted++;
    }

    console.log("=================================");
    console.log("Location seeding completed!");
    console.log(`Processed: ${inserted}`);
    console.log(`Skipped: ${skipped}`);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding locations:", error);
    process.exit(1);
  }
}

seedLocations();