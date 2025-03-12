document.addEventListener('DOMContentLoaded', function() {
    // Remove any existing floating buttons that might be cached
    const oldButtons = document.querySelectorAll('.floating-button, [src*="ai-chat-icon.svg"]');
    oldButtons.forEach(button => button.remove());
    
    // Create AI Assistant element
    createAIAssistant();
    
    // Initialize AI Assistant functionality
    initAIAssistant();
    
    // Start with the chat minimized
    const aiAssistant = document.querySelector('.ai-assistant');
    aiAssistant.style.display = 'none';
    
    // Create and show the floating button right away
    const floatingButton = createFloatingButton();
    floatingButton.style.display = 'flex'; // Make it visible immediately
    
    // No longer automatically opening the chat after 2 seconds
    // User will need to click on the purple button to open the chat
}); 