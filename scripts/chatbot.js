
// =================================================================================================
// IMPORTANT SECURITY WARNING
// =================================================================================================
// This file contains a hardcoded API key. This is a MAJOR security risk.
// Your API key is visible to anyone who visits your website.
// An attacker can steal this key and use it to make requests on your behalf,
// which could result in significant charges to your Groq account.
//
// RECOMMENDATION:
// 1. Immediately remove the key from this file.
// 2. Use a server-side proxy (like a Netlify/Vercel serverless function or a Cloudflare Worker)
//    to securely store and use your API key. The frontend should call your proxy, not Groq directly.
// 3. Set up billing alerts and usage caps on your Groq account to mitigate potential abuse.
//
// You are proceeding at your own risk.
// =================================================================================================

(function() {
    const GROQ_API_KEY = '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';
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    const SYSTEM_PROMPT = `You are a friendly, professional support assistant for Sarasota Computer Solutions, a local IT services company in Sarasota, FL. Your name is "SCS-Bot". Our services include residential computer repair, small business IT, managed services, Microsoft 365 & Google Workspace support, EV consulting, and DJ services.

Keep responses concise (2-3 sentences max for chat). Be friendly and patient, especially with non-technical users. If you don't know something about our services, admit it and suggest contacting us at (941) 404-8345 or emailing dj@sarasotacomputersolutions.com. When appropriate, suggest relevant services or direct users to pages on sarasotacomputersolutions.com. Always encourage scheduling a consultation for complex issues. Service hours are Mon–Fri 9AM–5PM, Sat 10AM–4PM.`;

    let conversationHistory = [{ role: 'system', content: SYSTEM_PROMPT }];

    function createChatbotUI() {
        const isChatPage = !!document.querySelector('.full-page-chat');
        const container = document.getElementById('chatbot-container') || document.body;
        const initialMessage = "Hi! I'm SCS-Bot. How can I help you with your tech needs today? Ask me about computer repair, business IT, or our other services.";

        const chatbotHTML = `
            <div id="chatbot-widget" class="${isChatPage ? 'full-page' : 'floating'}">
                <div id="chatbot-header">
                    <span>SCS-Bot</span>
                    <button id="chatbot-close" aria-label="Close Chat">&times;</button>
                </div>
                <div id="chatbot-messages"></div>
                <div id="chatbot-input-container">
                    <textarea id="chatbot-input" placeholder="Type your message..." aria-label="Chat message"></textarea>
                    <button id="chatbot-send" aria-label="Send Message">Send</button>
                </div>
            </div>
            <button id="chatbot-toggle" aria-label="Open Chat">💬</button>
        `;

        if (isChatPage) {
            container.innerHTML = chatbotHTML;
            document.getElementById('chatbot-widget').style.display = 'flex';
            document.getElementById('chatbot-toggle').style.display = 'none';
        } else {
            document.body.insertAdjacentHTML('beforeend', chatbotHTML);
            // Default to closed state
            document.getElementById('chatbot-widget').style.display = 'none';
            document.getElementById('chatbot-toggle').style.display = 'flex';
        }
        
        addMessage('assistant', initialMessage);
        
        attachEventListeners();
    }

    function addMessage(sender, text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chatbot-message', `${sender}-message`);
        // Basic markdown for bold and links
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        messageElement.innerHTML = text;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function handleSendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        if (!message) return;

        addMessage('user', message);
        input.value = '';
        input.disabled = true;
        document.getElementById('chatbot-send').disabled = true;
        addMessage('assistant', '<em>Typing...</em>');
        
        conversationHistory.push({ role: 'user', content: message });

        try {
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama3-8b-8192',
                    messages: conversationHistory,
                    max_tokens: 250,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            const reply = data.choices[0]?.message?.content || "Sorry, I couldn't process that. Please try again.";
            
            conversationHistory.push({ role: 'assistant', content: reply });

            // Remove "Typing..." message
            const messagesContainer = document.getElementById('chatbot-messages');
            messagesContainer.removeChild(messagesContainer.lastChild);

            addMessage('assistant', reply);

        } catch (error) {
            console.error('Groq API error:', error);
            const messagesContainer = document.getElementById('chatbot-messages');
            messagesContainer.removeChild(messagesContainer.lastChild);
            
            let errorMessage = 'Sorry, I am having trouble connecting. Please try again later or call us at (941) 404-8345.';
            if (error instanceof TypeError && error.message.includes('fetch')) {
                errorMessage = "I can't connect to the AI service due to browser security restrictions (CORS policy). This is an expected limitation of hosting on GitHub Pages, which doesn't support the required server-side component. To make me work, the site needs to be hosted on a platform like Netlify or Vercel, which have free tiers and can keep the API key secure.";
            }

            addMessage('assistant', errorMessage);
        } finally {
            input.disabled = false;
            document.getElementById('chatbot-send').disabled = false;
            input.focus();
        }
    }

    function attachEventListeners() {
        const sendButton = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const toggleButton = document.getElementById('chatbot-toggle');
        const closeButton = document.getElementById('chatbot-close');
        const widget = document.getElementById('chatbot-widget');

        sendButton.addEventListener('click', handleSendMessage);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        toggleButton.addEventListener('click', () => {
            widget.style.display = 'flex';
            toggleButton.style.display = 'none';
        });

        closeButton.addEventListener('click', () => {
            widget.style.display = 'none';
            toggleButton.style.display = 'flex';
        });
    }

    document.addEventListener('DOMContentLoaded', createChatbotUI);

})();
