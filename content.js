console.log("Chrome extension ready!");

// Listen for message with submitted values coming from popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the user has selected/highlighted any range of text on the webpage
    textSelection = window.getSelection();
    textRange = textSelection.getRangeAt(0);

    function getNextTextNode(siblingNode) {
        // Check if the node is null
        if (!siblingNode) {
            return null;
        }          
        // Check if the node is a text node
        if (siblingNode.nodeType == 3)  {
            return siblingNode;
        }
        
        // Loop through all children of the sibling node
        for (let Child of siblingNode.childNodes) {
            if (Child.nodeType == 3) {
                // Return the child if it is a text node
                return Child;
            }
            else {
                // Recursively call function until a descendant of the current child node is a text node,
                // If none are found move on to the next child
                let textNode = getNextTextNode(Child);
                if (textNode !== null) {
                    return textNode;
                }
            }
        }
        
        return null;
    }

    function getTextNodes(Range) {
        let Ranges = [];
        
        // Get the node in which the selected range starts in
        let currentNode = Range.startContainer;

        let nodesToVisit = true;
        while (nodesToVisit) {
            // Create start and end offset for range of current node
            let startOffset;
            let endOffset;
            if(currentNode == Range.startContainer) {
                // If current node is first node in text selection
                startOffset = Range.startOffset;
            }
            else {
                // If current node isn't first node in text selection
                startOffset = 0;
            }

            if(currentNode == Range.endContainer) {
                // If current node is last node in the text selection
                endOffset = Range.endOffset;
            }
            else {
                // If current node isn't last node in the text selection
                endOffset = currentNode.textContent.length;
            }
            
            // Create new range for the current element in the selected node tree
            let currentNodeRange = document.createRange();
            currentNodeRange.setStart(currentNode, startOffset);
            currentNodeRange.setEnd(currentNode, endOffset);
            Ranges.push(currentNodeRange);
            
            /// Move to the next text container in the tree order
            nodesToVisit = false;
            // Check that there isn't a node to create a range from and that the current node isn't the last node in the selection
            while (!nodesToVisit && currentNode != Range.endContainer) {
                let nextNode = getNextTextNode(currentNode.nextSibling);
                // Check if next node in tree order is found
                if (nextNode) {
                    currentNode = nextNode;
                    nodesToVisit = true;
                }
                else {
                    if (currentNode.nextSibling) {
                        // Set current node to its sibling node, if it exists
                        currentNode = currentNode.nextSibling;
                    }
                    else if (currentNode.parentNode) {
                        // Set current node to its parent node, if it exists
                        currentNode = currentNode.parentNode;
                    } 
                    else {
                        // Exit iteration
                        break;
                    }                    
                }
            }
        }
        
        // Return created ranges
        return Ranges;
    }

    // Listen for click on extension's context menu
    if(request.clicked) {
        console.log(request);
        // Get all selected text nodes
        for(let textNode of getTextNodes(textRange)) {
            // Create text-node wrapper element
            console.log("Bruh");
            var Wrapper = document.createElement("span");
            (request.bold) ? Wrapper.style.fontWeight = "bold" : Wrapper.style.fontWeight = "normal";
            (request.italic) ? Wrapper.style.fontStyle = "italic" : Wrapper.style.fontStyle = "normal";
            Wrapper.style.color = request.color;
            Wrapper.style.fontFamily = request.font;
            

            // Wrap text-nodes with wrapper element
            textNode.surroundContents(Wrapper);
        }
    }
    else {
        // Check if there is a valid, selected range of text
        if(textSelection.anchorNode != null && textSelection.type != "Caret") {
            if (textSelection.rangeCount && textSelection.getRangeAt) {
                console.log(request);
                // Get all selected text-nodes
                for(let textNode of getTextNodes(textRange)) {
                    // Create text-node wrapper element
                    var Wrapper = document.createElement("span");
                    (request.bold) ? Wrapper.style.fontWeight = "bold" : Wrapper.style.fontWeight = "normal";
                    (request.italic) ? Wrapper.style.fontStyle = "italic" : Wrapper.style.fontStyle = "normal";
                    Wrapper.style.color = request.color;
                    Wrapper.style.fontFamily = request.font;
                
                    // Wrap text-nodes with wrapper element
                    textNode.surroundContents(Wrapper);
                }
            }
        }
        else {
            // Get all elements from current webpage
            const Elements = document.getElementsByTagName("*");

            // Add all submitted styles to webpage elements
            for(const element of Elements) {
            (request.bold) ? element.style.fontWeight = "bold" : element.style.fontWeight = "normal";
            (request.italic) ? element.style.fontStyle = "italic" : element.style.fontStyle = "normal";
            (request.underline) ? element.style.textDecoration = "underline" : element.style.textDecoration = "none";
            element.style.color = request.color;
            element.style.textDecorationColor = request.underlinecolor;
            element.style.fontFamily = request.font;
            element.style.fontSize = request.size + "px";
            }
        }
    }
    // Send response to popup script
    sendResponse({confirmation: "Message recieved!"});
})