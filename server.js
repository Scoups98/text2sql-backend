const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(express.json());

app.post('/api/generate_sql', async (req, res) => {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-0.5B-Instruct', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HF_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const result = await response.json();
        res.json({
            generated_text: result[0]?.generated_text || 'No result'
        });
    } catch (error) {
        console.error('Backend error:', error);
        res.status(500).json({ error: 'Failed to call Hugging Face API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});