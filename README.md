# Life Coach 网站

## 项目介绍
这是一个基于火山方舟DeepSeek R1 API的Life Coach网站，通过与AI对话，获取个人成长建议和指导。网站提供简洁直观的聊天界面，让用户可以方便地与AI进行交流，获取生活、学习、工作等方面的建议。

## 项目结构
```
├── README.md          # 项目说明文档
├── index.html         # 网站主页面
├── css/               # 样式文件目录
│   └── style.css      # 主样式文件
├── js/                # JavaScript文件目录
│   ├── main.js        # 前端主逻辑
│   └── chat.js        # 聊天功能逻辑
└── server/            # 后端服务目录
    └── server.js      # Node.js后端服务
```

## 页面结构说明

### 主页面 (index.html)
- **页眉区域**：包含网站标题和简短介绍
- **聊天区域**：
  - 聊天历史记录显示区
  - 用户输入框
  - 发送按钮
- **页脚区域**：包含版权信息和必要链接

## 功能说明
1. **用户输入处理**：捕获用户输入的问题或需求
2. **API请求发送**：将用户输入发送到火山方舟DeepSeek R1 API
3. **流式响应处理**：实时显示AI的回复
4. **聊天历史记录**：保存和显示对话历史

## 样式说明
- 采用响应式设计，适配不同设备屏幕
- 使用柔和的色彩方案，提供舒适的视觉体验
- 聊天气泡区分用户和AI的消息
- 简洁明了的布局，突出聊天内容

## 技术实现
- 前端：HTML5、CSS3、JavaScript
- 后端：Node.js (处理API请求和CORS问题)
- API：火山方舟DeepSeek R1 API
- 环境变量：使用dotenv管理本地开发环境变量，Vercel环境变量用于生产环境

## 使用说明

### 本地开发环境配置
1. 复制`.env.example`文件并重命名为`.env`
2. 在`.env`文件中填入你的火山方舟API密钥
3. 安装依赖：`npm install`
4. 启动后端服务：`node server/server.js`或`npm run dev`
5. 服务器将在http://localhost:3002上运行
6. 在浏览器中打开index.html或通过本地服务器访问
7. 在聊天框中输入问题或需求
8. 等待AI回复并继续对话

### Vercel部署配置
1. 在Vercel项目设置中，找到「Environment Variables」选项
2. 添加以下环境变量：
   - `VOLCENGINE_API_KEY`: 你的火山方舟API密钥
   - `VOLCENGINE_API_ENDPOINT`: API端点地址（默认为https://ark.cn-beijing.volces.com/api/v3/chat/completions）
3. 保存环境变量设置
4. 重新部署项目

注意：请确保不要在代码中硬编码API密钥，始终使用环境变量来保护敏感信息。