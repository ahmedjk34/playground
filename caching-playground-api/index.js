const express = require("express");
require("dotenv").config();

const db = require("./src/db");
const MemoryCache = require("./classes/MemoryCache");

const PORT = process.env.PORT || 3000;
const app = express();

const memCache = new MemoryCache();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/businesses", async (req, res) => {
  const start = Date.now();

  try {
    const city = req.query.city;
    const type = req.query.type;

    if (!city || !type) {
      return res.status(400).json({
        error: "city and type are required",
      });
    }

    const key = `businesses:city=${city}:type=${type}`;

    const itemFromCache = memCache.get(key);

    if (itemFromCache) {
      return res.status(200).json({
        source: "cache",
        durationMs: Date.now() - start,
        data: itemFromCache,
      });
    }

    const result = await db.query(
      `
      SELECT *
      FROM businesses
      WHERE city = $1 AND type = $2
      ORDER BY rating DESC
      LIMIT 50
      `,
      [city, type],
    );

    memCache.set(key, result.rows, 60);

    return res.status(200).json({
      source: "db",
      durationMs: Date.now() - start,
      data: result.rows,
    });
  } catch (err) {
    console.error("Business search failed:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is alive on port ${PORT}`);
});
