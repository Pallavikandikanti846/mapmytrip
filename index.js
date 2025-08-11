//import required modules
import express from "express"; //ES5: const express = require("express");
import path from "path";
import * as url from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname=url.fileURLToPath(new URL(".",import.meta.url));//required for ES6 (gets the pathto the current directory and stores in a variable named __dirname
//set up Express object and port
const app = express();
const port = process.env.PORT || "8888";

app.use(express.static(path.join(__dirname, "public")));
//test message
app.get("/", (req, res) => {
 res.status(200).send("Test page");
});

// search places by name + type
app.get('/search', async (req, res) => {
    const { location, type } = req.query;
    if (!location || !type) {
        return res.status(400).json({ error: 'Missing location or type' });
    }

    try {
        const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(type)}+in+${encodeURIComponent(location)}&key=${process.env.GOOGLE_API_KEY}`;
        const r = await fetch(apiUrl);
        const data = await r.json();
        res.json(data.results);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Could not fetch places' });
    }
});

// nearby places based on coordinates
app.get('/location', async (req, res) => {
    const { latitude, longitude, type } = req.query;
    if (!latitude || !longitude || !type) {
        return res.status(400).json({ error: 'Missing latitude, longitude or type' });
    }

    try {
        const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${encodeURIComponent(type)}&key=${process.env.GOOGLE_API_KEY}`;
        const r = await fetch(apiUrl);
        const data = await r.json();
        res.json(data.results);
    } catch (err) {
        console.error('Nearby error:', err);
        res.status(500).json({ error: 'Could not fetch nearby places' });
    }
});
//set up server listening
app.listen(port, () => {
 console.log(`Listening on http://localhost:${port}`);
});
