// Interactive Chat Widget for n8n - SIMPLIFIED BUTTON DETECTION
// More flexible matching to ensure buttons always appear
(function() {
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    const PRECHAT_ENABLED = false;
    const AUTO_GREETING = "Hello! Adan Construction AI Agent — how can I help you today?";

    // ==== SIMPLIFIED BUTTON DETECTION ====
    // Check for keywords in bot response and show appropriate buttons
    function getButtonsForResponse(text) {
        const lowerText = text.toLowerCase();
        
        // Kitchen size - check for "kitchen" and ("large" OR "size")
        if (lowerText.includes('kitchen') && (lowerText.includes('large') || lowerText.includes('size'))) {
            return [
                'Small (up to 150 sqft)',
                'Medium (150-250 sqft)',
                'Large (250+ sqft / open concept)',
                'Custom dimensions'
            ];
        }
        
        // Kitchen layout
        if (lowerText.includes('layout') && lowerText.includes('kitchen') || 
            (lowerText.includes('open') && lowerText.includes('walls'))) {
            return [
                'Keep existing layout',
                'Open concept (removing walls)'
            ];
        }
        
        // Kitchen finish
        if ((lowerText.includes('finish') && lowerText.includes('vision')) ||
            (lowerText.includes('finish level') && lowerText.includes('kitchen'))) {
            return [
                'Basic / Mid-Grade',
                'Premium',
                'High-End'
            ];
        }
        
        // Bathroom size
        if (lowerText.includes('bathroom') && (lowerText.includes('size') || lowerText.includes('renovating'))) {
            return [
                'Small (up to 35 sqft - hall/guest bath)',
                'Medium (40-50 sqft - standard full bath)',
                'Large (60+ sqft - master bathroom)'
            ];
        }
        
        // Bathroom layout
        if (lowerText.includes('layout') && lowerText.includes('bathroom') ||
            lowerText.includes('plumbing fixtures')) {
            return [
                'Keep existing layout',
                'Change layout (move plumbing)'
            ];
        }
        
        // Bathroom finish
        if (lowerText.includes('finishes') && lowerText.includes('prefer') && lowerText.includes('bathroom')) {
            return [
                'Basic / Mid-Grade',
                'Premium',
                'High-End'
            ];
        }
        
        // Basement size
        if (lowerText.includes('basement') && (lowerText.includes('large') || lowerText.includes('size'))) {
            return [
                'Small (under 600 sqft)',
                'Medium (600-900 sqft)',
                'Large (900+ sqft)'
            ];
        }
        
        // Basement floor condition
        if (lowerText.includes('basement') && lowerText.includes('floor') && lowerText.includes('condition')) {
            return [
                'Good shape (may only need waterproofing)',
                'Cracked/uneven or missing (needs new slab)'
            ];
        }
        
        // Basement waterproofing
        if (lowerText.includes('waterproof') && lowerText.includes('basement')) {
            return [
                'Yes (French drain + sump pump)',
                'No (already in place)'
            ];
        }
        
        // Add bathroom to basement
        if (lowerText.includes('add a bathroom') && lowerText.includes('basement')) {
            return ['Yes', 'No'];
        }
        
        // Frame additional rooms
        if (lowerText.includes('frame') && lowerText.includes('additional rooms')) {
            return ['Yes', 'No'];
        }
        
        // Basement finish
        if (lowerText.includes('basement') && lowerText.includes('finishes') && lowerText.includes('looking')) {
            return ['Basic', 'Premium', 'High-End'];
        }
        
        // Home size
        if (lowerText.includes('home') && lowerText.includes('size') && lowerText.includes('approximate')) {
            return [
                'Small (under 1,500 sqft)',
                'Medium (1,500-2,500 sqft)',
                'Large (2,500+ sqft)'
            ];
        }
        
        // Areas to remodel
        if (lowerText.includes('which areas') || lowerText.includes('areas are you looking')) {
            return ['Kitchen(s)', 'Bathroom(s)', 'Basement', 'Whole home'];
        }
        
        // Major layout changes
        if (lowerText.includes('major layout changes')) {
            return [
                'Keep layout',
                'Open concept',
                'Additions (expand square footage)'
            ];
        }
        
        // Home finish
        if (lowerText.includes('finishes') && lowerText.includes('considering') && lowerText.includes('home')) {
            return ['Basic / Mid-Grade', 'Premium', 'High-End'];
        }
        
        // Initial service selection - look for all 4 services mentioned
        if (lowerText.includes('kitchen remodel') && 
            lowerText.includes('bathroom remodel') && 
            lowerText.includes('basement remodel')) {
            return [
                'Kitchen Remodel',
                'Bathroom Remodel',
                'Basement Remodel',
                'Full Home Remodel'
            ];
        }
        
        // Meeting booking
        if (lowerText.includes('book a meeting') || lowerText.includes('book a consultation')) {
            return ['Yes, book a meeting', 'No, not right now'];
        }
        
        // Other services
        if (lowerText.includes('other services')) {
            return [
                'Kitchen Remodel',
                'Bathroom Remodel',
                'Basement Remodel',
                'Full Home Remodel'
            ];
        }
        
        return null;
    }

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

        /* Debug indicator */
        .chat-assist-widget .debug-info {
            position: fixed;
            bottom: 650px;
            right: 20px;
            background: #fff;
            border: 2px solid #10b981;
            padding: 10px;
            border-radius: 8px;
            font-size: 11px;
            max-width: 300px;
            z-index: 10001;
            display: none;
        }
        .chat-assist-widget .debug-info.show {
            display: block;
        }
    `;
    document.head.appendChild(widgetStyles);

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

    let conversationId = '';
    let isWaitingForResponse = false;

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

    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');

    function createSessionId(){ return (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2); }
    
    function createTypingIndicator(){
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        return indicator;
    }

    function linkifyText(text){
        const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        return text.replace(urlPattern, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`);
    }

    function showButtons(options) {
        const existingButtons = messagesContainer.querySelector('.option-buttons');
        if (existingButtons) existingButtons.remove();

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'option-buttons';

        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => {
                submitMessage(option);
                buttonsContainer.remove();
            });
            buttonsContainer.appendChild(button);
        });

        messagesContainer.appendChild(buttonsContainer);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function startChatWithoutRegistration(){
        if (!conversationId) conversationId = createSessionId();

        const botMessage = document.createElement('div');
        botMessage.className = 'chat-bubble bot-bubble';
        botMessage.textContent = AUTO_GREETING;
        messagesContainer.appendChild(botMessage);

        const buttons = getButtonsForResponse(AUTO_GREETING);
        if (buttons) {
            console.log('Buttons detected for greeting:', buttons);
            showButtons(buttons);
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (settings.webhook?.url) {
            const initData = [{
                action: "loadPreviousSession",
                sessionId: conversationId,
                route: settings.webhook.route || "",
                metadata: {}
            }];
            fetch(settings.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(initData)
            }).catch(()=>{});
        }
    }

    async function submitMessage(messageText){
        if (isWaitingForResponse) return;
        isWaitingForResponse = true;

        const existingButtons = messagesContainer.querySelector('.option-buttons');
        if (existingButtons) existingButtons.remove();

        const requestData = {
            action: "sendMessage",
            sessionId: conversationId || (conversationId = createSessionId()),
            route: settings.webhook.route,
            chatInput: messageText,
            metadata: {}
        };

        const userMessage = document.createElement('div');
        userMessage.className = 'chat-bubble user-bubble';
        userMessage.textContent = messageText;
        messagesContainer.appendChild(userMessage);

        const typing = createTypingIndicator();
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try{
            const resp = await fetch(settings.webhook.url, {
                method: 'POST', 
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(requestData)
            });
            const data = await resp.json().catch(()=> ({}));

            if (typing && typing.parentNode) messagesContainer.removeChild(typing);

            const botMessage = document.createElement('div');
            botMessage.className = 'chat-bubble bot-bubble';
            const responseText = Array.isArray(data) ? (data[0]?.output || '') : (data?.output || '');
            botMessage.innerHTML = linkifyText(responseText || "...");
            messagesContainer.appendChild(botMessage);

            // Check for buttons
            console.log('Checking response for buttons:', responseText);
            const buttons = getButtonsForResponse(responseText);
            if (buttons) {
                console.log('Buttons found:', buttons);
                showButtons(buttons);
            } else {
                console.log('No buttons matched for this response');
            }

            messagesContainer.scrollTop = messagesContainer.scrollHeight;

        }catch(err){
            console.error('Message submission error:', err);
            if (typing && typing.parentNode) messagesContainer.removeChild(typing);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = "Sorry, I couldn't send your message. Please try again.";
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }finally{
            isWaitingForResponse = false;
        }
    }

    function autoResizeTextarea(){
        messageTextarea.style.height = 'auto';
        const h = Math.min(messageTextarea.scrollHeight, 120);
        messageTextarea.style.height = h + 'px';
    }

    sendButton.addEventListener('click', () => {
        const messageText = messageTextarea.value.trim();
        if (messageText && !isWaitingForResponse) {
            submitMessage(messageText);
            messageTextarea.value = '';
            messageTextarea.style.height = 'auto';
        }
    });

    messageTextarea.addEventListener('input', autoResizeTextarea);
    messageTextarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const messageText = messageTextarea.value.trim();
            if (messageText && !isWaitingForResponse) {
                submitMessage(messageText);
                messageTextarea.value = '';
                messageTextarea.style.height = 'auto';
            }
        }
    });

    let firstOpen = true;
    launchButton.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
        if (chatWindow.classList.contains('visible')) {
            if (firstOpen) {
                startChatWithoutRegistration();
                firstOpen = false;
            }
        }
    });

    chatWindow.querySelector('.chat-close-btn').addEventListener('click', () => {
        chatWindow.classList.remove('visible');
    });
})();
