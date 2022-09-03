// Context menu properties object
const contextMenuProperties = {
    "id": "storageActive",
    "title": "Style selected text with saved styling configuration",
    "contexts": ["selection"],
    "enabled": false
};

// Create extension's context menu
chrome.contextMenus.create(contextMenuProperties)

// Check if styling configuration is already saved 
chrome.storage.sync.get(["saved"], (result) => {
    if(result.saved) {
        // Activate extension's context menu 
        chrome.contextMenus.update(contextMenuProperties.id, {
            "enabled": true
        });
    }
})

// Listen for change in value of saved-state
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.saved) {
        // Activate extension's context menu
        chrome.contextMenus.update(contextMenuProperties.id, {"enabled": true});
    }
    else {
        // Deactivate extension's context menu
        chrome.contextMenus.update(contextMenuProperties.id, {"enabled": false});
    }
})

// Listen for click on extension's context menu
chrome.contextMenus.onClicked.addListener(() => {
    // Alert content script
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {clicked: true});
    });
})