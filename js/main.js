/**
 * main.js - 前端主逻辑
 * 负责初始化聊天管理器和其他前端功能
 */

// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化聊天管理器
    const chatManager = new ChatManager();
    
    // 在控制台输出初始化信息
    console.log('Life Coach 应用已初始化');
    
    // 添加页面响应式调整
    window.addEventListener('resize', () => {
        // 确保聊天区域在窗口大小变化时保持滚动到底部
        chatManager.scrollToBottom();
    });
    
    // 添加文本区域自动调整高度功能
    const userInput = document.getElementById('userInput');
    userInput.addEventListener('input', function() {
        // 重置高度以获取正确的scrollHeight
        this.style.height = 'auto';
        
        // 设置新高度，但限制最大高度
        const maxHeight = 150; // 最大高度（像素）
        const newHeight = Math.min(this.scrollHeight, maxHeight);
        this.style.height = newHeight + 'px';
    });
    
    // 初始聚焦到输入框
    userInput.focus();
});