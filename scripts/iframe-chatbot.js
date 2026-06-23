(function() {
    'use strict';

    // Don't run on the dedicated chat page
    if (window.location.pathname.endsWith('chat.html')) {
        return;
    }

    const CHATBOT_URL = "https://sarasota-tech-support-ai-701502515049.us-west1.run.app";

    function initializeChatbot() {
        const isEvPage = document.body.classList.contains('ev-page');

        const modalHTML = `
            <div id="chatbotModal" class="chatbot-modal ${isEvPage ? 'ev-chatbot-modal' : ''}">
                <div class="chatbot-content ${isEvPage ? 'ev-chatbot-content' : ''}">
                    <button id="closeChatbot" class="chatbot-close ${isEvPage ? 'ev-chatbot-close' : ''}" aria-label="Close chatbot">&times;</button>
                    <div class="chatbot-header ${isEvPage ? 'ev-chatbot-header' : ''}">
                        <h3>SCS-Bot</h3>
                        <p>Your AI-powered tech assistant</p>
                    </div>
                    <div class="chatbot-frame ${isEvPage ? 'ev-chatbot-frame' : ''}">
                        <iframe
                            src="${CHATBOT_URL}"
                            title="Sarasota Tech Support AI"
                            style="width:100%;height:100%;border:none;border-radius:0.75rem"
                            allow="microphone; camera"
                        ></iframe>
                    </div>
                </div>
            </div>
        `;

        const buttonHTML = `
            <button id="chatbotButton" class="chatbot-button ${isEvPage ? 'ev-chatbot-button' : ''}" aria-label="Open chatbot" title="Ask a question">
                <span class="chatbot-icon ${isEvPage ? 'ev-chatbot-icon' : ''}">💬</span>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.insertAdjacentHTML('beforeend', buttonHTML);

        const chatbotButton = document.getElementById('chatbotButton');
        const chatbotModal = document.getElementById('chatbotModal');
        const closeChatbotBtn = document.getElementById('closeChatbot');

        if (chatbotButton && chatbotModal && closeChatbotBtn) {
            chatbotButton.addEventListener('click', () => {
                chatbotModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            });

            const closeModal = () => {
                chatbotModal.classList.remove('open');
                document.body.style.overflow = 'auto';
            };

            closeChatbotBtn.addEventListener('click', closeModal);

            chatbotModal.addEventListener('click', (e) => {
                if (e.target === chatbotModal) {
                    closeModal();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && chatbotModal.classList.contains('open')) {
                    closeModal();
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChatbot);
    } else {
        initializeChatbot();
    }

})();
