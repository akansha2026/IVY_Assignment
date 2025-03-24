import { readFileSync } from "node:fs";
import { writeFile, appendFile } from "node:fs/promises";
import path from "node:path";

export function readNames(version) {
    const filePath = path.join(process.cwd(), `/data/names_${version}.json`)

    try {
        const text = readFileSync(filePath, "utf-8");
        return text.length ? JSON.parse(text) : [];
    } catch (error) {
        console.error(`Error reading names.json: ${error.message}`);
        return {};
    }
}

export async function writeNames(names, version) {
    const filePath = path.join(process.cwd(), `/data/names_${version}.json`)

    try {
        await writeFile(filePath, JSON.stringify(names, null, 2), "utf-8");
    } catch (error) {
        console.error(`Error writing to names.json: ${error.message}`);
    }
}

export async function logToFile(version, message) {
    const logFile = path.join(process.cwd(), `logs/logs_${version}.txt`);

    try {
        await appendFile(logFile, `[${new Date().toISOString()}] ${message}\n`, "utf-8");
    } catch (error) {
        console.error(`Error logging to file: ${error.message}`);
    }
}