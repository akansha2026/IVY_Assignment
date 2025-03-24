# **API Data Extractor**

## **Overview**
This project is an automated API data extractor that:
- Determines API rate limits dynamically
- Identifies valid query characters
- Extracts data efficiently using **BFS traversal**
- Stops querying when no further responses are received for a prefix
- Saves extracted data in JSON format
- Logs progress for monitoring

It uses **parallel requests** and **queue-based BFS processing** to maximize efficiency while respecting rate limits.

---

## **Features**
✅ **Automated Rate Limit Detection** – Determines API request limits dynamically  
✅ **Parallel Requests** – Speeds up data extraction within allowed limits  
✅ **BFS Query Traversal** – Systematic prefix-based exploration  
✅ **Logging & Error Handling** – Saves logs for debugging and tracking  
✅ **JSON Data Storage** – Saves extracted data for easy retrieval  

---

## **Installation**

1. **Clone the repository**  
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```  

2. **Install dependencies**  
   ```bash
   npm install
   ```  

3. **Set up environment variables**  
   Create a `.env` file in the project root and add:  
   ```env
   BASE_URL=<your-api-base-url>
   ```  

---

## **Usage**

### **Extract Data from API**
Run the main extraction script:
```bash
node index.js
```

### **Log Output**
Logs are stored in the `logs/` directory:
```plaintext
logs/logs_global.txt
logs/logs_v1.txt
logs/logs_v2.txt
logs/logs_v3.txt
```

---

## **Project Structure**

```
📂 project-root  
 ┣ 📂 data/              # Stores extracted JSON data  
 ┣ 📂 logs/              # Stores log files  
 ┣ 📂 utils/  
 ┃ ┣ 📜 extract.js       # BFS-based extraction logic  
 ┃ ┣ 📜 io.js            # Handles file reading/writing  
 ┃ ┣ 📜 limit.js         # Determines API rate limits  
 ┃ ┣ 📜 queue.js         # Implements queue for BFS  
 ┃ ┣ 📜 request.js       # Sends API requests (parallel + single)  
 ┃ ┣ 📜 valid-chars.js   # Finds valid query characters  
 ┃ ┣ 📜 sleep.js         # Implements sleep delays  
 ┣ 📜 index.js           # Entry point for data extraction  
 ┣ 📜 package.json       # Dependencies & scripts  
 ┣ 📜 .env               # API base URL config  
 ┗ 📜 README.md          # Project documentation  
```

---

## **How It Works**

### **1. Find API Rate Limits**
- `limit.js` determines the maximum requests per minute using **binary search**.

### **2. Discover Valid Query Characters**
- `valid-chars.js` sends parallel requests to find valid characters.

### **3. BFS-Based Data Extraction**
- `extract.js` systematically queries API endpoints using **BFS traversal**.
- Each query starts from an empty string (`""`), expanding prefixes (`a`, `ab`, etc.).
- If no valid names are found for a prefix, further queries are stopped.
- Extracted names are **stored in JSON** and **logged**.

---

## **Example JSON Output (`data/names.json`)**

```json
{
  "v1": ["Alice", "Bob", "Charlie"],
  "v2": ["Xander", "Yasmine", "Zane"],
  "v3": ["Xander", "Yasmine"]
}
```

---

## **Error Handling & Logging**

- **Handles API rate limits dynamically** (`429 Too Many Requests`)  
- **Retries failed requests** and **logs errors**  
- **Pauses execution** when rate limits are exceeded  

---

## **Observations**
This project is open-source. Feel free to modify and enhance it!  

1. There are 3 API versions available
   1. /v1/autocomplete?query=<some_string>
   2. /v2/autocomplete?query=<some_string>
   3. /v3/autocomplete?query=<some_string>
2. The rate limit corresponding to each version is asfollows
   1. v1 : 100 req/min
   2. v2 : 50 req/min
   3. v3 : 80 req/min
3. One thing to note is that the rate limit can be found in two ways, 
   1. We send too many request at once and server responds with 429 status, and in your case it directly present in `details` ![v1](image.png)
   2. Or if in any case server doesn't respond directly with rate limit then we can use the algorithm that I had written using binary search, the logic is simple.. send `X` number of requests if ay one failed then it can't be the rate limit, so go `low`, otherwise go `high`
4. The valid characters set corresponding to each version is
   1. v1: {a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z}  
   2. v2: {a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9}  
   3. v3: {a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, " "}  
   4. `+` : If we put it at start or at end, then it doesn't have any effect, rather it just a redundancy, but if we put it in middle it will have an effct and there is no word containing `+` as character.
   5. `&`, and `#` : This is a reserved symbol which is by default part of the URL so it also can't be used.
   6. `" "` : If we provide space at begining then by default it will return all the string starting from the lowest possible ascii value characters used by the API, which is `a` (for v1), `0` (v2 & v3) but if we put it in middle then only in v3 it is supported.

## Number of unique names extracted
1. `v1`: 7820
2. `v12`: 7873
3. `v3`: 7156
