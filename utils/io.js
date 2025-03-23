import { appendFile } from "node:fs/promises";
import path from "node:path";

export async function logToFile(version, message) {
    const logFile = path.join(process.cwd(), `logs/logs_${version}.txt`);

    try {
        await appendFile(logFile, `[${new Date().toISOString()}] ${message}\n`, "utf-8");
    } catch (error) {
        console.error(`Error logging to file: ${error.message}`);
    }
}