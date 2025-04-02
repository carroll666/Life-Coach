/**
 * server.js - Node.js后端服务
 * 负责处理与火山方舟DeepSeek R1 API的通信，并解决CORS问题
 */

// 加载环境变量（本地开发环境）
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// 导入所需模块
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3002;

// 中间件配置
app.use(cors()); // 启用CORS
app.use(bodyParser.json()); // 解析JSON请求体

// 提供静态文件服务
app.use(express.static('.')); // 使用当前工作目录（项目根目录）

// 从环境变量获取API密钥和端点
const API_KEY = process.env.VOLCENGINE_API_KEY;
// API端点
const API_ENDPOINT = process.env.VOLCENGINE_API_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// 系统提示信息（定义AI的角色和行为）
const SYSTEM_PROMPT = `你是一位专业的Life Coach，你的目标是通过对话帮助用户成长和进步。

你应该：
1. 提供有建设性的建议和指导
2. 鼓励用户反思和自我认知
3. 帮助用户设定明确的目标
4. 提供实用的策略和方法
5. 保持积极、支持的态度

你不应该：
1. 给出医疗或心理健康诊断
2. 提供法律或财务专业建议
3. 做出绝对的判断或批评

请用友好、专业的语气与用户交流，提供有深度的思考和实用的建议。`;

// 聊天路由
app.post('/chat', async (req, res) => {
    try {
        // 获取用户消息
        const userMessage = req.body.message;
        
        // 如果没有消息，返回错误
        if (!userMessage) {
            return res.status(400).json({ error: '消息不能为空' });
        }
        
        // 设置响应头，启用流式传输
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        
        // 准备请求体
        const requestBody = {
            model: 'deepseek-r1-250120',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userMessage }
            ],
            stream: true,  // 启用流式输出
            temperature: 0.6  // 设置温度参数
        };
        
        // 发送请求到火山方舟API
        const apiResponse = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestBody),
            timeout: 60000  // 60秒超时设置
        });
        
        // 检查API响应状态
        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('API错误:', errorText);
            return res.status(apiResponse.status).send('API请求失败: ' + errorText);
        }
        
        // 处理流式响应
        apiResponse.body.on('data', (chunk) => {
            // 解析SSE格式的数据
            const chunkStr = chunk.toString();
            const lines = chunkStr.split('\n');
            let responseText = '';
            
            for (const line of lines) {
                if (line.startsWith('data:')) {
                    try {
                        const data = JSON.parse(line.substring(5));
                        if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                            responseText += data.choices[0].delta.content;
                        }
                    } catch (e) {
                        console.error('解析SSE数据错误:', e);
                    }
                }
            }
            
            // 发送解析后的文本到客户端
            if (responseText) {
                res.write(responseText);
            }
        });
        
        apiResponse.body.on('end', () => {
            res.end();
        });
        
    } catch (error) {
        console.error('服务器错误:', error);
        // 如果响应尚未发送，则发送错误响应
        if (!res.headersSent) {
            res.status(500).json({ error: '服务器内部错误' });
        } else {
            // 如果已经开始发送响应，则结束响应
            res.end();
        }
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('Life Coach API服务已启动');
});