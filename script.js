// Add a global flag to prevent mention modal from showing after message is sent
window.preventMentionModal = false;

document.addEventListener('DOMContentLoaded', function() {
    // Create AI Assistant element
    createAIAssistant();
    
    // Initialize AI Assistant functionality
    initAIAssistant();
    
    // Initially hide the AI Assistant
    const aiAssistant = document.querySelector('.ai-assistant');
    aiAssistant.style.display = 'none';
    
    // Show floating button immediately
    const floatingButton = document.querySelector('.floating-button');
    if (floatingButton) {
        floatingButton.style.display = 'flex';
        floatingButton.style.position = 'fixed';
        floatingButton.style.right = '32px';
        floatingButton.style.bottom = '32px';
    }
    
    // Ensure both submit buttons are disabled on page load
    document.querySelector('.submit-btn').disabled = true;
    document.querySelector('.ai-assistant-send').disabled = true;
    
    // Add event listeners for example cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const promptText = this.querySelector('p').textContent;
            const promptInput = document.querySelector('.prompt-container input');
            promptInput.value = promptText;
            // Enable submit button when text is added from example card, but only if not empty
            document.querySelector('.submit-btn').disabled = promptText.trim() === '';
        });
    });
    
    // Add event listener for submit button
    const dashboardSubmitBtn = document.querySelector('.submit-btn');
    const dashboardInput = document.querySelector('.prompt-container input');
    
    // Add input event listener to enable/disable submit button based on input content
    dashboardInput.addEventListener('input', function() {
        dashboardSubmitBtn.disabled = this.value.trim() === '';
    });
    
    dashboardSubmitBtn.addEventListener('click', function() {
        const promptValue = document.querySelector('.prompt-container input').value;
        // Double-check that the input is not empty before proceeding
        if (promptValue.trim() !== '') {
            // Show AI Assistant if it's hidden or collapsed
            const aiAssistant = document.querySelector('.ai-assistant');
            if (aiAssistant.style.display === 'none') {
                aiAssistant.style.display = 'flex';
                
                // Hide the floating button when the chat opens
                const floatingButton = document.querySelector('.floating-button');
                if (floatingButton) {
                    floatingButton.style.display = 'none';
                }
            }
            if (aiAssistant.classList.contains('collapsed')) {
                toggleAIAssistant();
            }
            
            // Add user message to AI Assistant
            addMessage('user', promptValue);
            
            // Simulate AI response
            setTimeout(() => {
                const contextResponse = "I'll help you create a flow based on your requirements. Let's break this down into steps.";
                addMessage('ai', contextResponse);
                
                // Show step indicator
                showStepIndicator();
                
                // Add context tip
                addContextTip("I've detected you're in the Flow Builder. I'll guide you through creating a data pipeline.");
            }, 1000);
        }
    });
    
    // Setup @ mention feature
    setupMentionFeature();
    
    // Show welcome message after a short delay
    setTimeout(showWelcomeMessageAndOpenChat, 2000);
});


// Function to show welcome message and open the chat
function showWelcomeMessageAndOpenChat() {
    // Show the AI Assistant
    const aiAssistant = document.querySelector('.ai-assistant');
    aiAssistant.style.display = 'flex';
    
    // Hide the floating button when chat opens
    const floatingButton = document.querySelector('.floating-button');
    if (floatingButton) {
        floatingButton.style.display = 'none';
    }
    
    // First remove the default welcome message
    const messagesContainer = document.querySelector('.ai-assistant-messages');
    messagesContainer.innerHTML = '';
    
    // Add the new welcome message
    const welcomeMessage = `Hey there! Welcome to Keboola! 🎉 I'm your AI Assistant, here to help you get started.


Here are a few things you can do:
 ✅ Explore the Demo project
 🎓 Watch our Academy tutorials
 📖 Check the Documentation


Need help? Just ask!`;
    
    // For the welcome message, bypass the typing indicator to show it immediately
    const messageElement = addActualMessage('ai', welcomeMessage);
    
    // Add link cards directly after the message with a slight delay
    setTimeout(() => {
        // Use the documentation SVG for all cards
        const demoCard = createActionCardWithDocIcon(
            'Demo Project', 
            'See Keboola in action with our sample project',
            '#demo-project'
        );
        
        const academyCard = createActionCardWithDocIcon(
            'Academy', 
            'Learn Keboola with step-by-step tutorials', 
            'https://academy.keboola.com'
        );
        
        const docsCard = createActionCardWithDocIcon(
            'Documentation', 
            'Read comprehensive guides and references', 
            'https://help.keboola.com'
        );
        
        // Add cards directly to the messages container
        messagesContainer.appendChild(demoCard);
        messagesContainer.appendChild(academyCard);
        messagesContainer.appendChild(docsCard);
        
        // Ensure everything is scrolled into view
        const aiAssistantBody = document.querySelector('.ai-assistant-body');
        setTimeout(() => {
            aiAssistantBody.scrollTop = messagesContainer.scrollHeight;
        }, 10);
    }, 100); // Reduced delay to make cards appear more quickly after the message
}


// Function to create action cards with documentation icon
function createActionCardWithDocIcon(title, description, url) {
    const card = document.createElement('a');
    card.href = url;
    card.className = 'keboola-link-card';
    if (url.startsWith('http')) {
        card.target = '_blank'; // Open external links in new tab
    }
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'keboola-link-icon';
    
    // Create SVG element for documentation icon
    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("width", "20");
    svgIcon.setAttribute("height", "20");
    svgIcon.setAttribute("viewBox", "0 0 20 20");
    svgIcon.setAttribute("fill", "none");
    svgIcon.classList.add("doc-icon"); // Add a class to help with styling
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M6 2C4.34375 2 3 3.34375 3 5V15C3 16.6562 4.34375 18 6 18H15H16C16.5531 18 17 17.5531 17 17C17 16.4469 16.5531 16 16 16V14C16.5531 14 17 13.5531 17 13V3C17 2.44687 16.5531 2 16 2H15H6ZM6 14H14V16H6C5.44687 16 5 15.5531 5 15C5 14.4469 5.44687 14 6 14Z");
    path.setAttribute("fill", "#7C8594");
    
    svgIcon.appendChild(path);
    iconDiv.appendChild(svgIcon);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'keboola-link-content';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'keboola-link-title';
    titleDiv.textContent = title;
    
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'keboola-link-description';
    descriptionDiv.textContent = description; // Fixed: use descriptionDiv instead of description
    
    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(descriptionDiv);
    
    // Add right icon
    const rightIconDiv = document.createElement('div');
    rightIconDiv.className = 'keboola-link-right-icon';
    
    // Create SVG element for external link icon
    const rightSvgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    rightSvgIcon.setAttribute("width", "20");
    rightSvgIcon.setAttribute("height", "20");
    rightSvgIcon.setAttribute("viewBox", "0 0 20 20");
    rightSvgIcon.setAttribute("fill", "none");
    
    const rightPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    rightPath.setAttribute("d", "M11.998 3C11.595 3 11.2294 3.24375 11.0732 3.61875C10.917 3.99375 11.0045 4.42187 11.2888 4.70937L12.5822 6L8.29257 10.2937C7.90203 10.6844 7.90203 11.3188 8.29257 11.7094C8.68342 12.1 9.31734 12.1 9.70788 11.7094L13.9975 7.41563L15.291 8.70937C15.5784 8.99687 16.0065 9.08125 16.3814 8.925C16.7563 8.76875 17 8.40625 17 8V4C17 3.44687 16.5532 3 16.0002 3H11.998ZM5.49944 4C4.1185 4 3 5.11875 3 6.5V14.5C3 15.8813 4.1185 17 5.49944 17H13.4977C14.8786 17 15.9971 15.8813 15.9971 14.5V12C15.9971 11.4469 15.5503 11 14.9973 11C14.4443 11 13.9975 11.4469 13.9975 12V14.5C13.9975 14.775 13.7726 15 13.4977 15H5.49944C5.2245 15 4.99955 14.775 4.99955 14.5V6.5C4.99955 6.225 5.2245 6 5.49944 6H7.99888C8.55189 6 8.99866 5.55313 8.99866 5C8.99866 4.44687 8.55189 4 7.99888 4H5.49944Z");
    rightPath.setAttribute("fill", "#7C8594");
    
    rightSvgIcon.appendChild(rightPath);
    rightIconDiv.appendChild(rightSvgIcon);
    
    card.appendChild(iconDiv);
    card.appendChild(contentDiv);
    card.appendChild(rightIconDiv);
    
    return card;
}


// Create AI Assistant DOM elements
function createAIAssistant() {
    const aiAssistant = document.createElement('div');
    aiAssistant.className = 'ai-assistant';
    
    aiAssistant.innerHTML = `
        <div class="ai-assistant-header">
            <div class="ai-assistant-title">
                <img src="images/ai-chat-icon.svg" alt="AI Assistant">
                <span>Keboola AI Assistant</span>
            </div>
            <div class="ai-assistant-controls">
                <button class="history-btn" title="History"><img src="images/history-icon.svg" alt="History"></button>
                <button class="resize-btn" title="Expand"><img src="images/expand-icon.svg" alt="Expand"></button>
                <button class="minimize-btn" title="Minimize"><img src="images/minimize-icon.svg" alt="Minimize"></button>
            </div>
        </div>
        <div class="ai-assistant-body">
            <div class="ai-assistant-messages">
                <div class="message ai">
                    <div class="message-icon"></div>
                    <div class="message-content">
                        Hello! I'm your Keboola AI Assistant. How can I help you today?
                    </div>
                </div>
            </div>
        </div>
        <div class="ai-assistant-footer">
            <input type="text" class="ai-assistant-input" placeholder="Type your message...">
            <button class="ai-assistant-send"></button>
        </div>
        <div class="resize-handle"></div>
    `;
    
    document.body.appendChild(aiAssistant);
    
    // Create floating button
    createFloatingButton();
}


// Create floating button
function createFloatingButton() {
    const floatingButton = document.createElement('div');
    floatingButton.className = 'floating-button';
    floatingButton.innerHTML = `<img src="images/chat_icon.png" alt="AI Assistant">`;
    
    // Make the button visible by default instead of hidden
    floatingButton.style.display = 'flex';
    
    floatingButton.addEventListener('click', function() {
        // Show the AI assistant and hide the floating button
        const aiAssistant = document.querySelector('.ai-assistant');
        aiAssistant.style.display = 'flex';
        this.style.display = 'none';
        
        // Restore previous state
        expandFromMinimized();
    });
    
    document.body.appendChild(floatingButton);
}


// Initialize AI Assistant functionality
function initAIAssistant() {
    // Ensure the assistant starts in the right bottom corner
    const aiAssistant = document.querySelector('.ai-assistant');
    aiAssistant.style.top = 'auto';
    aiAssistant.style.left = 'auto';
    aiAssistant.style.right = '16px';
    aiAssistant.style.bottom = '16px';
    
    // Resize button functionality
    const resizeBtn = document.querySelector('.resize-btn');
    resizeBtn.addEventListener('click', function() {
        cycleAIAssistantSize();
    });
    
    // History button functionality
    const historyBtn = document.querySelector('.history-btn');
    if (historyBtn) {
        historyBtn.addEventListener('click', toggleHistory);
    }
    
    // Minimize button functionality
    const minimizeBtn = document.querySelector('.minimize-btn');
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function() {
            // Always minimize the assistant when the minimize button is clicked
            minimizeAIAssistant();
        });
    }
    
    // Add click event to the entire assistant when minimized to expand it
    aiAssistant.addEventListener('click', function(e) {
        // Only expand if the assistant is minimized and the click is not on the header
        // (to avoid conflicts with dragging)
        if (this.classList.contains('minimized') && 
            !e.target.closest('.ai-assistant-header')) {
            expandFromMinimized();
        }
    });
    
    // Add scroll event listener to show/hide footer shadow
    const aiAssistantBody = document.querySelector('.ai-assistant-body');
    const aiAssistantFooter = document.querySelector('.ai-assistant-footer');
    const aiAssistantHeader = document.querySelector('.ai-assistant-header');
    
    // Initially hide the shadows
    aiAssistantFooter.style.boxShadow = 'none';
    aiAssistantHeader.style.boxShadow = 'none';
    
    aiAssistantBody.addEventListener('scroll', function() {
        // Show footer shadow only when scrolled up (not at bottom)
        if (this.scrollHeight - this.scrollTop > this.clientHeight + 10) {
            aiAssistantFooter.style.boxShadow = '0 -1px 0 0 #eee';
        } else {
            aiAssistantFooter.style.boxShadow = 'none';
        }
        
        // Show header shadow only when scrolled down (not at top)
        if (this.scrollTop > 10) {
            aiAssistantHeader.style.boxShadow = '0 1px 0 0 #eee';
        } else {
            aiAssistantHeader.style.boxShadow = 'none';
        }
    });
    
    // Dragging functionality
    makeElementDraggable(document.querySelector('.ai-assistant'), document.querySelector('.ai-assistant-header'));
    
    // Resizing functionality
    makeElementResizable(document.querySelector('.ai-assistant'), document.querySelector('.resize-handle'));
    
    // Send message functionality
    const sendBtn = document.querySelector('.ai-assistant-send');
    const inputField = document.querySelector('.ai-assistant-input');
    
    // Add input event listener to enable/disable send button based on input content
    inputField.addEventListener('input', function() {
        sendBtn.disabled = this.value.trim() === '';
    });
    
    sendBtn.addEventListener('click', function() {
        // Close mention modal immediately before sending message
        // This follows standard dropdown behavior - closing on form submission
        if (typeof window.closeMentionModal === 'function') {
        window.closeMentionModal();
        console.log("window.closeMentionModal() called");
    }
    
    // Add user message
    addMessage('user', message);
    
    // Clear input and ensure mention state is completely reset
    input.value = '';
    
    // Explicitly reset all mention-related variables to prevent the modal from reappearing
    if (window.isMentioning !== undefined) {
        window.isMentioning = false;
        console.log("Reset window.isMentioning to false");
    }
    if (window.mentionText !== undefined) {
        window.mentionText = '';
        console.log("Reset window.mentionText to empty");
    }
    
    // Fully remove the mention modal from DOM if it exists
    if (window.mentionModal && window.mentionModal.parentNode) {
        console.log("Manually removing mention modal from DOM");
        window.mentionModal.parentNode.removeChild(window.mentionModal);
        window.mentionModal = null;
    }
    
    // Fully remove the mention tooltip from DOM if it exists
    if (window.mentionTooltip && window.mentionTooltip.parentNode) {
        console.log("Manually removing mention tooltip from DOM");
        window.mentionTooltip.parentNode.removeChild(window.mentionTooltip);
        window.mentionTooltip = null;
    }
    
    console.log("SEND MESSAGE - AFTER PROCESSING:");
    console.log("Input value:", input.value);
    console.log("Mention modal exists:", !!window.mentionModal);
    console.log("Mention modal in DOM:", window.mentionModal ? !!window.mentionModal.parentNode : false);
    console.log("window.isMentioning:", window.isMentioning);
    console.log("window.preventMentionModal:", window.preventMentionModal);
    
    // Use setTimeout to clear the preventMentionModal flag after a short delay
    setTimeout(() => {
        window.preventMentionModal = false;
        console.log("preventMentionModal flag cleared");
    }, 500);
    
    // Use setTimeout to check if the mention modal reappears
    setTimeout(() => {
        console.log("SEND MESSAGE - AFTER TIMEOUT (100ms):");
        console.log("Input value:", document.querySelector('.ai-assistant-input').value);
        console.log("Mention modal exists:", !!window.mentionModal);
        console.log("Mention modal in DOM:", window.mentionModal ? !!window.mentionModal.parentNode : false);
        console.log("window.isMentioning:", window.isMentioning);
    }, 100);
    
    // Detect if the message is about Keboola topics
    const detectedTopics = detectKeboolaTopics(message);
    
    // Check if this is a general question that might need documentation
    const isDocumentationQuestion = detectDocumentationQuestion(message);
    
    // Check if this is a navigation request
    const navigationRequest = detectNavigationRequest(message);
    
    // Generate AI response
    let aiResponse = '';
    
    if (navigationRequest) {
        // Provide a response for navigation
        aiResponse = `I can help you navigate to ${navigationRequest.title}. Click the link below:`;
    } else if (isDocumentationQuestion) {
        // Provide a response that points to documentation
        aiResponse = "I see you have a general question. Here's some documentation that might help:";
    } else if (detectedTopics.length > 0) {
        aiResponse = `I found some resources about ${detectedTopics.map(t => keboolaTopics[t].title).join(', ')} that might help you:`;
    } else if (message.toLowerCase().includes('help')) {
        aiResponse = "I'm here to help! You can ask me about different parts of Keboola like Storage, Transformations, Flows, Components, or Workspaces.";
    } else {
        // Default responses based on keywords
        if (message.toLowerCase().includes('flow')) {
            aiResponse = "Flows help you orchestrate your data pipeline. Would you like to learn more about creating flows?";
        } else if (message.toLowerCase().includes('error')) {
            aiResponse = "I'm sorry to hear you're experiencing an error. Can you provide more details about what you're trying to do?";
        } else {
            aiResponse = "I'm your Keboola assistant. How can I help you today?";
        }
    }
    
    // Add AI response with a callback to add cards after the message is displayed
    addMessage('ai', aiResponse, () => {
        const messagesContainer = document.querySelector('.ai-assistant-messages');
        
        // If it's a navigation request, add navigation card
        if (navigationRequest) {
            const navCard = createNavigationCard(navigationRequest);
            messagesContainer.appendChild(navCard);
        }
        // If it's a documentation question, add documentation links
        else if (isDocumentationQuestion) {
            const docLinks = getRelevantDocumentation(message);
            
            docLinks.forEach(docLink => {
                const linkCard = createDocumentationCard(docLink);
                messagesContainer.appendChild(linkCard);
            });
        }
        // If topics were detected, add link cards
        else if (detectedTopics.length > 0) {
            detectedTopics.forEach(topic => {
                const linkCard = createLinkCard(topic);
                messagesContainer.appendChild(linkCard);
            });
        }
        
        // Scroll to bottom after adding cards
        const aiAssistantBody = document.querySelector('.ai-assistant-body');
        setTimeout(() => {
            aiAssistantBody.scrollTop = messagesContainer.scrollHeight;
        }, 10);
    });
    
    // Show step indicator for certain keywords
    if (message.toLowerCase().includes('create') && message.toLowerCase().includes('flow')) {
        showStepIndicator();
    }
}


// Function to detect navigation requests
function detectNavigationRequest(message) {
    const lowerMessage = message.toLowerCase();
    
    // Define navigation patterns
    const navigationPatterns = [
        { regex: /\b(go|take|navigate|open|show)\s+(me\s+)?(to\s+)?(the\s+)?(flows?|flow\s+section|flow\s+page)\b/i, section: 'flows' },
        { regex: /\b(go|take|navigate|open|show)\s+(me\s+)?(to\s+)?(the\s+)?(transformations?|transformation\s+section|transformation\s+page)\b/i, section: 'transformations' },
        { regex: /\b(go|take|navigate|open|show)\s+(me\s+)?(to\s+)?(the\s+)?(storage|storage\s+section|storage\s+page|data\s+storage)\b/i, section: 'storage' },
        { regex: /\b(go|take|navigate|open|show)\s+(me\s+)?(to\s+)?(the\s+)?(components?|component\s+section|component\s+page|extractors?|writers?)\b/i, section: 'components' },
        { regex: /\b(go|take|navigate|open|show)\s+(me\s+)?(to\s+)?(the\s+)?(workspaces?|workspace\s+section|workspace\s+page|sandbox)\b/i, section: 'workspaces' },
        { regex: /\b(go|take|navigate|open|show)\s+(me\s+)?(to\s+)?(the\s+)?(dashboard|home|main\s+page)\b/i, section: 'dashboard' }
    ];
    
    // Check if the message matches any navigation pattern
    for (const pattern of navigationPatterns) {
        if (pattern.regex.test(lowerMessage)) {
            return getNavigationDetails(pattern.section);
        }
    }
    
    return null;
}


// Function to get navigation details
function getNavigationDetails(section) {
    const navigationMap = {
        'flows': {
            title: 'Flows',
            description: 'Create and manage your data pipelines',
            url: '/flows',
            icon: 'M6.5 3C4.01875 3 2 5.01875 2 7.5C2 9.98125 4.01875 12 6.5 12C8.98125 12 11 9.98125 11 7.5C11 5.01875 8.98125 3 6.5 3ZM6.5 10C5.11875 10 4 8.88125 4 7.5C4 6.11875 5.11875 5 6.5 5C7.88125 5 9 6.11875 9 7.5C9 8.88125 7.88125 10 6.5 10ZM13.5 8C11.0188 8 9 10.0188 9 12.5C9 14.9812 11.0188 17 13.5 17C15.9812 17 18 14.9812 18 12.5C18 10.0188 15.9812 8 13.5 8ZM13.5 15C12.1188 15 11 13.8812 11 12.5C11 11.1188 12.1188 10 13.5 10C14.8812 10 16 11.1188 16 12.5C16 13.8812 14.8812 15 13.5 15ZM9 7.5C9 7.5 9 7.5 9 7.5C9 7.5 9 7.5 9 7.5C9 7.5 9 7.5 9 7.5C9 7.5 9 7.5 9 7.5C9 7.5 9 7.5 9 7.5C9 7.5 9 7.5 9 7.5C9 7.5 9 7.5 9 7.5C9 7.5 9 7.5 9 7.5C9 7.5 9 7.5 9 7.5ZM11 12.5C11 12.5 11 12.5 11 12.5C11 12.5 11 12.5 11 12.5C11 12.5 11 12.5 11 12.5Z'
        },
        'transformations': {
            title: 'Transformations',
            description: 'Transform your data with SQL, Python, or R',
            url: '/transformations',
            icon: 'M10 2C5.58125 2 2 5.58125 2 10C2 14.4188 5.58125 18 10 18C14.4188 18 18 14.4188 18 10C18 5.58125 14.4188 2 10 2ZM10 16C6.69063 16 4 13.3094 4 10C4 6.69063 6.69063 4 10 4C13.3094 4 16 6.69063 16 10C16 13.3094 13.3094 16 10 16ZM12.5 6H7.5C6.67188 6 6 6.67188 6 7.5V12.5C6 13.3281 6.67188 14 7.5 14H12.5C13.3281 14 14 13.3281 14 12.5V7.5C14 6.67188 13.3281 6 12.5 6ZM12 12H8V8H12V12Z'
        },
        'storage': {
            title: 'Storage',
            description: 'Manage your data tables and buckets',
            url: '/storage',
            icon: 'M4 4C2.89688 4 2 4.89688 2 6V14C2 15.1031 2.89688 16 4 16H16C17.1031 16 18 15.1031 18 14V6C18 4.89688 17.1031 4 16 4H4ZM4 6H16V14H4V6ZM5 7V9H15V7H5ZM5 10V11H9V10H5ZM10 10V11H15V10H10ZM5 12V13H9V12H5ZM10 12V13H15V12H10Z'
        },
        'components': {
            title: 'Components',
            description: 'Browse and configure data connectors',
            url: '/components',
            icon: 'M10 2C5.58125 2 2 5.58125 2 10C2 14.4188 5.58125 18 10 18C14.4188 18 18 14.4188 18 10C18 5.58125 14.4188 2 10 2ZM10 4C13.3094 4 16 6.69063 16 10C16 13.3094 13.3094 16 10 16C6.69063 16 4 13.3094 4 10C4 6.69063 6.69063 4 10 4ZM10 5C7.24219 5 5 7.24219 5 10C5 12.7578 7.24219 15 10 15C12.7578 15 15 12.7578 15 10C15 7.24219 12.7578 5 10 5ZM10 7C11.6562 7 13 8.34375 13 10C13 11.6562 11.6562 13 10 13C8.34375 13 7 11.6562 7 10C7 8.34375 8.34375 7 10 7Z'
        },
        'workspaces': {
            title: 'Workspaces',
            description: 'Create and manage development sandboxes',
            url: '/workspaces',
            icon: 'M10 2C5.58125 2 2 5.58125 2 10C2 14.4188 5.58125 18 10 18C14.4188 18 18 14.4188 18 10C18 5.58125 14.4188 2 10 2ZM10 4C13.3094 4 16 6.69063 16 10C16 13.3094 13.3094 16 10 16C6.69063 16 4 13.3094 4 10C4 6.69063 6.69063 4 10 4ZM10 5.5C7.51562 5.5 5.5 7.51562 5.5 10C5.5 12.4844 7.51562 14.5 10 14.5C12.4844 14.5 14.5 12.4844 14.5 10C14.5 7.51562 12.4844 5.5 10 5.5ZM10 7.5C11.3812 7.5 12.5 8.61875 12.5 10C12.5 11.3812 11.3812 12.5 10 12.5C8.61875 12.5 7.5 11.3812 7.5 10C7.5 8.61875 8.61875 7.5 10 7.5Z'
        },
        'dashboard': {
            title: 'Dashboard',
            description: 'Return to the main Keboola dashboard',
            url: '/',
            icon: 'M10 2C5.58125 2 2 5.58125 2 10C2 14.4188 5.58125 18 10 18C14.4188 18 18 14.4188 18 10C18 5.58125 14.4188 2 10 2ZM10 4C13.3094 4 16 6.69063 16 10C16 13.3094 13.3094 16 10 16C6.69063 16 4 13.3094 4 10C4 6.69063 6.69063 4 10 4ZM10 5.5C7.51562 5.5 5.5 7.51562 5.5 10C5.5 12.4844 7.51562 14.5 10 14.5C12.4844 14.5 14.5 12.4844 14.5 10C14.5 7.51562 12.4844 5.5 10 5.5ZM10 7.5C11.3812 7.5 12.5 8.61875 12.5 10C12.5 11.3812 11.3812 12.5 10 12.5C8.61875 12.5 7.5 11.3812 7.5 10C7.5 8.61875 8.61875 7.5 10 7.5Z'
        }
    };
    
    return navigationMap[section] || null;
}


// Function to create a navigation card
function createNavigationCard(navInfo) {
    const card = document.createElement('a');
    card.href = navInfo.url;
    card.className = 'keboola-link-card';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'keboola-link-icon';
    
    // Create SVG element for navigation icon
    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("width", "20");
    svgIcon.setAttribute("height", "20");
    svgIcon.setAttribute("viewBox", "0 0 20 20");
    svgIcon.setAttribute("fill", "none");
    svgIcon.classList.add("nav-icon");
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", navInfo.icon);
    path.setAttribute("fill", "#7C8594");
    
    svgIcon.appendChild(path);
    iconDiv.appendChild(svgIcon);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'keboola-link-content';
    
    const title = document.createElement('div');
    title.className = 'keboola-link-title';
    title.textContent = navInfo.title;
    
    const description = document.createElement('div');
    description.className = 'keboola-link-description';
    description.textContent = navInfo.description;
    
    contentDiv.appendChild(title);
    contentDiv.appendChild(description);
    
    // Add right arrow icon
    const rightIconDiv = document.createElement('div');
    rightIconDiv.className = 'keboola-link-right-icon';
    
    // Create SVG element for arrow icon
    const rightSvgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    rightSvgIcon.setAttribute("width", "20");
    rightSvgIcon.setAttribute("height", "20");
    rightSvgIcon.setAttribute("viewBox", "0 0 20 20");
    rightSvgIcon.setAttribute("fill", "none");
    
    const rightPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    rightPath.setAttribute("d", "M8.29289 5.29289C7.90237 5.68342 7.90237 6.31658 8.29289 6.70711L11.5858 10L8.29289 13.2929C7.90237 13.6834 7.90237 14.3166 8.29289 14.7071C8.68342 15.0976 9.31658 15.0976 9.70711 14.7071L13.7071 10.7071C14.0976 10.3166 14.0976 9.68342 13.7071 9.29289L9.70711 5.29289C9.31658 4.90237 8.68342 4.90237 8.29289 5.29289Z");
    rightPath.setAttribute("fill", "#7C8594");
    
    rightSvgIcon.appendChild(rightPath);
    rightIconDiv.appendChild(rightSvgIcon);
    
    card.appendChild(iconDiv);
    card.appendChild(contentDiv);
    card.appendChild(rightIconDiv);
    
    return card;
}


// Function to detect if a message is asking for documentation
function detectDocumentationQuestion(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for documentation-related keywords
    const docKeywords = ['how to', 'how do i', 'guide', 'tutorial', 'documentation', 'docs', 'learn', 'explain'];
    const questionWords = ['what', 'how', 'where', 'when', 'why', 'which', 'can i', 'should i'];
    
    // Check if the message contains documentation keywords or question words
    const hasDocKeyword = docKeywords.some(keyword => lowerMessage.includes(keyword));
    const hasQuestionWord = questionWords.some(word => lowerMessage.includes(word));
    
    return hasDocKeyword || hasQuestionWord;
}


// Function to get relevant documentation based on the message
function getRelevantDocumentation(message) {
    const lowerMessage = message.toLowerCase();
    const docLinks = [];
    
    // Define documentation resources
    const documentationResources = [
        {
            id: 'general_docs',
            title: 'Keboola Documentation',
            description: 'Complete guide to using Keboola platform',
            icon: 'images/book-icon.svg',
            url: 'https://help.keboola.com/',
            keywords: ['keboola', 'platform', 'general']
        },
        {
            id: 'storage_docs',
            title: 'Storage Documentation',
            description: 'Learn about Keboola Storage features and usage',
            icon: 'images/book-icon.svg',
            url: 'https://help.keboola.com/storage/',
            keywords: ['storage', 'table', 'bucket', 'data']
        },
        {
            id: 'transformations_docs',
            title: 'Transformations Documentation',
            description: 'Learn how to create and manage transformations',
            icon: 'images/book-icon.svg',
            url: 'https://help.keboola.com/transformations/',
            keywords: ['transformation', 'sql', 'python', 'r']
        },
        {
            id: 'flows_docs',
            title: 'Flows Documentation',
            description: 'Learn how to design and orchestrate workflows',
            icon: 'images/book-icon.svg',
            url: 'https://help.keboola.com/orchestrator/',
            keywords: ['flow', 'pipeline', 'orchestration', 'workflow']
        },
        {
            id: 'components_docs',
            title: 'Components Documentation',
            description: 'Learn about available components and connectors',
            icon: 'images/book-icon.svg',
            url: 'https://help.keboola.com/components/',
            keywords: ['component', 'connector', 'extractor', 'writer']
        }
    ];
    
    // Find matching documentation based on keywords in the message
    documentationResources.forEach(doc => {
        if (doc.keywords.some(keyword => lowerMessage.includes(keyword))) {
            docLinks.push(doc);
        }
    });
    
    // If no specific docs match, return general documentation
    if (docLinks.length === 0) {
        docLinks.push(documentationResources[0]);
    }
    
    return docLinks;
}


// Function to create a documentation card
function createDocumentationCard(docInfo) {
    const card = document.createElement('a');
    card.href = docInfo.url;
    card.className = 'keboola-link-card';
    card.target = '_blank'; // Open in new tab
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'keboola-link-icon';
    
    // Create SVG element instead of using an image
    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("width", "20");
    svgIcon.setAttribute("height", "20");
    svgIcon.setAttribute("viewBox", "0 0 20 20");
    svgIcon.setAttribute("fill", "none");
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M6 2C4.34375 2 3 3.34375 3 5V15C3 16.6562 4.34375 18 6 18H15H16C16.5531 18 17 17.5531 17 17C17 16.4469 16.5531 16 16 16V14C16.5531 14 17 13.5531 17 13V3C17 2.44687 16.5531 2 16 2H15H6ZM6 14H14V16H6C5.44687 16 5 15.5531 5 15C5 14.4469 5.44687 14 6 14Z");
    path.setAttribute("fill", "#7C8594");
    
    svgIcon.appendChild(path);
    iconDiv.appendChild(svgIcon);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'keboola-link-content';
    
    const title = document.createElement('div');
    title.className = 'keboola-link-title';
    title.textContent = docInfo.title;
    
    const description = document.createElement('div');
    description.className = 'keboola-link-description';
    description.textContent = docInfo.description;
    
    contentDiv.appendChild(title);
    contentDiv.appendChild(description);
    
    // Add right icon for external link
    const rightIconDiv = document.createElement('div');
    rightIconDiv.className = 'keboola-link-right-icon';
    
    // Create SVG element for external link icon
    const rightSvgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    rightSvgIcon.setAttribute("width", "20");
    rightSvgIcon.setAttribute("height", "20");
    rightSvgIcon.setAttribute("viewBox", "0 0 20 20");
    rightSvgIcon.setAttribute("fill", "none");
    
    const rightPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    rightPath.setAttribute("d", "M11.998 3C11.595 3 11.2294 3.24375 11.0732 3.61875C10.917 3.99375 11.0045 4.42187 11.2888 4.70937L12.5822 6L8.29257 10.2937C7.90203 10.6844 7.90203 11.3188 8.29257 11.7094C8.68342 12.1 9.31734 12.1 9.70788 11.7094L13.9975 7.41563L15.291 8.70937C15.5784 8.99687 16.0065 9.08125 16.3814 8.925C16.7563 8.76875 17 8.40625 17 8V4C17 3.44687 16.5532 3 16.0002 3H11.998ZM5.49944 4C4.1185 4 3 5.11875 3 6.5V14.5C3 15.8813 4.1185 17 5.49944 17H13.4977C14.8786 17 15.9971 15.8813 15.9971 14.5V12C15.9971 11.4469 15.5503 11 14.9973 11C14.4443 11 13.9975 11.4469 13.9975 12V14.5C13.9975 14.775 13.7726 15 13.4977 15H5.49944C5.2245 15 4.99955 14.775 4.99955 14.5V6.5C4.99955 6.225 5.2245 6 5.49944 6H7.99888C8.55189 6 8.99866 5.55313 8.99866 5C8.99866 4.44687 8.55189 4 7.99888 4H5.49944Z");
    rightPath.setAttribute("fill", "#7C8594");
    
    rightSvgIcon.appendChild(rightPath);
    rightIconDiv.appendChild(rightSvgIcon);
    
    card.appendChild(iconDiv);
    card.appendChild(contentDiv);
    card.appendChild(rightIconDiv);
    
    return card;
}


// Update the addMessage function to accept a callback
function addMessage(type, content, callback) {
    const messagesContainer = document.querySelector('.ai-assistant-messages');
    
    // If it's an AI message, show typing indicator first
    if (type === 'ai') {
        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        
        // Scroll to show typing indicator
        const aiAssistantBody = document.querySelector('.ai-assistant-body');
        setTimeout(() => {
            aiAssistantBody.scrollTop = messagesContainer.scrollHeight;
        }, 10);
        
        // Remove typing indicator after a delay and add the actual message
        setTimeout(() => {
            messagesContainer.removeChild(typingIndicator);
            const messageElement = addActualMessage(type, content);
            
            // Execute callback if provided (to add cards after the message)
            if (callback) {
                callback();
            }
        }, 1200); // Typing delay
        
        return;
    }
    
    // For user messages, add immediately
    const messageElement = addActualMessage(type, content);
    
    // Execute callback if provided (though it's unlikely to be used for user messages)
    if (callback) {
        callback();
    }
    
    return messageElement;
}


// Function to create typing indicator
function createTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    
    // Create AI icon (will be hidden by CSS)
    const iconElement = document.createElement('div');
    iconElement.className = 'message-icon';
    
    const iconImg = document.createElement('img');
    iconImg.src = 'images/brain-icon.svg';
    iconImg.alt = 'AI';
    iconImg.width = 24;
    iconImg.height = 24;
    
    iconElement.appendChild(iconImg);
    
    // Create dots container
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'dots';
    
    // Add three dots for the animation
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotsContainer.appendChild(dot);
    }
    
    typingIndicator.appendChild(iconElement);
    typingIndicator.appendChild(dotsContainer);
    
    return typingIndicator;
}


// Function to add the actual message
function addActualMessage(type, content) {
    const messagesContainer = document.querySelector('.ai-assistant-messages');
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    
    // Create message icon
    const iconElement = document.createElement('div');
    iconElement.className = 'message-icon';
    
    // Set icon based on message type
    const iconImg = document.createElement('img');
    iconImg.src = type === 'ai' ? 'images/brain-icon.svg' : 'images/user-icon.svg';
    iconImg.alt = type === 'ai' ? 'AI' : 'User';
    iconImg.width = 24;
    iconImg.height = 24;
    
    iconElement.appendChild(iconImg);
    
    // Create message content
    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';
    contentElement.textContent = content;
    
    // Assemble message
    messageElement.appendChild(iconElement);
    messageElement.appendChild(contentElement);
    
    // Add to container
    messagesContainer.appendChild(messageElement);
    
    // Scroll to bottom - improved to ensure the last message is fully visible
    const aiAssistantBody = document.querySelector('.ai-assistant-body');
    
    // Use setTimeout to ensure scrolling happens after the DOM is updated
    setTimeout(() => {
        // Calculate the position to scroll to (bottom of the last message)
        const lastMessage = messagesContainer.lastElementChild;
        const lastMessageBottom = lastMessage.offsetTop + lastMessage.offsetHeight;
        
        // Scroll to show the bottom of the last message
        aiAssistantBody.scrollTop = lastMessageBottom;
    }, 10);
    
    // Return the message element so we can add link cards to it
    return messageElement;
}


// Add context tip
function addContextTip(content) {
    const messagesContainer = document.querySelector('.ai-assistant-messages');
    const tipDiv = document.createElement('div');
    tipDiv.className = 'context-tip';
    tipDiv.textContent = content;
    
    messagesContainer.appendChild(tipDiv);
    
    // Scroll to bottom
    const aiAssistantBody = document.querySelector('.ai-assistant-body');
    aiAssistantBody.scrollTop = aiAssistantBody.scrollHeight;
}


// Show step indicator
function showStepIndicator() {
    const messagesContainer = document.querySelector('.ai-assistant-messages');
    
    // Check if step indicator already exists
    if (document.querySelector('.step-indicator')) {
        return;
    }
    
    const stepIndicator = document.createElement('div');
    stepIndicator.className = 'step-indicator';
    
    const steps = [
        'Data Source',
        'Mapping',
        'Transformation',
        'Destination',
        'Review'
    ];
    
    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = index === 0 ? 'step active' : 'step';
        
        const stepDot = document.createElement('div');
        stepDot.className = 'step-dot';
        
        const stepLine = document.createElement('div');
        stepLine.className = 'step-line';
        
        const stepLabel = document.createElement('div');
        stepLabel.className = 'step-label';
        stepLabel.textContent = step;
        
        stepDiv.appendChild(stepDot);
        stepDiv.appendChild(stepLine);
        stepDiv.appendChild(stepLabel);
        
        stepIndicator.appendChild(stepDiv);
    });
    
    messagesContainer.appendChild(stepIndicator);
    
    // Scroll to bottom
    const aiAssistantBody = document.querySelector('.ai-assistant-body');
    aiAssistantBody.scrollTop = aiAssistantBody.scrollHeight;
}


// Toggle history panel
function toggleHistory() {
    const aiAssistant = document.querySelector('.ai-assistant');
    const messagesContainer = document.querySelector('.ai-assistant-messages');
    const aiAssistantTitle = document.querySelector('.ai-assistant-title');
    
    // Check if history view is already active
    if (aiAssistant.classList.contains('history-view')) {
        // Switch back to chat view - open a new chat instead of restoring previous
        openNewChat();
        return;
    }
    
    // Switch to history view
    
    // Save current messages to restore later
    aiAssistant.dataset.currentMessages = messagesContainer.innerHTML;
    
    // Clear current messages
    messagesContainer.innerHTML = '';
    
    // Make sure history button is visible in history view
    const historyBtn = document.querySelector('.history-btn');
    if (historyBtn) {
        historyBtn.style.display = '';
    }
    
    // Remove any existing back button first
    const existingBackBtn = document.querySelector('.back-btn');
    if (existingBackBtn) {
        existingBackBtn.remove();
    }
    
    // Create a fresh back button
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.title = 'Back to new chat';
    backBtn.innerHTML = '<img src="images/back-icon.svg" alt="Back">';
    
    // Set the onclick handler directly
    backBtn.setAttribute('onclick', 'openNewChat()');
    
    // Insert back button before the title
    aiAssistantTitle.insertBefore(backBtn, aiAssistantTitle.firstChild);
    
    // Change the title text to "Chat History"
    const titleSpan = document.querySelector('.ai-assistant-title span');
    if (titleSpan) {
        // Store the original title if not already stored
        if (!titleSpan.dataset.originalTitle) {
            titleSpan.dataset.originalTitle = titleSpan.textContent;
        }
        titleSpan.textContent = 'Chat History';
    }
    
    // Add history-view class to assistant
    aiAssistant.classList.add('history-view');
    
    // Create and display conversation history
    displayConversationHistory();
}


// Display conversation history
function displayConversationHistory() {
    const messagesContainer = document.querySelector('.ai-assistant-messages');
    
    // Create conversation list directly without the history header
    const conversationList = document.createElement('div');
    conversationList.className = 'conversation-list';
    
    // Create dummy conversation data
    const conversations = [
        { id: 1, title: 'Creating a data transformation flow', time: '12 minutes ago' },
        { id: 2, title: 'Troubleshooting MySQL connection', time: '2 hours ago' },
        { id: 3, title: 'Setting up Snowflake integration', time: '1 day ago' },
        { id: 4, title: 'Optimizing SQL queries', time: '2 days ago' },
        { id: 5, title: 'Building a marketing dashboard', time: '3 days ago' },
        { id: 6, title: 'Data extraction from API', time: '5 days ago' },
        { id: 7, title: 'Automating report generation', time: '1 week ago' },
        { id: 8, title: 'Configuring data warehouse', time: '2 weeks ago' }
    ];
    
    // Add conversation cards
    conversations.forEach(conversation => {
        const card = document.createElement('div');
        card.className = 'conversation-card';
        card.dataset.id = conversation.id;
        
        const title = document.createElement('div');
        title.className = 'conversation-title';
        title.textContent = conversation.title;
        
        const time = document.createElement('div');
        time.className = 'conversation-time';
        time.textContent = conversation.time;
        
        // Create delete icon
        const deleteIcon = document.createElement('div');
        deleteIcon.className = 'delete-icon';
        deleteIcon.innerHTML = '<img src="images/trash-icon.svg" alt="Delete">';
        
        // Add click event to delete icon
        deleteIcon.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            // Here you would add the actual delete functionality
            card.remove(); // For now, just remove the card from DOM
        });
        
        card.appendChild(time);
        card.appendChild(title);
        card.appendChild(deleteIcon);
        
        // Add click event to open conversation
        card.addEventListener('click', function() {
            openConversation(conversation.id, conversation.title);
        });
        
        conversationList.appendChild(card);
    });
    
    messagesContainer.appendChild(conversationList);
}


// Hide history view and return to chat
function hideHistoryView() {
    const aiAssistant = document.querySelector('.ai-assistant');
    const messagesContainer = document.querySelector('.ai-assistant-messages');
    const backBtn = document.querySelector('.back-btn');
    const aiAssistantTitle = document.querySelector('.ai-assistant-title');
    
    // Remove history-view class
    aiAssistant.classList.remove('history-view');
    
    // Remove back button
    if (backBtn) {
        backBtn.remove();
    }
    
    // Show the history button again
    const historyBtn = document.querySelector('.history-btn');
    if (historyBtn) {
        historyBtn.style.display = '';
    }
    
    // Restore original title
    const titleSpan = aiAssistantTitle.querySelector('span');
    if (titleSpan && titleSpan.dataset.originalTitle) {
        titleSpan.textContent = titleSpan.dataset.originalTitle;
        // Clear the stored title to avoid issues with future navigation
        delete titleSpan.dataset.originalTitle;
    } else {
        titleSpan.textContent = 'Keboola AI Assistant';
    }
    
    // Clear the messages container first
    messagesContainer.innerHTML = '';
    
    // Restore previous messages if available
    if (aiAssistant.dataset.currentMessages && aiAssistant.dataset.currentMessages.trim() !== '') {
        messagesContainer.innerHTML = aiAssistant.dataset.currentMessages;
        // Clear the stored messages to avoid issues with future navigation
        delete aiAssistant.dataset.currentMessages;
    } else {
        // If no messages were stored or the current chat is empty, show today's empty chat
        messagesContainer.innerHTML = `
            <div class="message ai">
                <div class="message-icon"></div>
                <div class="message-content">
                    Hello! I'm your Keboola AI Assistant. How can I help you today?
                </div>
            </div>
        `;
    }
    
    // Scroll to bottom of messages
    const aiAssistantBody = document.querySelector('.ai-assistant-body');
    if (aiAssistantBody) {
        setTimeout(() => {
            aiAssistantBody.scrollTop = aiAssistantBody.scrollHeight;
        }, 0);
    }
}


// Open a specific conversation
function openConversation(id, title) {
    // Clear current messages
    const messagesContainer = document.querySelector('.ai-assistant-messages');
    messagesContainer.innerHTML = '';
    
    // Remove history view class
    const aiAssistant = document.querySelector('.ai-assistant');
    aiAssistant.classList.remove('history-view');
    
    // Update the header title with the conversation name
    const titleSpan = document.querySelector('.ai-assistant-title span');
    titleSpan.textContent = title;
    titleSpan.title = title; // Add tooltip with full title
    
    // Hide the history button when viewing a conversation detail
    const historyBtn = document.querySelector('.history-btn');
    if (historyBtn) {
        historyBtn.style.display = 'none';
    }
    
    // Generate dummy conversation based on ID
    let messages = [];
    switch(id) {
        case 1:
            messages = [
                { type: 'user', content: 'I need to create a data transformation flow' },
                { type: 'ai', content: 'I can help you create a data transformation flow. What kind of data are you working with?' },
                { type: 'user', content: 'I have CSV files with customer data' },
                { type: 'ai', content: 'Great! Let\'s set up a flow to process your CSV files. First, we\'ll need to create a data source component.' }
            ];
            break;
        case 2:
            messages = [
                { type: 'user', content: 'I\'m having trouble connecting to MySQL' },
                { type: 'ai', content: 'I\'m sorry to hear that. Let\'s troubleshoot your MySQL connection. Can you tell me what error message you\'re seeing?' },
                { type: 'user', content: 'It says "Access denied for user"' },
                { type: 'ai', content: 'This sounds like a permissions issue. Let\'s check your user credentials and make sure they have the proper access rights to the database.' }
            ];
            break;
        default:
            messages = [
                { type: 'user', content: 'Hello, can you help me with ' + title + '?' },
                { type: 'ai', content: 'I\'d be happy to help you with ' + title + '. Could you provide more details about what you\'re trying to accomplish?' },
                { type: 'user', content: 'I\'m new to this and need guidance' },
                { type: 'ai', content: 'No problem! I\'ll guide you through the process step by step. Let\'s start with the basics.' }
            ];
    }
    
    // Add messages to the chat
    messages.forEach(message => {
        addMessage(message.type, message.content);
    });
    
    // Add back button to return to conversation list (not to previous chat)
    const aiAssistantTitle = document.querySelector('.ai-assistant-title');
    
    // Create a function to go back to the conversation list
    const goBackToList = function() {
        // Clear current messages
        messagesContainer.innerHTML = '';
        
        // Change the title back to "Chat History"
        titleSpan.textContent = 'Chat History';
        
        // Add history-view class to assistant
        aiAssistant.classList.add('history-view');
        
        // Show the history button again
        if (historyBtn) {
            historyBtn.style.display = '';
        }
        
        // Display conversation history
        displayConversationHistory();
    };
    
    if (!document.querySelector('.back-btn')) {
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.title = 'Back to conversation list';
        backBtn.innerHTML = '<img src="images/back-icon.svg" alt="Back">';
        
        backBtn.addEventListener('click', goBackToList);
        
        // Insert back button before the title
        aiAssistantTitle.insertBefore(backBtn, aiAssistantTitle.firstChild);
    } else {
        // Update existing back button to go back to list
        const backBtn = document.querySelector('.back-btn');
        backBtn.title = 'Back to conversation list';
        
        // Remove all existing event listeners by cloning and replacing
        const newBackBtn = backBtn.cloneNode(true);
        backBtn.parentNode.replaceChild(newBackBtn, backBtn);
        
        // Add the correct event listener
        newBackBtn.addEventListener('click', goBackToList);
    }
}


// Minimize AI Assistant
function minimizeAIAssistant() {
    // Close any open mention modals or tooltips
    if (typeof window.closeMentionModal === 'function') {
        window.closeMentionModal();
    }
    
    const aiAssistant = document.querySelector('.ai-assistant');
    const floatingButton = document.querySelector('.floating-button');
    
    // Save current state before minimizing
    const wasExpanded = aiAssistant.classList.contains('expanded');
    aiAssistant.dataset.previousState = wasExpanded ? 'expanded' : 'normal';
    
    // Set the transform origin to bottom right
    aiAssistant.style.transformOrigin = 'bottom right';
    
    // Simple, smooth transition
    aiAssistant.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    aiAssistant.style.transform = 'scale(0.3)';
    aiAssistant.style.opacity = '0';
    
    // Use setTimeout to allow the transition to complete before hiding
    setTimeout(() => {
        // Hide the assistant
        aiAssistant.style.display = 'none';
        aiAssistant.style.transform = '';
        
        // Show the floating button with a fade-in effect
        floatingButton.style.opacity = '0';
        floatingButton.style.display = 'flex';
        floatingButton.style.transition = 'opacity 0.3s ease';
        
        // Position the floating button
        floatingButton.style.right = '32px';
        floatingButton.style.bottom = '32px';
        floatingButton.style.position = 'fixed';
        
        // Trigger reflow to ensure the opacity transition works
        floatingButton.offsetHeight;
        
        // Fade in the floating button
        floatingButton.style.opacity = '1';
    }, 300);
}


// Expand from minimized state
function expandFromMinimized() {
    const aiAssistant = document.querySelector('.ai-assistant');
    const floatingButton = document.querySelector('.floating-button');
    
    // Fade out the floating button
    if (floatingButton) {
        floatingButton.style.transition = 'opacity 0.2s ease';
        floatingButton.style.opacity = '0';
        
        // Use setTimeout to allow the fade-out to complete
        setTimeout(() => {
            // Hide the floating button
            floatingButton.style.display = 'none';
        }, 200);
    }
    
    // Reset to default state regardless of previous state
    aiAssistant.classList.remove('expanded');
    
    // If history view is active, switch back to chat view
    if (aiAssistant.classList.contains('history-view')) {
        hideHistoryView();
    }
    
    // Position in right bottom corner
    aiAssistant.style.top = 'auto';
    aiAssistant.style.left = 'auto';
    aiAssistant.style.right = '16px';
    aiAssistant.style.bottom = '16px';
    
    // Reset the body height to default
    const aiAssistantBody = document.querySelector('.ai-assistant-body');
    aiAssistantBody.style.height = '350px';
    
    // Update resize button icon to expand
    const resizeBtn = document.querySelector('.resize-btn');
    resizeBtn.innerHTML = '<img src="images/expand-icon.svg" alt="Expand">';
    resizeBtn.title = "Expand";
    
    // Set initial state for animation
    aiAssistant.style.opacity = '0';
    aiAssistant.style.transform = 'scale(0.3)';
    aiAssistant.style.display = 'flex';
    aiAssistant.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    
    // Trigger reflow to ensure the animation works
    aiAssistant.offsetHeight;
    
    // Animate to full size
    aiAssistant.style.opacity = '1';
    aiAssistant.style.transform = 'scale(1)';
    
    // Remove transition after animation completes
    setTimeout(() => {
        aiAssistant.style.transition = '';
    }, 300);
}


// Open a new chat
function openNewChat() {
    // Clear current messages
    const messagesContainer = document.querySelector('.ai-assistant-messages');
    messagesContainer.innerHTML = '';
    
    // Remove history view class
    const aiAssistant = document.querySelector('.ai-assistant');
    aiAssistant.classList.remove('history-view');
    
    // Remove back button if it exists
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.remove();
    }
    
    // Show the history button again
    const historyBtn = document.querySelector('.history-btn');
    if (historyBtn) {
        historyBtn.style.display = '';
    }
    
    // Reset the title to default
    const aiAssistantTitle = document.querySelector('.ai-assistant-title');
    const titleSpan = aiAssistantTitle.querySelector('span');
    titleSpan.textContent = 'Keboola AI Assistant';
    
    // Add welcome message to the new chat
    messagesContainer.innerHTML = `
        <div class="message ai">
            <div class="message-icon"></div>
            <div class="message-content">
                Hello! I'm your Keboola AI Assistant. How can I help you today?
            </div>
        </div>
    `;
    
    // Clear any stored messages
    delete aiAssistant.dataset.currentMessages;
    
    // Scroll to bottom of messages
    const aiAssistantBody = document.querySelector('.ai-assistant-body');
    if (aiAssistantBody) {
        setTimeout(() => {
            aiAssistantBody.scrollTop = aiAssistantBody.scrollHeight;
        }, 0);
    }
}


// Handle @ mentions in the chat input
function setupMentionFeature() {
    const inputField = document.querySelector('.ai-assistant-input');
    let mentionTooltip = null;
    let mentionModal = null;
    let isMentioning = false;
    let mentionText = '';
    
    // Make these variables accessible globally
    window.mentionTooltip = null;
    window.mentionModal = null;
    window.isMentioning = false;
    
    // Create sample data for different object types
    const objectTypes = {
        tables: [
            { name: 'Customer Data', icon: 'table-icon.svg', type: 'table' },
            { name: 'Sales Transactions', icon: 'table-icon.svg', type: 'table' },
            { name: 'Product Inventory', icon: 'table-icon.svg', type: 'table' }
        ],
        transformations: [
            { name: 'Data Cleaning', icon: 'snowflake-icon.svg', type: 'transformation' },
            { name: 'Revenue Calculation', icon: 'python-icon.svg', type: 'transformation' },
            { name: 'Customer Segmentation', icon: 'snowflake-icon.svg', type: 'transformation' }
        ],
        flows: [
            { name: 'Daily Sales ETL', icon: 'flow-icon.svg', type: 'flow' },
            { name: 'Marketing Analytics', icon: 'flow-icon.svg', type: 'flow' },
            { name: 'Customer 360', icon: 'flow-icon.svg', type: 'flow' }
        ],
        components: [
            { name: 'MySQL Extractor', icon: 'component-icon.svg', type: 'component' },
            { name: 'Snowflake Writer', icon: 'component-icon.svg', type: 'component' },
            { name: 'Google Analytics', icon: 'component-icon.svg', type: 'component' }
        ],
        projects: [
            { name: 'Sales Dashboard', icon: 'project-icon.svg', type: 'project' },
            { name: 'Marketing Campaign', icon: 'project-icon.svg', type: 'project' },
            { name: 'Data Warehouse', icon: 'project-icon.svg', type: 'project' }
        ],
        reports: [
            { name: 'Monthly Sales Report', icon: 'table-icon.svg', type: 'report' },
            { name: 'Customer Analytics', icon: 'table-icon.svg', type: 'report' }
        ]
    };
    
    // Combine all objects into a single array for searching
    const allObjects = [];
    Object.keys(objectTypes).forEach(type => {
        objectTypes[type].forEach(obj => {
            allObjects.push(obj);
        });
    });
    
    // Log the objects for debugging
    console.log('All objects for mention:', allObjects);
    
    // Make allObjects accessible to other functions
    window.allObjects = allObjects;
    
    // Add a resize observer to update the modal position and width when the chat is resized
    const aiAssistant = document.querySelector('.ai-assistant');
    const resizeObserver = new ResizeObserver(() => {
        if (mentionModal && isMentioning) {
            updateModalPositionAndSize();
        }
    });
    
    // Observe the AI assistant for size changes
    resizeObserver.observe(aiAssistant);
    
    // Function to update modal position and size
    function updateModalPositionAndSize() {
        if (!mentionModal) return;
        
        const inputRect = inputField.getBoundingClientRect();
        const aiAssistantRect = aiAssistant.getBoundingClientRect();
        
        // Update modal width to match input field width
        mentionModal.style.width = `${inputRect.width}px`;
        
        // Update modal position
        mentionModal.style.bottom = `${aiAssistantRect.height - (inputRect.top - aiAssistantRect.top) + 8}px`;
    }
    
    // Add input event listener to check for @ symbol and manage mention modal visibility
    inputField.addEventListener('input', function(e) {
        console.log("INPUT EVENT TRIGGERED - Mention Detection");
        // First check if there's an @ symbol in the text
        const text = this.value;
        const cursorPosition = this.selectionStart;
        console.log("Input text:", text);
        console.log("Cursor position:", cursorPosition);
        
        // If there's no @ symbol in the text at all, close any open mention modal or tooltip
        if (!text.includes('@')) {
            console.log("No @ found - Closing modal if open");
            if (mentionTooltip) {
                mentionTooltip.remove();
                mentionTooltip = null;
            }
            if (typeof closeMentionModal === 'function') {
                closeMentionModal();
            }
            isMentioning = false;
            return;
        }
        
        // Continue with existing mention logic only if @ exists
        const mentionText = getMentionTextAtCursor(text, cursorPosition);
        console.log("Mention text at cursor:", mentionText);
        
        if (mentionText !== null) {
            if (!isMentioning) {
                // Only show tooltip if there's no text after @
                if (mentionText === '') {
                    showMentionTooltip();
                } else {
                    // If there's text after @, remove tooltip and show modal
                    if (mentionTooltip) {
                        mentionTooltip.remove();
                        mentionTooltip = null;
                    }
                    showMentionModal();
                }
                isMentioning = true;
            } else {
                // If there's text after @, remove tooltip and show modal
                if (mentionText !== '') {
                    if (mentionTooltip) {
                        mentionTooltip.remove();
                        mentionTooltip = null;
                    }
                    showMentionModal();
                    updateMentionModal(mentionText);
                }
            }
        } else {
            // If cursor is not in a mention context, close the modal
            if (typeof closeMentionModal === 'function') {
                closeMentionModal();
            }
            isMentioning = false;
        }
    });
    
    // Add click event listener to detect clicks outside mention context
    document.addEventListener('click', function(e) {
        if (isMentioning) {
            checkMentionStatus();
        }
    });
    
    // Add keyup event listener to detect cursor movements
    inputField.addEventListener('keyup', function(e) {
        // Only check for arrow keys, home, end, etc.
        if (e.key.includes('Arrow') || e.key === 'Home' || e.key === 'End') {
            if (isMentioning) {
                checkMentionStatus();
            }
        }
    });
    
    function checkMentionStatus() {
        // Simple check: if there's no @ in the text, close everything
        const text = inputField.value;
        if (!text.includes('@')) {
            closeMentionModal();
            return;
        }
        
        if (isMentioning) {
            const cursorPosition = inputField.selectionStart;
            
            // Check if we're still within a mention context
            mentionText = getMentionTextAtCursor(text, cursorPosition);
            
            if (mentionText === null) {
                closeMentionModal();
            }
        }
    }
    
    function getMentionTextAtCursor(text, cursorPosition) {
        // Find the @ character before the cursor
        const atIndex = text.lastIndexOf('@', cursorPosition - 1);
        
        // If no @ found or it's not part of the current mention
        if (atIndex === -1) return null;
        
        // Check if there's a space between @ and cursor
        const textBetween = text.substring(atIndex, cursorPosition);
        if (textBetween.includes(' ') && !textBetween.includes('@', 1)) return null;
        
        // If the text after @ is empty, return empty string to show tooltip
        // If there's text after @, return that text for filtering
        const textAfterAt = text.substring(atIndex + 1, cursorPosition);
        return textAfterAt;
    }
    
    function showMentionTooltip() {
        // Remove existing tooltip if any
        if (mentionTooltip) {
            mentionTooltip.parentNode.removeChild(mentionTooltip);
        }
        
        // Create tooltip
        mentionTooltip = document.createElement('div');
        mentionTooltip.className = 'mention-tooltip';
        mentionTooltip.textContent = 'Reference a project, flow, transformation, table or component';
        mentionTooltip.style.position = 'absolute';
        
        // Get the AI assistant element
        const aiAssistant = document.querySelector('.ai-assistant');
        
        // Position tooltip above the input field but inside the AI assistant
        const inputRect = inputField.getBoundingClientRect();
        const aiAssistantRect = aiAssistant.getBoundingClientRect();
        
        // Match the width of the input field
        mentionTooltip.style.width = `${inputRect.width}px`;
        mentionTooltip.style.boxSizing = 'border-box';
        
        // Updated tooltip styling
        mentionTooltip.style.display = 'inline-flex';
        mentionTooltip.style.padding = '8px 12px';
        mentionTooltip.style.justifyContent = 'center';
        mentionTooltip.style.alignItems = 'flex-end';
        mentionTooltip.style.gap = '4px';
        mentionTooltip.style.borderRadius = '4px';
        mentionTooltip.style.background = 'var(--Neutral-800, #222529)';
        mentionTooltip.style.boxShadow = '0px 3px 4px 0px rgba(34, 37, 41, 0.12)';
        mentionTooltip.style.border = 'none';
        
        // Updated text styling
        mentionTooltip.style.color = 'var(--Neutral-White, #FFF)';
        mentionTooltip.style.textAlign = 'center';
        mentionTooltip.style.fontFamily = 'Inter';
        mentionTooltip.style.fontSize = '12px';
        mentionTooltip.style.fontStyle = 'normal';
        mentionTooltip.style.fontWeight = '500';
        mentionTooltip.style.lineHeight = '20px';
        mentionTooltip.style.letterSpacing = '1px';
        mentionTooltip.style.textTransform = 'uppercase';
        mentionTooltip.style.zIndex = '1000';
        
        // Position relative to the AI assistant
        mentionTooltip.style.left = `${inputRect.left - aiAssistantRect.left}px`;
        mentionTooltip.style.top = `${inputRect.top - aiAssistantRect.top - 40}px`;
        
        // Append to the AI assistant instead of document body
        aiAssistant.appendChild(mentionTooltip);
        
        // Don't automatically show the modal or hide the tooltip
        // The tooltip will remain visible until the user types a character after @
    }
    
    function showMentionModal() {
        // Remove existing modal if any
        if (mentionModal) {
            mentionModal.parentNode.removeChild(mentionModal);
        }
        
        // Create modal
        mentionModal = document.createElement('div');
        mentionModal.className = 'mention-modal';
        mentionModal.style.position = 'absolute';
        mentionModal.style.maxHeight = '200px';
        mentionModal.style.overflowY = 'auto';
        mentionModal.style.zIndex = '1000';
        mentionModal.style.borderRadius = '4px';
        mentionModal.style.border = '1px solid var(--Neutral-Grey-150, #D9DEE6)';
        mentionModal.style.background = 'var(--Neutral-White, #FFF)';
        mentionModal.style.boxShadow = '0px 3px 4px 0px rgba(34, 37, 41, 0.12)';
        
        // Add the new layout properties
        mentionModal.style.display = 'flex';
        mentionModal.style.padding = '7px 8px';
        mentionModal.style.flexDirection = 'column';
        mentionModal.style.alignItems = 'flex-start';
        mentionModal.style.flex = '1 0 0';
        mentionModal.style.alignSelf = 'stretch';
        
        // Get the AI assistant element
        const aiAssistant = document.querySelector('.ai-assistant');
        
        // Position modal relative to the input field but inside the AI assistant
        const inputRect = inputField.getBoundingClientRect();
        const aiAssistantRect = aiAssistant.getBoundingClientRect();
        
        // Match the width of the input field
        mentionModal.style.width = `${inputRect.width}px`;
        
        // Position the modal above the input field
        mentionModal.style.bottom = `${aiAssistantRect.height - (inputRect.top - aiAssistantRect.top) + 8}px`;
        mentionModal.style.right = '16px';
        mentionModal.style.left = 'auto';
        mentionModal.style.top = 'auto';
        
        // Append to the AI assistant instead of document body
        aiAssistant.appendChild(mentionModal);
        
        // Initialize with all objects (empty search)
        updateMentionModal('');
    }
    
    function updateMentionModal(searchText) {
        if (!mentionModal) return;
        
        // Filter objects based on search text
        const filteredObjects = allObjects.filter(obj => 
            obj.name.toLowerCase().includes(searchText.toLowerCase())
        );
        
        // Clear previous results
        mentionModal.innerHTML = '';
        
        if (filteredObjects.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'mention-item no-results';
            noResults.textContent = 'No matching items found';
            noResults.style.padding = '10px';
            noResults.style.color = '#999';
            noResults.style.textAlign = 'center';
            noResults.style.width = '100%';
            mentionModal.appendChild(noResults);
            return;
        }
        
        // Add filtered results
        filteredObjects.forEach(obj => {
            const item = document.createElement('div');
            item.className = 'mention-item';
            item.style.display = 'flex';
            item.style.padding = '8px';
            item.style.alignItems = 'center';
            item.style.gap = '8px';
            item.style.cursor = 'pointer';
            item.style.borderRadius = '4px';
            item.style.width = '100%';
            item.style.boxSizing = 'border-box';
            
            // Add hover effect with the same color as history chats
            item.onmouseover = function() {
                this.style.backgroundColor = '#F2F4F7';
            };
            item.onmouseout = function() {
                this.style.backgroundColor = 'transparent';
            };
            
            // Create icon element with actual icon
            const icon = document.createElement('img');
            icon.className = 'mention-icon';
            icon.src = `images/${obj.icon}`;
            icon.style.width = '16px';
            icon.style.height = '16px';
            
            const name = document.createElement('div');
            name.className = 'mention-name';
            
            // Style the text according to specifications
            name.style.color = 'var(--Neutral-800, #222529)';
            name.style.fontFeatureSettings = "'liga' off, 'clig' off";
            name.style.fontFamily = 'Inter';
            name.style.fontSize = '14px';
            name.style.fontStyle = 'normal';
            name.style.fontWeight = '400';
            name.style.lineHeight = '20px';
            
            // Highlight the matching text by making it bold
            if (searchText && searchText.trim() !== '') {
                const objectName = obj.name;
                const lowerName = objectName.toLowerCase();
                const lowerSearchText = searchText.toLowerCase();
                const startIndex = lowerName.indexOf(lowerSearchText);
                
                if (startIndex !== -1) {
                    const endIndex = startIndex + searchText.length;
                    const beforeMatch = objectName.substring(0, startIndex);
                    const match = objectName.substring(startIndex, endIndex);
                    const afterMatch = objectName.substring(endIndex);
                    
                    // Clear any existing content
                    name.innerHTML = '';
                    
                    // Add text before match
                    if (beforeMatch) {
                        const beforeSpan = document.createElement('span');
                        beforeSpan.textContent = beforeMatch;
                        name.appendChild(beforeSpan);
                    }
                    
                    // Add highlighted match
                    const matchSpan = document.createElement('span');
                    matchSpan.textContent = match;
                    matchSpan.style.fontWeight = '700';
                    name.appendChild(matchSpan);
                    
                    // Add text after match
                    if (afterMatch) {
                        const afterSpan = document.createElement('span');
                        afterSpan.textContent = afterMatch;
                        name.appendChild(afterSpan);
                    }
                } else {
                    name.textContent = objectName;
                }
            } else {
                name.textContent = obj.name;
            }
            
            item.appendChild(icon);
            item.appendChild(name);
            
            // Replace the click handler with a completely new implementation
            item.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get the name directly
                const name = obj.name;
                
                // Get the input field
                const input = document.querySelector('.ai-assistant-input');
                if (!input) return false;
                
                const cursorPos = input.selectionStart;
                const text = input.value;
                
                // Find the position of the @ symbol before the cursor
                let atPos = text.lastIndexOf('@', cursorPos - 1);
                if (atPos === -1) return false;
                
                // Replace the @mention with the selected name
                const beforeMention = text.substring(0, atPos);
                const afterMention = text.substring(cursorPos);
                input.value = beforeMention + '@' + name + ' ' + afterMention;
                
                // Set cursor position after the inserted mention
                const newCursorPos = atPos + name.length + 2; // +2 for @ and space
                input.setSelectionRange(newCursorPos, newCursorPos);
                input.focus();
                
                // Explicitly close the modal
                if (window.mentionModal) {
                    if (window.mentionModal.parentNode) {
                        window.mentionModal.parentNode.removeChild(window.mentionModal);
                    }
                    window.mentionModal = null;
                }
                
                // Reset mention state
                window.isMentioning = false;
                
                // Remove tooltip if it exists
                if (window.mentionTooltip) {
                    if (window.mentionTooltip.parentNode) {
                        window.mentionTooltip.parentNode.removeChild(window.mentionTooltip);
                    }
                    window.mentionTooltip = null;
                }
                
                // Trigger input event to update any dependent state
                const inputEvent = new Event('input', { bubbles: true });
                input.dispatchEvent(inputEvent);
                
                return false;
            };
            
            mentionModal.appendChild(item);
        });
    }
    
    function insertMention(name) {
        console.log("INSERT MENTION called for name:", name);
        // Get the input field directly
        const input = document.querySelector('.ai-assistant-input');
        if (!input) return;


        const cursorPos = input.selectionStart;
        const text = input.value;
        console.log("Before insertion - input value:", text);
        console.log("Cursor position:", cursorPos);
        
        // Find the position of the @ symbol before the cursor
        let atPos = text.lastIndexOf('@', cursorPos - 1);
        if (atPos === -1) return;
        
        // Replace the @mention with the selected name
        const beforeMention = text.substring(0, atPos);
        const afterMention = text.substring(cursorPos);
        input.value = beforeMention + '@' + name + ' ' + afterMention;
        console.log("After insertion - input value:", input.value);
        
        // Set cursor position after the inserted mention
        const newCursorPos = atPos + name.length + 2; // +2 for @ and space
        input.setSelectionRange(newCursorPos, newCursorPos);
        input.focus();
        
        // Close the mention modal
        if (typeof window.closeMentionModal === 'function') {
            console.log("Calling closeMentionModal from insertMention");
            window.closeMentionModal();
        } else {
            console.log("window.closeMentionModal not available in insertMention");
            // Fallback if global function is not available
            if (window.mentionModal && window.mentionModal.parentNode) {
                window.mentionModal.parentNode.removeChild(window.mentionModal);
                window.mentionModal = null;
            }
            if (window.mentionTooltip && window.mentionTooltip.parentNode) {
                window.mentionTooltip.parentNode.removeChild(window.mentionTooltip);
                window.mentionTooltip = null;
            }
            window.isMentioning = false;
        }
        
        // Note that we're about to trigger an input event
        console.log("About to dispatch input event. Current input.value:", input.value);
        
        // Trigger input event to update any dependent state
        const inputEvent = new Event('input', { bubbles: true });
        input.dispatchEvent(inputEvent);
        console.log("Input event dispatched");
    }
    
    // Make closeMentionModal accessible globally
    window.closeMentionModal = function() {
        console.log("CLOSE MENTION MODAL CALLED");
        console.log("Before reset - window.isMentioning:", window.isMentioning);
        console.log("Before reset - local isMentioning:", isMentioning);
        
        // Reset mention state
        window.isMentioning = false;
        isMentioning = false;
        mentionText = '';
        
        console.log("After reset - window.isMentioning:", window.isMentioning);
        console.log("After reset - local isMentioning:", isMentioning);
        
        // Remove tooltip if it exists
        if (window.mentionTooltip) {
            console.log("Removing window.mentionTooltip");
            try {
                if (window.mentionTooltip.parentNode) {
                    window.mentionTooltip.parentNode.removeChild(window.mentionTooltip);
                    console.log("window.mentionTooltip removed from DOM");
                } else {
                    console.log("window.mentionTooltip exists but is not in DOM");
                }
            } catch (e) {
                console.error("Error removing tooltip:", e);
            }
            window.mentionTooltip = null;
            mentionTooltip = null;
        } else {
            console.log("No tooltip to remove");
        }
        
        // Remove modal if it exists
        if (window.mentionModal) {
            console.log("Removing window.mentionModal");
            try {
                if (window.mentionModal.parentNode) {
                    window.mentionModal.parentNode.removeChild(window.mentionModal);
                    console.log("window.mentionModal removed from DOM");
                } else {
                    console.log("window.mentionModal exists but is not in DOM");
                }
            } catch (e) {
                console.error("Error removing modal:", e);
            }
            window.mentionModal = null;
            mentionModal = null;
        } else {
            console.log("No modal to remove");
        }
    };
} 



