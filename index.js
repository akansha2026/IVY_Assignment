import dotenv from "dotenv";
import findValidChars from "./utils/valid-chars.js";
import findLimit from "./utils/limit.js";
import extract from "./utils/extract.js";
import { logToFile } from "./utils/io.js";
import sleep from "./utils/sleep.js";

dotenv.config();

const VERSIONS = ["v1", "v2", "v3"];

async function findLimits() {
    logToFile("global", "⏳ Finding API rate limits for all versions...");
    try {
        await Promise.all(
            VERSIONS.map(version => {
                logToFile(version, `🔍 Finding rate limit...`);
                return findLimit(version);
            })
        );
        return await logToFile("global", "✅ Rate limit discovery completed!");
    } catch (error) {
        console.error("❌ Error finding rate limits:", error.message);
        logToFile("global", `❌ Error finding rate limits: ${error.message}`);
    }
}

async function findValidCharacters() {
    logToFile("global", "⏳ Finding valid characters for all versions...");
    try {
        await Promise.all(
            VERSIONS.map(version => {
                logToFile(version, `🔍 Finding valid characters...`);
                return findValidChars(version)
            })
        );
        return await logToFile("global", "✅ Valid character discovery completed!");
    } catch (error) {
        console.error("❌ Error finding valid characters:", error.message);
        logToFile("global", `❌ Error finding valid characters: ${error.message}`);
    }
}

async function extractData() {
    logToFile("global", "⏳ Starting data extraction for all versions...");
    try {
        return await Promise.all(
            VERSIONS.map(version => extract(version))
        );
    } catch (error) {
        console.error("❌ Error extracting data:", error.message);
        logToFile("global", `❌ Error extracting data: ${error.message}`);
    }
}

async function main() {
    try {
        console.log("🚀 Starting API processing in stages...");
        await logToFile("global", "🚀 Starting API processing in stages...");

        // Finding Rate limits
        await findLimits();
        await sleep(60)

        // Finding Valid Characters
        await findValidCharacters();
        await sleep(60)

        // Extracting Data
        await extractData();

        console.log("✅ API processing completed successfully!");
    } catch (error) {
        console.error("❌ Error encountered:", error.message);
        await logToFile("global", `❌ Error encountered: ${error.message}`);
    }
}

main();
