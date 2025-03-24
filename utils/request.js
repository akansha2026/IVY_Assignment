import { RATE_LIMITS } from "./limit.js"

export default async function sendParallelRequests(queries, version){
    const BASE_URL = process.env.BASE_URL
    if(queries.length > RATE_LIMITS[version]) throw new Error(`"queries" should be at most of ${RATE_LIMITS[version]} length`)

    const promises = []
    for(const query of queries){
        const promise = fetch(`${BASE_URL}/${version}/autocomplete?query=${query}`)
        promises.push(promise)
    }

    return Promise.all(promises)
}

export async function sendRequest(query, version){
    const BASE_URL = process.env.BASE_URL

    const response = await fetch(`${BASE_URL}/${version}/autocomplete?query=${query}`)
    return response.json();
}