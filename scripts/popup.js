
// DOM elements
const adblockToggle = document.getElementById('adblockToggle');
const refreshButton = document.getElementById('refresh-btn');

let adblockEnabled = false;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    setupEventListeners();
});

// Load settings from storage
async function loadSettings() {
    try {
        const result = await chrome.storage.local.get("adblockEnabled");
        if(result.adblockEnabled !== undefined){
            adblockEnabled = result.adblockEnabled;
        }
        updateToggleState(adblockToggle, result.adblockEnabled);
    } catch (error) {
        console.error('Error loading settings:', error);
        statusElement.textContent = 'Error loading settings';
        statusElement.className = 'status disabled';
    }
}

// Update toggle visual state
function updateToggleState(toggle, isActive) {
    if (isActive) {
        toggle.classList.add('active');
    } else {
        toggle.classList.remove('active');
    }
}

// Setup event listeners
function setupEventListeners() {
    adblockToggle.addEventListener('click', toggleAdblock);
    refreshButton.addEventListener('click', handleRefresh);
}

// Toggle setting
async function toggleAdblock() {
    try {
        // Toggle the setting
        adblockEnabled = !adblockEnabled;
        
        // Save to storage
        await chrome.storage.local.set({ adblockEnabled: adblockEnabled});
        
        // Update UI
        const toggleElement = document.getElementById('adblockToggle');
        updateToggleState(toggleElement, adblockEnabled);  
        const activeTabId = await getCurrentTabId();
        chrome.tabs.sendMessage(activeTabId, { adblockEnabled: adblockEnabled }, function(response) {
            if(response){
                console.log("Message acknowledged!");
            } else {
                console.log("Message unacknowledged!");
            }
        });
    } catch (error) {
        console.error('Error toggling setting:', error);
    }
}

async function handleRefresh() {
    // Add spinning animation
    refreshButton.classList.add('spinning');
    
    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = refreshButton.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = rect.width / 2 - size / 2;
    const y = rect.height / 2 - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    refreshButton.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Remove spinning class after animation
    setTimeout(() => {
        refreshButton.classList.remove('spinning');
    }, 1000);
    
    // Here you would typically add your refresh logic
    console.log('Refreshing...');
    const activeTabId = await getCurrentTabId();
    chrome.tabs.reload(activeTabId)
    
    
    // Simulate refresh completion
    setTimeout(() => {
        console.log('Refresh completed!');
    }, 1000);
}


async function getCurrentTabId() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
}