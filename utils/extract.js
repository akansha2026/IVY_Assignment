import { readNames, writeNames, logToFile } from "./io.js";
import { RATE_LIMITS } from "./limit.js";
import Queue from "./queue.js";
import { sendRequest } from "./request.js";
import sleep from "./sleep.js";
import { VALID_CHARS } from "./valid-chars.js";

export default async function extract(version) {
    const limit = RATE_LIMITS[version];
    const validChars = VALID_CHARS[version];

    let allNames = readNames(version);
    const names = new Set(allNames || []); // Using Set to avoid duplicates
    let count = 1;

    const queue = new Queue();
    for (const char of validChars) queue.push(char);

    while (!queue.empty()) {
        if (count > limit) {
            logToFile(version, `🎉 Partial extraction complete. Current unique names: ${names.size}`);
            allNames = Array.from(names);
            writeNames(allNames, version);
            count = 1;
            await sleep(60);
        }

        const pre = queue.front();
        queue.pop();

        const data = await sendRequest(pre, version);
        count++;

        if (data.detail) {
            logToFile(version, `🚦 Too many requests. retrying after 60 seconds...`);
            queue.push(pre)
            await sleep(60);
            continue;
        }

        if (data.count === 0) continue;
        data.results.forEach(name => names.add(name));

        for (const char of validChars) {
            queue.push(pre + char);
        }
    }

    logToFile(version, `🎉 Extraction complete. Total unique names: ${names.size}`);
    allNames = Array.from(names);
    writeNames(allNames, version);
}