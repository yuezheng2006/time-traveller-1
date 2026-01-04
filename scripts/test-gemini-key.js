const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

async function testKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Testing API Key:", apiKey.substring(0, 10) + "...");
  
  try {
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, are you there?");
    const response = await result.response;
    console.log("✅ API Key is VALID!");
    console.log("Response:", response.text());
  } catch (error) {
    console.error("❌ API Key is INVALID or EXPIRED!");
    if (error.message) {
      console.error("Error Message:", error.message);
    } else {
      console.error(JSON.stringify(error, null, 2));
    }
  }
}

testKey();
