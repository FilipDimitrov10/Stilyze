console.log("Chrome extension ready!");

// Listen for message with submitted values coming from popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Get all elements from current webpage
    const Elements1 = document.getElementsByTagName("*");

    // Add all submitted styles to webpage elements
    for(const element of Elements1) {
        (request.bold) ? element.style.fontWeight = "bold" : element.style.fontWeight = "normal";
        (request.italic) ? element.style.fontStyle = "italic" : element.style.fontStyle = "normal";
        (request.underline) ? element.style.textDecoration = "underline" : element.style.textDecoration = "none";
        element.style.color = request.color;
        element.style.textDecorationColor = request.underlinecolor;
        element.style.fontFamily = request.font;
        element.style.fontSize = request.size + "px";
    }

    // Send response to popup script
    sendResponse({confirmation: "Message recieved!"});
})