
const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY.trim();
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    try {
        const json = JSON.parse(data);
        if (json.models) {
            console.log("Available models:", json.models.map(m => m.name));
        } else {
            console.log("Response:", data);
        }
    } catch (e) {
        console.log("Error parsing JSON:", e);
        console.log("Raw data:", data);
    }
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
