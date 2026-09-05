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
  "../../data/task1-2.xlsx"
);

async function seedLocations() {
  try {
    console.log("Reading Excel file...");

    if (!fs.existsSync(filePath)) {
      throw new Error(`Excel file not found at: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);

    const worksheet = workbook.Sheets["Location_Population"];

    if (!worksheet) {
      throw new Error(
        "Location_Population sheet not found in task1-2.xlsx"
      );
    }

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      defval: null,
      blankrows: false,
    });

    console.log(`Rows found in Excel: ${rows.length}`);

    await connectDB();

    let processed = 0;
    let skipped = 0;

    for (const row of rows) {
      if (
        !row.State &&
        !row.District &&
        !row.Subdistt &&
        !row.Name &&
        !row["Town/Village"]
      ) {
        skipped++;
        continue;
      }

      const state = row.State
        ? String(row.State).trim()
        : undefined;

      const district = row.District
        ? String(row.District).trim()
        : undefined;

      const subDistrict = row.Subdistt
        ? String(row.Subdistt).trim()
        : undefined;

      const village = row["Town/Village"]
        ? String(row["Town/Village"]).trim()
        : undefined;

      if (!state || !district) {
        skipped++;
        continue;
      }

      const locationData = {
        state,
        district,
        subDistrict,
        village,

        population:
          row.population !== null &&
          row.population !== ""
            ? Number(row.population)
            : 0,

        malePopulation:
          row.TOT_M !== null &&
          row.TOT_M !== ""
            ? Number(row.TOT_M)
            : 0,

        femalePopulation:
          row.TOT_F !== null &&
          row.TOT_F !== ""
            ? Number(row.TOT_F)
            : 0,

        households:
          row.MAIN_HH_P !== null &&
          row.MAIN_HH_P !== ""
            ? Number(row.MAIN_HH_P)
            : 0,

        censusYear:
          row["census year"] !== null &&
          row["census year"] !== ""
            ? Number(row["census year"])
            : 2011,
      };

      /*
       * Use the Census hierarchy as the unique identity.
       * We intentionally do NOT create duplicate documents
       * for the repeated aggregate records.
       */

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

      processed++;

      if (processed % 1000 === 0) {
        console.log(`Processed: ${processed}`);
      }
    }

    console.log("=================================");
    console.log("Location seeding completed!");
    console.log(`Processed: ${processed}`);
    console.log(`Skipped: ${skipped}`);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding locations:", error);
    process.exit(1);
  }
}

seedLocations();