console.log("Chrome extension ready!");

// Listen for message with submitted values coming from popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    textSelection = window.getSelection();

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


    // Create template for wrapper element
    let wrapperTemplate = document.createElement("span");
    if(request.bold != null) {
        (request.bold) ? wrapperTemplate.style.fontWeight = "bold" : wrapperTemplate.style.fontWeight = "normal";
    }
    if(request.italic != null) {
        (request.italic) ? wrapperTemplate.style.fontStyle = "italic" : wrapperTemplate.style.fontStyle = "normal";
    }
    if(request.underline != null) {
        (request.underline) ? wrapperTemplate.style.textDecoration = "underline" : wrapperTemplate.style.textDecoration = "none";
        wrapperTemplate.style.textDecorationColor = request.underlinecolor;
    }
    if(request.color != null) {
        wrapperTemplate.style.color = request.color;
    }
    if(request.font != null) {
        wrapperTemplate.style.fontFamily = request.font;

        // Create and add link element to pull the submitted font
        let gfLink = document.createElement("link");
        gfLink.type = "text/css";
        gfLink.rel = "stylesheet";
        let gfLinkHref = "https://fonts.googleapis.com/css?family=" + request.font;
        gfLink.href = gfLinkHref;
        document.head.appendChild(gfLink);
    }
    if(request.size != null) {
        wrapperTemplate.style.fontSize = request.size + "px";
    }
    // Set stilyze identifier for wrapper element
    wrapperTemplate.dataset.hijklmnop = "hap"

    // Check if there is a valid text-selection
    if(textSelection.anchorNode != null && textSelection.type != "Caret") {
        if (textSelection.rangeCount && textSelection.getRangeAt) {
        textRange = textSelection.getRangeAt(0);
        textNodes = getTextNodes(textRange);
        
        // Create and populate list of reference elements for access to each selected node's parent element
        referList = [];
        for(let textNode of textNodes) {
            let reference = document.createElement("span");
            textNode.surroundContents(reference);
        
            referList.push(reference);
        }

        if(textNodes.length == 1) {
            // Code for single node selection
            parentElement = referList[0].parentElement;

            // Check if parent of node contains stilyze identifier
            if(parentElement.dataset.hijklmnop == "hap") {
                let selectedRange = textNodes[0];

                // Range to mark nodes between selected node and end of parent node
                let afRange = document.createRange();
                afRange.setStart(parentElement, selectedRange.endOffset);
                afRange.setEnd(parentElement, parentElement.childNodes.length);
                
                // Check if range's contents are empty
                if(afRange.toString().length > 0) {
                    let afWrapper = parentElement.cloneNode(false);
                    afRange.surroundContents(afWrapper);
                }

                // Range to mark nodes between selected node and start of parent node
                let befRange = document.createRange();
                befRange.setStart(parentElement, 0);
                befRange.setEnd(parentElement, selectedRange.startOffset);

                // Wrap selected node 
                let innerWrapper = wrapperTemplate.cloneNode();
                selectedRange.surroundContents(innerWrapper);

                // Check if range's contents are empty
                if(befRange.toString().length > 0) {
                    let befWrapper = parentElement.cloneNode(false);
                    befRange.surroundContents(befWrapper);
                }

                // Get rid of reference elements and previous wrapper elements
                referList[0].replaceWith(...referList[0].childNodes);
                parentElement.replaceWith(...parentElement.childNodes);
            }
            else {
                // Wrap selected node
                let Wrapper = wrapperTemplate.cloneNode();
                textNodes[0].surroundContents(Wrapper);
                // Get rid of reference elementsGe
                referList[0].replaceWith(...referList[0].childNodes);
            }
        }
        else {
            // Code for multi node selection
            // Loop through all selected nodes
            for(let i = 0; i < textNodes.length; i++) {
                parentElement = referList[i].parentElement;
                
                // Wrap current node
                let Wrapper = wrapperTemplate.cloneNode();
                textNodes[i].surroundContents(Wrapper);

                // Check if first element's parent has stilyze identifier
                if(i == 0 && parentElement.dataset.hijklmnop == "hap") {
                    // Range to mark nodes between start of parent element and start of first selected node
                    let befRange = document.createRange();
                    befRange.setStart(parentElement, 0);
                    befRange.setEnd(parentElement, textNodes[i].startOffset);

                    let befWrapper = parentElement.cloneNode(false);
                    befRange.surroundContents(befWrapper)
                }
                // Check if last element's parent has stilyze identifier
                else if(i == textNodes.length - 1 && parentElement.dataset.hijklmnop == "hap") {
                    // Range to mark nodes between end of selected node and end of parent element
                    let afRange = document.createRange();
                    afRange.setStart(parentElement, textNodes[i].endOffset);
                    afRange.setEnd(parentElement, parentElement.childNodes.length);

                    let afWrapper = parentElement.cloneNode(false);
                    afRange.surroundContents(afWrapper);
                }

                // Get rid of reference elements and previous wrapper elements
                referList[i].replaceWith(...referList[i].childNodes);
                if(parentElement.dataset.hijklmnop == "hap") {
                    parentElement.replaceWith(...parentElement.childNodes);
                }
            }
        }
        }
    }
    else {
        // Get all elements from current webpage
        const Elements = document.getElementsByTagName("*");

        // Add all submitted styles to webpage elements
        for(const element of Elements) {
            element.style.fontWeight = wrapperTemplate.style.fontWeight;
            element.style.fontStyle = wrapperTemplate.style.fontStyle;
            element.style.textDecoration = wrapperTemplate.style.textDecoration;
            element.style.textDecorationColor = wrapperTemplate.style.textDecorationColor
            element.style.color = wrapperTemplate.style.color;
            element.style.fontFamily = wrapperTemplate.style.fontFamily;
            element.style.fontSize = wrapperTemplate.style.fontSize;
        }
    }

    // Send response to popup script
    sendResponse({confirmation: "Message recieved!"});
})