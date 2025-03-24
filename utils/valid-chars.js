import { logToFile } from "./io.js";
import { RATE_LIMITS } from "./limit.js"
import sendParallelRequests from "./request.js"
import sleep from "./sleep.js"

const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@$%^*()-_=[{}];:\'",<>./?\|'

// + -> if we put it at start or at end, then it doesn't have any effect, rather it just a redundancy, but if we put it in middle it will have an effct and there is no word containing + as character
// &, and # -> This is a reserved symbol which is by default part of the URL so it also can't be used
// (space) -> if we provide space at begining then by default it will return all the string starting from the lowest possible ascii value characters used by the API, which is 'a' (for v1), '0' (v2 & v3) but if we put it in middle then only in v3 it is supported


export default async function findValidChars(version) {
    logToFile(version, `🔍 Finding valid characters for version: ${version}`);

    let validChars = [];
    const limit = RATE_LIMITS[version];
    let cnt = 1;
    let queries = [];

    for (const char of characters) {
        queries.push(char);

        if (queries.length == limit) {
            logToFile(version, `📡 Sending batch of ${queries.length} requests...`);
            validChars.push(...(await processBatch(queries, version)));
            queries = [];
            logToFile(version, `⏳ Waiting for rate limit reset...`);
            await sleep(60);
        }
    }

    if (queries.length > 0) {
        logToFile(version, `📡 Sending final batch of ${queries.length} requests...`);
        validChars.push(...(await processBatch(queries, version)));
    }

    logToFile(version, `✅ Found ${validChars.length} valid characters.`);
    logToFile(version, `✅ Valid characters are: ${validChars.join(", ")}`)
    return validChars;
}

async function processBatch(queries, version) {
    const ans = [];
    try {
        const responses = await sendParallelRequests(queries, version);

        for (let i = 0; i < queries.length; i++) {
            const data = await responses[i].json();
            if (data.count > 0) ans.push(queries[i]);
        }

        return ans;
    } catch (error) {
        logToFile(version, `❌ Error processing batch: ${error.message}`);
        throw error;
    }
}


// Findings
export const VALID_CHARS = {
    "v1": [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z"
    ],
    "v2": [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
    ],
    "v3": [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        " "
    ]
}