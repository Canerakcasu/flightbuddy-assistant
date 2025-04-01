
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const flightSearchForm = document.getElementById('flightSearchForm');
    const flightNumberInput = document.getElementById('flightNumberInput');
    const errorMessage = document.getElementById('errorMessage');
    const flightDetailsContainer = document.getElementById('flightDetailsContainer');
    const searchHistoryContainer = document.getElementById('searchHistoryContainer');
    const searchHistoryList = document.getElementById('searchHistoryList');
    
    // Chat elements
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const expandChatBtn = document.getElementById('expandChatBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    
    // State
    let activeFlight = null;
    let searchHistory = [];
    
    // Initialize
    loadSearchHistory();
    
    // Event Listeners
    flightSearchForm.addEventListener('submit', handleFlightSearch);
    chatToggleBtn.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', closeChat);
    expandChatBtn.addEventListener('click', toggleExpandChat);
    sendMessageBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Functions
    async function handleFlightSearch(e) {
        e.preventDefault();
        
        const flightNumber = flightNumberInput.value.trim().toUpperCase();
        
        if (!/^[A-Za-z]{2,3}\d{1,4}$/.test(flightNumber)) {
            showToast('Invalid flight format! Example: TK123', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/search-flight/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ flight_number: flightNumber })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                displayFlightDetails(data.flight);
                activeFlight = flightNumber;
                addFlightToSearchHistory(flightNumber);
                errorMessage.classList.add('hidden');
                showToast(`Now tracking flight ${flightNumber}!`, 'success');
                
                // Add bot message about tracking
                addChatMessage(`✅ Now tracking flight ${flightNumber}!`, 'bot');
            } else {
                errorMessage.querySelector('p').textContent = data.error || 'Could not retrieve flight information.';
                errorMessage.classList.remove('hidden');
                flightDetailsContainer.classList.add('hidden');
                showToast(data.error || 'Could not retrieve flight information.', 'error');
            }
        } catch (err) {
            console.error('Error:', err);
            errorMessage.querySelector('p').textContent = 'Connection error. Please try again.';
            errorMessage.classList.remove('hidden');
            showToast('Connection error. Please try again.', 'error');
        }
    }
    
    function displayFlightDetails(flight) {
        const statusClass = flight.status === 'Delayed' ? 'bg-amber-600' : 
                           flight.status === 'Cancelled' ? 'bg-red-600' : 'bg-blue-600';
        
        const html = `
            <div class="flight-header">
                <h2 class="text-xl font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
                    ${flight.number}
                </h2>
                <span class="status-badge ${statusClass}">
                    ${flight.status}
                </span>
            </div>
            
            <div class="flight-info-grid">
                <div class="flight-info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transform -rotate-45 mt-1"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
                    <div>
                        <h3 class="text-sm font-medium text-slate-300">Departure</h3>
                        <p class="text-white font-semibold">${flight.departure.airport}</p>
                        <p class="text-sm text-slate-400">${flight.departure.time}</p>
                    </div>
                </div>
                
                <div class="flight-info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transform rotate-45 mt-1"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
                    <div>
                        <h3 class="text-sm font-medium text-slate-300">Arrival</h3>
                        <p class="text-white font-semibold">${flight.arrival.airport}</p>
                        <p class="text-sm text-slate-400">${flight.arrival.time}</p>
                    </div>
                </div>
            </div>
            
            <div class="flight-progress">
                <div class="progress-header">
                    <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Flight Progress
                    </span>
                    <span>${flight.progress}%</span>
                </div>
                
                <div class="relative pt-1">
                    <div class="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-700">
                        <div 
                            style="width: ${flight.progress}%" 
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600"
                        ></div>
                    </div>
                </div>
                
                <div class="flex justify-between text-xs text-slate-400">
                    <div>Departure: ${flight.departure.airport.split(' ')[0]}</div>
                    <div>${flight.remaining}</div>
                    <div>Arrival: ${flight.arrival.airport.split(' ')[0]}</div>
                </div>
            </div>
        `;
        
        flightDetailsContainer.innerHTML = html;
        flightDetailsContainer.classList.remove('hidden');
    }
    
    async function loadSearchHistory() {
        try {
            const response = await fetch('/api/search-history/');
            const data = await response.json();
            
            if (data.search_history && data.search_history.length > 0) {
                searchHistory = data.search_history;
                displaySearchHistory();
            }
        } catch (err) {
            console.error('Failed to load search history:', err);
        }
    }
    
    function addFlightToSearchHistory(flightNumber) {
        if (!searchHistory.includes(flightNumber)) {
            searchHistory.unshift(flightNumber);
            searchHistory = searchHistory.slice(0, 10); // Keep only 10 items
            displaySearchHistory();
        }
    }
    
    function displaySearchHistory() {
        if (searchHistory.length === 0) {
            searchHistoryContainer.classList.add('hidden');
            return;
        }
        
        searchHistoryList.innerHTML = '';
        searchHistory.forEach(flight => {
            const li = document.createElement('li');
            li.className = 'text-sm bg-slate-700 px-3 py-2 rounded hover:bg-slate-600 cursor-pointer text-white';
            li.textContent = flight;
            li.addEventListener('click', () => {
                flightNumberInput.value = flight;
                flightSearchForm.dispatchEvent(new Event('submit'));
            });
            searchHistoryList.appendChild(li);
        });
        
        searchHistoryContainer.classList.remove('hidden');
    }
    
    function toggleChat() {
        chatWindow.classList.toggle('hidden');
    }
    
    function closeChat() {
        chatWindow.classList.add('hidden');
    }
    
    function toggleExpandChat() {
        chatWindow.classList.toggle('expanded');
        
        if (chatWindow.classList.contains('expanded')) {
            expandChatBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minimize-2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></svg>';
        } else {
            expandChatBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize-2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>';
        }
        
        scrollToBottom();
    }
    
    async function sendMessage() {
        const message = chatInput.value.trim();
        
        if (!message || !activeFlight) return;
        
        // Add user message
        addChatMessage(message, 'user');
        chatInput.value = '';
        
        // Add loading message
        const loadingMsgId = addChatMessage('<div class="flex items-center gap-2"><div class="animate-pulse">⌛</div><div>Preparing response...</div></div>', 'bot');
        
        try {
            const response = await fetch('/api/chat-assistant/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    flight_number: activeFlight,
                    message: message
                })
            });
            
            const data = await response.json();
            
            // Remove loading message
            const loadingMsg = document.getElementById(loadingMsgId);
            if (loadingMsg) {
                loadingMsg.remove();
            }
            
            if (response.ok && data.success) {
                addChatMessage(data.response, 'bot');
            } else {
                addChatMessage('⚠️ Sorry, I encountered an error. Please try again.', 'bot');
            }
        } catch (err) {
            console.error('Chat error:', err);
            // Remove loading message
            const loadingMsg = document.getElementById(loadingMsgId);
            if (loadingMsg) {
                loadingMsg.remove();
            }
            addChatMessage('⚠️ Connection error. Please try again.', 'bot');
        }
    }
    
    function addChatMessage(text, type) {
        const messageId = 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const messageDiv = document.createElement('div');
        messageDiv.id = messageId;
        messageDiv.className = `message ${type}-message p-3 rounded-lg max-w-[90%] ${
            type === 'user' 
                ? 'bg-blue-600 text-white self-end rounded-tr-none'
                : 'bg-slate-800 text-white self-start rounded-tl-none'
        }`;
        messageDiv.innerHTML = text;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        
        return messageId;
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = document.createElement('span');
        if (type === 'success') {
            icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
        } else {
            icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';
        }
        
        const text = document.createElement('span');
        text.textContent = message;
        
        toast.appendChild(icon);
        toast.appendChild(text);
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-1rem)';
            toast.style.transition = 'opacity 0.3s, transform 0.3s';
            
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Helper function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
