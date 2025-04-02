/**
 * chat.js - 聊天功能核心逻辑
 * 负责处理用户输入、发送API请求、接收和显示AI回复
 */

// 聊天功能类
class ChatManager {
    constructor() {
        // 初始化变量
        this.chatHistory = document.getElementById('chatHistory');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.isWaitingForResponse = false;
        
        // 绑定事件处理方法
        this.bindEvents();
    }
    
    // 绑定事件
    bindEvents() {
        // 发送按钮点击事件
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // 输入框按键事件（按Enter发送消息，Shift+Enter换行）
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }
    
    // 发送消息
    sendMessage() {
        // 获取用户输入内容并去除首尾空格
        const userMessage = this.userInput.value.trim();
        
        // 如果消息为空或正在等待响应，则不处理
        if (!userMessage || this.isWaitingForResponse) return;
        
        // 显示用户消息
        this.addMessageToChat('user', userMessage);
        
        // 清空输入框
        this.userInput.value = '';
        
        // 发送API请求
        this.sendApiRequest(userMessage);
    }
    
    // 添加消息到聊天界面
    addMessageToChat(sender, message) {
        // 创建消息元素
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        // 创建消息内容元素
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // 设置消息内容（支持换行）
        const formattedMessage = message.replace(/\n/g, '<br>');
        contentDiv.innerHTML = `<p>${formattedMessage}</p>`;
        
        // 将内容添加到消息元素
        messageDiv.appendChild(contentDiv);
        
        // 将消息添加到聊天历史
        this.chatHistory.appendChild(messageDiv);
        
        // 滚动到最新消息
        this.scrollToBottom();
    }
    
    // 滚动到聊天底部
    scrollToBottom() {
        this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    }
    
    // 显示加载指示器
    showLoading() {
        this.isWaitingForResponse = true;
        this.loadingIndicator.classList.add('active');
        this.sendBtn.disabled = true;
    }
    
    // 隐藏加载指示器
    hideLoading() {
        this.isWaitingForResponse = false;
        this.loadingIndicator.classList.remove('active');
        this.sendBtn.disabled = false;
    }
    
    // 发送API请求
    sendApiRequest(userMessage) {
        // 显示加载指示器
        this.showLoading();
        
        // 准备AI回复的容器
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'message ai-message';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = '<p></p>';
        
        aiMessageDiv.appendChild(contentDiv);
        this.chatHistory.appendChild(aiMessageDiv);
        
        // 发送请求到后端服务
        fetch('http://localhost:3002/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => {
            // 检查响应是否为流式数据
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiResponse = '';
            
            // 处理流式响应
            const processStream = ({ done, value }) => {
                if (done) {
                    this.hideLoading();
                    return;
                }
                
                // 解码接收到的数据
                const chunk = decoder.decode(value, { stream: true });
                aiResponse += chunk;
                
                // 更新AI回复内容
                contentDiv.innerHTML = `<p>${aiResponse.replace(/\n/g, '<br>')}</p>`;
                
                // 滚动到最新消息
                this.scrollToBottom();
                
                // 继续读取流
                return reader.read().then(processStream);
            };
            
            // 开始读取流
            return reader.read().then(processStream);
        })
        .catch(error => {
            console.error('API请求错误:', error);
            contentDiv.innerHTML = '<p>抱歉，发生了错误，请稍后再试。</p>';
            this.hideLoading();
            this.scrollToBottom();
        });
    }
}

// 导出ChatManager类
window.ChatManager = ChatManager;