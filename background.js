// Context menu properties object
const contextMenuProperties = {
    "id": "formActive",
    "title": "Style selected text with saved styling configuration",
    "contexts": ["selection"],
    "enabled": false
};

// Remove all previously created context menus
chrome.contextMenus.removeAll(function() {
    // Create extension's current context menu
    chrome.contextMenus.create(contextMenuProperties);
});

// Activate context menu if an input has been activated
chrome.storage.sync.get(["bold", "italic", "underline", "color", "font", "size"], (result) => {
    if(result.bold != null || result.italic != null || result.underline != null || result.color != null || result.font != null || result.size != null) {
        chrome.contextMenus.update(contextMenuProperties.id, {"enabled": true});
    }
})

// Listen for change in value of saved-state
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.activate) {
        if(!contextMenuProperties.enabled) {
            // Activate extension's context menu
            chrome.contextMenus.update(contextMenuProperties.id, {"enabled": true});
        }
    }
    else {
        // Deactivate extension's context menu
        chrome.contextMenus.update(contextMenuProperties.id, {"enabled": false});
    }
})

// Listen for click on extension's context menu
chrome.contextMenus.onClicked.addListener(() => {
    chrome.storage.sync.get(["bold", "italic", "underline", "color", "underlinecolor", "font", "size"], (request) => {
        // Alert content script
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {clicked: true, bold: request.bold, italic: request.italic, underline: request.underline, color: request.color, underlinecolor: request.underlinecolor, font: request.font, size: request.size});
        });
    });
})