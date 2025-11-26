// Interactive Chat Widget for n8n - WITH PROACTIVE OPTION BUTTONS
// Users click predefined options instead of typing
(function() {
    // Initialize widget only once
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // ==== SETTINGS ====
    const PRECHAT_ENABLED = false;
    const AUTO_GREETING = "Hello! Adan Construction AI Agent — how can I help you today?";

    // ==== CONVERSATION FLOW WITH PREDEFINED OPTIONS ====
    const CONVERSATION_FLOW = {
        // Initial service selection
        'initial': {
            message: AUTO_GREETING,
            options: [
                { text: 'Kitchen Remodel', next: 'kitchen_size' },
                { text: 'Bathroom Remodel', next: 'bathroom_size' },
                { text: 'Basement Remodel', next: 'basement_size' },
                { text: 'Full Home Remodel', next: 'home_size' }
            ]
        },
        
        // KITCHEN FLOW
        'kitchen_size': {
            message: 'How large is your kitchen?',
            options: [
                { text: 'Small (up to 150 sqft)', next: 'kitchen_layout' },
                { text: 'Medium (150-250 sqft)', next: 'kitchen_layout' },
                { text: 'Large (250+ sqft / open concept)', next: 'kitchen_layout' },
                { text: 'Custom dimensions', next: 'kitchen_custom' }
            ]
        },
        'kitchen_custom': {
            message: 'Please provide the length × width of your kitchen.',
            options: null, // User types here
            next: 'kitchen_layout'
        },
        'kitchen_layout': {
            message: 'Are you keeping the same layout or opening walls for an open concept?',
            options: [
                { text: 'Keep existing layout', next: 'kitchen_finish' },
                { text: 'Open concept (removing walls)', next: 'kitchen_finish' }
            ]
        },
        'kitchen_finish': {
            message: 'What finish level best describes your vision?',
            options: [
                { text: 'Basic / Mid-Grade', next: 'kitchen_estimate' },
                { text: 'Premium', next: 'kitchen_estimate' },
                { text: 'High-End', next: 'kitchen_estimate' }
            ]
        },
        'kitchen_estimate': {
            message: 'send_to_webhook', // Special flag to send collected data
            options: null
        },
        
        // BATHROOM FLOW
        'bathroom_size': {
            message: 'What size bathroom are you renovating?',
            options: [
                { text: 'Small (up to 35 sqft - hall/guest bath)', next: 'bathroom_layout' },
                { text: 'Medium (40-50 sqft - standard full bath)', next: 'bathroom_layout' },
                { text: 'Large (60+ sqft - master bathroom)', next: 'bathroom_layout' }
            ]
        },
        'bathroom_layout': {
            message: 'Are you keeping the same layout or moving plumbing fixtures?',
            options: [
                { text: 'Keep existing layout', next: 'bathroom_finish' },
                { text: 'Change layout (move plumbing)', next: 'bathroom_finish' }
            ]
        },
        'bathroom_finish': {
            message: 'What type of finishes do you prefer?',
            options: [
                { text: 'Basic / Mid-Grade', next: 'bathroom_estimate' },
                { text: 'Premium', next: 'bathroom_estimate' },
                { text: 'High-End', next: 'bathroom_estimate' }
            ]
        },
        'bathroom_estimate': {
            message: 'send_to_webhook',
            options: null
        },
        
        // BASEMENT FLOW
        'basement_size': {
            message: 'How large is your basement?',
            options: [
                { text: 'Small (under 600 sqft)', next: 'basement_condition' },
                { text: 'Medium (600-900 sqft)', next: 'basement_condition' },
                { text: 'Large (900+ sqft)', next: 'basement_condition' }
            ]
        },
        'basement_condition': {
            message: "What's the condition of your current basement floor?",
            options: [
                { text: 'Good shape (may only need waterproofing)', next: 'basement_waterproof' },
                { text: 'Cracked/uneven or missing (needs new slab)', next: 'basement_waterproof' }
            ]
        },
        'basement_waterproof': {
            message: 'Would you like to waterproof your basement before finishing?',
            options: [
                { text: 'Yes (French drain + sump pump)', next: 'basement_bathroom' },
                { text: 'No (already in place)', next: 'basement_bathroom' }
            ]
        },
        'basement_bathroom': {
            message: 'Would you like to add a bathroom to your basement?',
            options: [
                { text: 'Yes', next: 'basement_rooms' },
                { text: 'No', next: 'basement_rooms' }
            ]
        },
        'basement_rooms': {
            message: 'Would you like us to frame and finish additional rooms?',
            options: [
                { text: 'Yes', next: 'basement_finish' },
                { text: 'No', next: 'basement_finish' }
            ]
        },
        'basement_finish': {
            message: 'What level of finishes are you looking for?',
            options: [
                { text: 'Basic', next: 'basement_estimate' },
                { text: 'Premium', next: 'basement_estimate' },
                { text: 'High-End', next: 'basement_estimate' }
            ]
        },
        'basement_estimate': {
            message: 'send_to_webhook',
            options: null
        },
        
        // FULL HOME FLOW
        'home_size': {
            message: "What's the approximate size of your home?",
            options: [
                { text: 'Small (under 1,500 sqft)', next: 'home_areas' },
                { text: 'Medium (1,500-2,500 sqft)', next: 'home_areas' },
                { text: 'Large (2,500+ sqft)', next: 'home_areas' }
            ]
        },
        'home_areas': {
            message: 'Which areas are you looking to remodel?',
            options: [
                { text: 'Kitchen(s)', next: 'home_count' },
                { text: 'Bathroom(s)', next: 'home_count' },
                { text: 'Basement', next: 'home_count' },
                { text: 'Whole home', next: 'home_count' }
            ]
        },
        'home_count': {
            message: 'How many kitchens and bathrooms are included in the remodel?',
            options: null, // User types number
            next: 'home_layout'
        },
        'home_layout': {
            message: 'Are you planning any major layout changes?',
            options: [
                { text: 'Keep layout', next: 'home_finish' },
                { text: 'Open concept', next: 'home_finish' },
                { text: 'Additions (expand square footage)', next: 'home_finish' }
            ]
        },
        'home_finish': {
            message: 'What type of finishes are you considering across your home?',
            options: [
                { text: 'Basic / Mid-Grade', next: 'home_estimate' },
                { text: 'Premium', next: 'home_estimate' },
                { text: 'High-End', next: 'home_estimate' }
            ]
        },
        'home_estimate': {
            message: 'send_to_webhook',
            options: null
        }
    };

    // Load font
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontElement);

    // Styles
    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            --chat-color-primary: var(--chat-widget-primary, #10b981);
            --chat-color-secondary: var(--chat-widget-secondary, #059669);
            --chat-color-tertiary: var(--chat-widget-tertiary, #047857);
            --chat-color-light: var(--chat-widget-light, #d1fae5);
            --chat-color-surface: var(--chat-widget-surface, #ffffff);
            --chat-color-text: var(--chat-widget-text, #1f2937);
            --chat-color-text-light: var(--chat-widget-text-light, #6b7280);
            --chat-color-border: var(--chat-widget-border, #e5e7eb);
            --chat-shadow-sm: 0 1px 3px rgba(16, 185, 129, 0.1);
            --chat-shadow-md: 0 4px 6px rgba(16, 185, 129, 0.15);
            --chat-shadow-lg: 0 10px 15px rgba(16, 185, 129, 0.2);
            --chat-radius-sm: 8px;
            --chat-radius-md: 12px;
            --chat-radius-lg: 20px;
            --chat-radius-full: 9999px;
            --chat-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Poppins', sans-serif;
        }

        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            z-index: 1000;
            width: 380px;
            height: 580px;
            background: var(--chat-color-surface);
            border-radius: var(--chat-radius-lg);
            box-shadow: var(--chat-shadow-lg);
            border: 1px solid var(--chat-color-light);
            overflow: hidden;
            display: none;
            flex-direction: column;
            transition: var(--chat-transition);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        .chat-assist-widget .chat-window.right-side { right: 20px; }
        .chat-assist-widget .chat-window.left-side { left: 20px; }
        .chat-assist-widget .chat-window.visible { display: flex; opacity: 1; transform: translateY(0) scale(1); }

        .chat-assist-widget .chat-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            position: relative;
        }
        .chat-assist-widget .chat-header-logo {
            width: 32px; height: 32px; border-radius: var(--chat-radius-sm);
            object-fit: contain; background: white; padding: 4px;
        }
        .chat-assist-widget .chat-header-title { font-size: 16px; font-weight: 600; color: white; }
        .chat-assist-widget .chat-close-btn {
            position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
            background: rgba(255,255,255,0.2); border: none; color: white; cursor: pointer; padding: 4px;
            display: flex; align-items: center; justify-content: center; transition: var(--chat-transition);
            font-size: 18px; border-radius: var(--chat-radius-full); width: 28px; height: 28px;
        }
        .chat-assist-widget .chat-close-btn:hover { background: rgba(255,255,255,0.3); transform: translateY(-50%) scale(1.1); }

        .chat-assist-widget .chat-body { display: flex; flex-direction: column; height: 100%; }
        .chat-assist-widget .chat-messages {
            flex:1; overflow-y:auto; padding:20px; background:#f9fafb; display:flex; flex-direction:column; gap:12px;
        }
        .chat-assist-widget .chat-messages::-webkit-scrollbar { width:6px; }
        .chat-assist-widget .chat-messages::-webkit-scrollbar-track { background:transparent; }
        .chat-assist-widget .chat-messages::-webkit-scrollbar-thumb { background-color: rgba(16,185,129,0.3); border-radius: var(--chat-radius-full); }

        .chat-assist-widget .chat-bubble {
            padding: 14px 18px; border-radius: var(--chat-radius-md); max-width: 85%;
            word-wrap: break-word; font-size: 14px; line-height: 1.6; position: relative; white-space: pre-line;
        }
        .chat-assist-widget .chat-bubble.user-bubble {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white; align-self: flex-end; border-bottom-right-radius: 4px; box-shadow: var(--chat-shadow-sm);
        }
        .chat-assist-widget .chat-bubble.bot-bubble {
            background: white; color: var(--chat-color-text); align-self: flex-start; border-bottom-left-radius: 4px; box-shadow: var(--chat-shadow-sm); border:1px solid var(--chat-color-light);
        }

        .chat-assist-widget .option-buttons {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 8px;
            align-self: flex-start;
            width: 100%;
            max-width: 90%;
        }
        .chat-assist-widget .option-btn {
            padding: 12px 16px;
            background: white;
            border: 2px solid var(--chat-color-primary);
            border-radius: var(--chat-radius-md);
            color: var(--chat-color-primary);
            font-size: 13px;
            font-weight: 500;
            font-family: inherit;
            cursor: pointer;
            transition: var(--chat-transition);
            text-align: left;
            box-shadow: var(--chat-shadow-sm);
            line-height: 1.4;
            word-wrap: break-word;
            white-space: normal;
        }
        .chat-assist-widget .option-btn:hover {
            background: var(--chat-color-primary);
            color: white;
            transform: translateX(4px);
            box-shadow: var(--chat-shadow-md);
        }
        .chat-assist-widget .option-btn:active {
            transform: translateX(4px) scale(0.98);
        }

        .chat-assist-widget .typing-indicator {
            display:flex; align-items:center; gap:4px; padding:14px 18px; background:white; border-radius:var(--chat-radius-md);
            border-bottom-left-radius:4px; max-width:80px; align-self:flex-start; box-shadow:var(--chat-shadow-sm); border:1px solid var(--chat-color-light);
        }
        .chat-assist-widget .typing-dot { width:8px; height:8px; background: var(--chat-color-primary); border-radius: var(--chat-radius-full); opacity:.7; animation: typingAnimation 1.4s infinite ease-in-out; }
        .chat-assist-widget .typing-dot:nth-child(2){ animation-delay:.2s } .chat-assist-widget .typing-dot:nth-child(3){ animation-delay:.4s }
        @keyframes typingAnimation { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }

        .chat-assist-widget .chat-controls { padding:16px; background:var(--chat-color-surface); border-top:1px solid var(--chat-color-light); display:flex; gap:10px; }
        .chat-assist-widget .chat-textarea {
            flex:1; padding:14px 16px; border:1px solid var(--chat-color-light); border-radius:var(--chat-radius-md);
            background:var(--chat-color-surface); color:var(--chat-color-text); resize:none; font-family:inherit; font-size:14px; line-height:1.5; max-height:120px; min-height:48px; transition: var(--chat-transition);
        }
        .chat-assist-widget .chat-textarea:focus { outline:none; border-color:var(--chat-color-primary); box-shadow:0 0 0 3px rgba(16,185,129,0.2); }
        .chat-assist-widget .chat-textarea::placeholder { color: var(--chat-color-text-light); }
        .chat-assist-widget .chat-submit {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color:white; border:none; border-radius:var(--chat-radius-md); width:48px; height:48px; cursor:pointer; transition:var(--chat-transition);
            display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:var(--chat-shadow-sm);
        }
        .chat-assist-widget .chat-submit:hover { transform: scale(1.05); box-shadow: var(--chat-shadow-md); }
        .chat-assist-widget .chat-submit svg { width:22px; height:22px; }

        .chat-assist-widget .chat-launcher {
            position: fixed; bottom: 20px; height: 56px; border-radius: var(--chat-radius-full);
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color:white; border:none; cursor:pointer; box-shadow: var(--chat-shadow-md); z-index:999; transition: var(--chat-transition);
            display:flex; align-items:center; padding:0 20px 0 16px; gap:8px;
        }
        .chat-assist-widget .chat-launcher.right-side { right: 20px; }
        .chat-assist-widget .chat-launcher.left-side { left: 20px; }
        .chat-assist-widget .chat-launcher:hover { transform: scale(1.05); box-shadow: var(--chat-shadow-lg); }
        .chat-assist-widget .chat-launcher svg { width:24px; height:24px; }
        .chat-assist-widget .chat-launcher-text { font-weight:600; font-size:15px; white-space:nowrap; }

        .chat-assist-widget .chat-footer { padding:10px; text-align:center; background:var(--chat-color-surface); border-top:1px solid var(--chat-color-light); }
        .chat-assist-widget .chat-footer-link { color: var(--chat-color-primary); text-decoration:none; font-size:12px; opacity:.85; transition: var(--chat-transition); font-family: inherit; }
        .chat-assist-widget .chat-footer-link:hover { opacity:1; text-decoration: underline; }
    `;
    document.head.appendChild(widgetStyles);

    // Default settings
    const defaultSettings = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '',
            name: 'Adan Construction',
            poweredBy: {
                text: 'Powered by Adan Construction',
                link: 'https://www.adanconstruction.net/'
            }
        },
        style: {
            primaryColor: '#10b981',
            secondaryColor: '#059669',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#1f2937'
        }
    };

    const settings = window.ChatWidgetConfig ?
        {
            webhook: { ...defaultSettings.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultSettings.branding, ...window.ChatWidgetConfig.branding },
            style: {
                ...defaultSettings.style,
                ...window.ChatWidgetConfig.style,
                primaryColor: window.ChatWidgetConfig.style?.primaryColor === '#854fff' ? '#10b981' : (window.ChatWidgetConfig.style?.primaryColor || '#10b981'),
                secondaryColor: window.ChatWidgetConfig.style?.secondaryColor === '#6b3fd4' ? '#059669' : (window.ChatWidgetConfig.style?.secondaryColor || '#059669')
            }
        } : defaultSettings;

    // State management
    let conversationId = '';
    let currentStep = 'initial';
    let conversationData = {};
    let isWaitingForResponse = false;

    // Create widget
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-secondary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-tertiary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
    widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);

    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;

    chatWindow.innerHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${settings.branding.logo}" alt="${settings.branding.name}">
            <span class="chat-header-title">${settings.branding.name}</span>
            <button class="chat-close-btn" aria-label="Close chat">×</button>
        </div>
        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="Type your message here..." rows="1"></textarea>
                <button class="chat-submit" aria-label="Send message">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 2L11 13"></path>
                        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                </button>
            </div>
            <div class="chat-footer">
                <a class="chat-footer-link" href="${settings.branding.poweredBy.link}" target="_blank" rel="noopener">${settings.branding.poweredBy.text}</a>
            </div>
        </div>
    `;

    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span class="chat-launcher-text">Need help?</span>`;

    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    // DOM refs
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');

    // Utils
    function createSessionId(){ return (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2); }
    
    function createTypingIndicator(){
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        return indicator;
    }

    function addBotMessage(text) {
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-bubble bot-bubble';
        botMessage.textContent = text;
        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addUserMessage(text) {
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-bubble user-bubble';
        userMessage.textContent = text;
        messagesContainer.appendChild(userMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showOptions(options, stepKey) {
        // Remove existing option buttons
        const existingOptions = messagesContainer.querySelector('.option-buttons');
        if (existingOptions) existingOptions.remove();

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'option-buttons';

        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option.text;
            button.addEventListener('click', () => {
                handleOptionClick(option.text, option.next || CONVERSATION_FLOW[stepKey].next);
                optionsContainer.remove();
            });
            optionsContainer.appendChild(button);
        });

        messagesContainer.appendChild(optionsContainer);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleOptionClick(selectedText, nextStep) {
        // Show user's selection
        addUserMessage(selectedText);
        
        // Store the answer
        conversationData[currentStep] = selectedText;
        
        // Move to next step
        if (nextStep) {
            currentStep = nextStep;
            processStep();
        }
    }

    async function processStep() {
        const step = CONVERSATION_FLOW[currentStep];
        
        if (!step) {
            console.error('Invalid step:', currentStep);
            return;
        }

        // Check if we need to send to webhook
        if (step.message === 'send_to_webhook') {
            await sendToWebhook();
            return;
        }

        // Show bot message
        addBotMessage(step.message);

        // Show options if available
        if (step.options) {
            showOptions(step.options, currentStep);
        } else if (!step.next) {
            // Enable text input for free-form response
            messageTextarea.disabled = false;
            messageTextarea.focus();
        } else {
            // Auto-advance for steps without options
            currentStep = step.next;
            setTimeout(() => processStep(), 500);
        }
    }

    async function sendToWebhook() {
        if (!settings.webhook?.url) {
            addBotMessage("Thank you for providing all the information! Our team will get back to you soon.");
            return;
        }

        const typing = createTypingIndicator();
        messagesContainer.appendChild(typing);

        try {
            // Format the collected data as a message
            let formattedMessage = "Project Details:\n";
            for (const [key, value] of Object.entries(conversationData)) {
                formattedMessage += `${key}: ${value}\n`;
            }

            const requestData = {
                action: "sendMessage",
                sessionId: conversationId,
                route: settings.webhook.route || "",
                chatInput: formattedMessage,
                metadata: conversationData
            };

            const response = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            const data = await response.json().catch(() => ({}));
            
            messagesContainer.removeChild(typing);

            const responseText = Array.isArray(data) ? (data[0]?.output || '') : (data?.output || '');
            addBotMessage(responseText || "Thank you! Based on your selections, let me provide you with an estimate...");

        } catch (error) {
            console.error('Webhook error:', error);
            messagesContainer.removeChild(typing);
            addBotMessage("Sorry, there was an error. Please try again.");
        }
    }

    function handleTextInput(text) {
        addUserMessage(text);
        conversationData[currentStep] = text;
        
        const step = CONVERSATION_FLOW[currentStep];
        if (step.next) {
            currentStep = step.next;
            processStep();
        }
        
        messageTextarea.value = '';
        messageTextarea.disabled = true;
    }

    // Start conversation
    function startChat() {
        if (!conversationId) conversationId = createSessionId();
        currentStep = 'initial';
        conversationData = {};
        processStep();
    }

    // Event listeners
    sendButton.addEventListener('click', () => {
        const text = messageTextarea.value.trim();
        if (text && !messageTextarea.disabled) {
            handleTextInput(text);
        }
    });

    messageTextarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const text = messageTextarea.value.trim();
            if (text && !messageTextarea.disabled) {
                handleTextInput(text);
            }
        }
    });

    let firstOpen = true;
    launchButton.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
        if (chatWindow.classList.contains('visible') && firstOpen) {
            startChat();
            firstOpen = false;
        }
    });

    chatWindow.querySelector('.chat-close-btn').addEventListener('click', () => {
        chatWindow.classList.remove('visible');
    });

    // Disable textarea initially
    messageTextarea.disabled = true;
})();
