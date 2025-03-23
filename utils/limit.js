import sleep from "./sleep.js";
import { logToFile } from "./io.js";

export default async function findLimit(version) {
    logToFile(version, `🔍 Finding rate limit for version: ${version}`);

    const BASE_URL = process.env.BASE_URL;
    let low = 1, high = 250, ans = 0;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const promises = Array.from({ length: mid }, () => fetch(`${BASE_URL}/${version}/autocomplete?query=a`));

        logToFile(version, `🚀 Sending ${mid} requests...`);
        const responses = await Promise.all(promises);

        if (responses.some(res => res.status === 429)) {
            high = mid - 1;
            logToFile(version, `❌ Rate limit exceeded at ${mid} requests.`);
        } else {
            low = mid + 1;
            ans = mid;
            logToFile(version, `✅ ${mid} requests passed, increasing target.`);
        }

        logToFile(version, `⏳ Waiting 60s before next batch...`);
        await sleep(60);
    }

    logToFile(version, `🎯 Final rate limit for version ${version}: ${ans} requests/min`);
    return ans;
}

// Findings
export const RATE_LIMITS = {
    'v1': 100,
    'v2': 50,
    'v3': 80
};