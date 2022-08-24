console.log("Chrome extension ready 3!");

// Listen for message with submitted values coming from popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the user has selected/highlighted any range of text on the webpage
    textSelection = window.getSelection();
    if(textSelection.anchorNode != null && textSelection.type != "Caret") {
        if (textSelection.rangeCount && textSelection.getRangeAt) {
            textRange = textSelection.getRangeAt(0);
    
            // Set design mode to on
            document.designMode = "on";
            if (textRange) {
                textSelection.removeAllRanges();
                textSelection.addRange(textRange);
            }   
        
            // Apply changes from the extension to the webpage text
            document.execCommand("ForeColor", false, request.color);
            document.execCommand("fontName", false, request.font);
        
            // Set design mode to off
            document.designMode = "off";
        }
    }
    else {
        // Get all elements from current webpage
        const Elements1 = document.getElementsByTagName("*");

        console.log("2");

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
    }

    // Send response to popup script
    sendResponse({confirmation: "Message recieved!"});
})