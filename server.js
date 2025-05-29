const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post('/api/generate_sql', async (req, res) => {
    try {
        // 打印 token 信息，调试环境变量
        console.log('HF_TOKEN:', process.env.HF_TOKEN);

        const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2-0.5B-Instruct', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HF_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const result = await response.json();

        // 打印 Hugging Face 返回的数据
        console.log('HF API result:', result);

        // 临时返回完整内容，便于前端调试
        res.json({
            raw: result,
            generated_text: Array.isArray(result) && result[0]?.generated_text ? result[0].generated_text : (result.error || 'No result')
        });
    } catch (error) {
        console.error('Backend error:', error);
        // 返回详细错误信息
        res.status(500).json({ error: error.message || 'Failed to call Hugging Face API' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
