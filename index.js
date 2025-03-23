import dotenv from "dotenv";
import findLimit from "./utils/limit.js";
import { logToFile } from "./utils/io.js";

dotenv.config();

const VERSIONS = ["v1", "v2", "v3"];

async function findLimits() {
    try {
        logToFile("global", "⏳ Finding API rate limits for all versions...");
        for (const version of VERSIONS) {
            logToFile(version, `🔍 Finding rate limit...`);
            await findLimit(version);
        }
        logToFile("global", "✅ Rate limit discovery completed!");
    } catch (error) {
        console.error("❌ Error finding rate limits:", error.message);
        logToFile("global", `❌ Error finding rate limits: ${error.message}`);
    }
}

async function main() {
    try {
        console.log("🚀 Starting API processing in stages...");
        logToFile("global", "🚀 Starting API processing in stages...");

        await findLimits();

        console.log("✅ All API processing completed!");
        logToFile("global", "✅ All API processing completed!");
    } catch (error) {
        console.error("❌ Error encountered:", error.message);
        logToFile("global", `❌ Error encountered: ${error.message}`);
    }
}

main();