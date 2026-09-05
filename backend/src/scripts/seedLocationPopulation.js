import mongoose from "mongoose";
import XLSX from "xlsx";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import LocationPopulation from "../models/LocationPopulation.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_FILE = path.join(
  __dirname,
  "../../data/task1-2.xlsx"
);

const BATCH_SIZE = 1000;

async function seedLocationPopulation() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
    console.log("Reading Excel file...");

    const workbook = XLSX.readFile(EXCEL_FILE);

    const sheet = workbook.Sheets["Location_Population"];

    if (!sheet) {
      throw new Error(
        "Location_Population sheet not found in task1-2.xlsx"
      );
    }

    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: null,
      blankrows: false
    });

    console.log("Rows read from Excel: " + rows.length);

    let batch = [];
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

      const document = {
        state: row.State
          ? String(row.State).trim()
          : null,

        district: row.District
          ? String(row.District).trim()
          : null,

        subDistrict: row.Subdistt
          ? String(row.Subdistt).trim()
          : null,

        name: row.Name
          ? String(row.Name).trim()
          : null,

        townVillage: row["Town/Village"]
          ? String(row["Town/Village"]).trim()
          : null,

        population:
          row.population !== null &&
          row.population !== ""
            ? Number(row.population)
            : null,

        malePopulation:
          row.TOT_M !== null &&
          row.TOT_M !== ""
            ? Number(row.TOT_M)
            : null,

        femalePopulation:
          row.TOT_F !== null &&
          row.TOT_F !== ""
            ? Number(row.TOT_F)
            : null,

        mainHouseholds:
          row.MAIN_HH_P !== null &&
          row.MAIN_HH_P !== ""
            ? Number(row.MAIN_HH_P)
            : null,

        censusYear:
          row["census year"] !== null &&
          row["census year"] !== ""
            ? Number(row["census year"])
            : null
      };

      batch.push(document);

      if (batch.length === BATCH_SIZE) {

        await LocationPopulation.insertMany(batch);

        processed = processed + batch.length;

        console.log("Inserted: " + processed);

        batch = [];
      }
    }

    if (batch.length > 0) {

      await LocationPopulation.insertMany(batch);

      processed = processed + batch.length;

      console.log("Inserted: " + processed);
    }

    console.log("=================================");
    console.log("Location population seeding completed!");
    console.log("Processed: " + processed);
    console.log("Skipped: " + skipped);
    console.log("=================================");

  } catch (error) {

    console.error("Seeding failed:");
    console.error(error);

  } finally {

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  }
}

seedLocationPopulation();
