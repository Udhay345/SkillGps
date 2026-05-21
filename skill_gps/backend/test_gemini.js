const axios = require('axios');

async function testModel() {
    const GEMINI_API_KEY = 'YOURAPIKEY';
    try {
        console.log('Testing gemini-flash-latest...');
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ role: 'user', parts: [{ text: 'Respond with the word SUCCESS only.' }] }]
            }
        );
        console.log('Reply:', response.data.candidates[0].content.parts[0].text);
    } catch (err) {
        console.log('❌ Failed:', err.response?.data || err.message);
    }
}

testModel();
  
