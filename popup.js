console.log("Hello Stilyze!");

const sampleText = document.querySelector(".sample");
const form = document.querySelector("form");

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
let prevLink;

// Select all inputs in form
const inputs = document.querySelectorAll("[data-input]");
const underlineColor = document.querySelector("div.col-8");
var Save = document.querySelector("#save");

console.log(inputs);

// Fetch google fonts metadata
chrome.storage.sync.get(["font"], (result) => {
    // Set selected option as first
    if(result.font != null) {
        const selectedFontOption = document.createElement("option");
        selectedFontOption.textContent = result.font;
        selectedFontOption.value = result.font;
        inputs[5].appendChild(selectedFontOption);
    }
    
    fetch("./google-fonts.json").then((response) => response.json()).then((json) => {
        // Populate select input with an option for each font
        json.items.forEach((font) => {
            let fontOption = document.createElement("option");
            fontOption.textContent = font.family;
            fontOption.value = font.family;
            
            // Skip population if current font is equal to selected font
            if(font.family == result.font) {
                return;
            }
            inputs[5].appendChild(fontOption);
        })
    })
})


// Get all stored values from storage
chrome.storage.sync.get(["bold", "italic", "underline", "color", "underlinecolor", "font", "size"], (result) => {
    // Check whether values are null (check if user has saved input field values)
    if(result.bold != undefined || result.italic != undefined || result.underline != undefined || result.color != undefined || result.font != undefined || result.size != undefined) {
        if(result.bold != null) {
            // Verify if bold input was checked
            if(result.bold) {
                // Set bold input value to storage value
                inputs[0].click();
                inputs[0].checked = "true";
            }

            inputs[0].parentElement.style.opacity = "100%";
        }
        
        if(result.italic != null) {
            // Verify if italic input was checked
            if(result.italic) {
                inputs[1].click();
                inputs[1].checked = "true";
            }

            inputs[1].parentElement.style.opacity = "100%";
        }
        
        if(result.underline != null) {
             // Verify if underline input was checked
            if(result.underline) {
                // Set underline input value to storage value
                inputs[2].click();
                inputs[2].checked = "true";

                // Set underline-color input value to storage value
                inputs[4].style.display = "block";
                inputs[4].value = result.underlinecolor

                inputs[4].parentElement.style.opacity = "100%";
            }

            inputs[2].parentElement.style.opacity = "100%";
        }
 
        if(result.color) {
            // Set text-color input value to storage value
            inputs[3].value = result.color;

            inputs[3].parentElement.style.opacity = "100%";
        }
        
        if(result.font) {
            // Set font input value to storage value
            const option1 = document.querySelector("option[data-first]");
            option1.remove();

            inputs[5].style.opacity = "100%";

            // Remove previous font link, if it exists
            if(prevLink) {
                prevLink.remove();
            }

            // Create and add link element to pull the font
            let gfLink = document.createElement("link");
            gfLink.type = "text/css";
            gfLink.rel = "stylesheet";
            let gfLinkHref = "https://fonts.googleapis.com/css?family=" + result.font;
            gfLink.href = gfLinkHref;
            prevLink = document.head.appendChild(gfLink);
        }
        
        if(result.size) {
            // Set font-size input value to storage value
            inputs[6].value = result.size;

            inputs[6].style.opacity = "100%";
        }

        // Update sample text appearance
        sampleText.style.color = result.color;
        sampleText.style.textDecorationColor = result.underlinecolor;
        sampleText.style.fontFamily = result.font;
        sampleText.style.fontSize = result.size + "px";
    }
    else {
        return;
    }
})

// Form submission event handling
form.addEventListener("submit", (e) => {   
    e.preventDefault();
    
    // Get all stored values from storage
    chrome.storage.sync.get(["bold", "italic", "underline", "color", "underlinecolor", "font", "size"], (result) => {
        // Submission fields object
        var Submission = {};

        if(result.bold != null) {
            // Populate bold field of submission
            Submission.bold = result.bold;
        }
        if(result.italic != null) {
            // Populate italic field of submission
            Submission.italic = result.italic;
        }
        if(result.underline != null) {
            // Populate underline field of submission
            Submission.underline = result.underline;
            if(result.underline.checked) {
                // Populate underline-color field of submission
                Submission.underlinecolor = result.underlinecolor;
            }
        }
        if(result.color != null) {
            // Populate text-color field of submission
            Submission.color = result.color;
        }   
        if(result.font != null) {
            // Populate font field of submission
            Submission.font = result.font;
        }
        if(result.size != null) {
            // Populate font-size field of submission
            Submission.size = result.size;
        }

        // Send submitted values to content script
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, Submission, (response) => {
                console.log(response);
            })
        });
    })

    return false;
})

// Form reset event handling
form.addEventListener("reset", (e) => {
    // Reset form values
    form.reset();
    underlineColor.style.display = "none";

    // De-activate form inputs
    for(let i = 0; i < 5; i++) {
        inputs[i].parentElement.style.opacity = "50%";
    }
    inputs[5].style.opacity = "50%";
    chrome.storage.sync.get(["font"], (result) => {
        if(result.font) {
            let defOption = document.createElement("option");
            defOption.dataset.dataFirst = null;
            defOption.selected = true;
            defOption.disabled = true;
            defOption.hidden = true;
            defOption.textContent = "Select font";

            inputs[5].prepend(defOption);
        }
    })
    inputs[6].style.opacity = "50%";

    // Clear storage values
    chrome.storage.sync.clear();
    
    // Reset sample text styling
    sampleText.style.fontWeight = "normal";
    sampleText.style.fontStyle = "normal";
    sampleText.style.textDecoration = "none";
    sampleText.style.textDecorationColor = "#000000";
    sampleText.style.color = "#000000";
    sampleText.style.fontFamily = "Helvetica";
    sampleText.style.fontSize = "25px";

    // De-activate extension's context menu
    chrome.runtime.sendMessage({"activate": false});
})

// Cycle through each input element
inputs.forEach((element) => {
    // Track and apply input changes to the sample text for each input element
    element.addEventListener("change", (e) => {
        e.preventDefault();

        const sender = e.target;

        // Activate extension's context menu
        chrome.runtime.sendMessage({"activate": true});

        // Clause for bold-checkbox input change
        if(sender.id == "bold") {
            // Activate bold input if it hasn't already been activated
            chrome.storage.sync.get(["bold"], (result) => {
                if(!result.bold) {
                    sender.parentElement.style.opacity = "100%";
                }
            })
            
            // Set bold value in storage
            chrome.storage.sync.set({"bold": sender.checked});
            
            // Check if the checkbox is checked
            if(sender.checked) {
                sampleText.style.fontWeight = "bold";
            }
            else {
                sampleText.style.fontWeight = "normal";
            }
        }

        // Clause for italic-checkbox input change
        if(sender.id == "italic") {
            // Activate italic input if it hasn't already been activated
            chrome.storage.sync.get(["italic"], (result) => {
                if(!result.italic) {
                    sender.parentElement.style.opacity = "100%";            
                }
            })
            
            // Set italic value in storage
            chrome.storage.sync.set({"italic": sender.checked});

            // Check if the checkbox is checked
            if(sender.checked) {
                sampleText.style.fontStyle = "italic";
            }
            else {
                sampleText.style.fontStyle = "normal";
            }
        }

        // Clause for underline-checkbox input change 
        if(sender.id == "underline") {
            // Activate underline input if it hasn't already been activated
            chrome.storage.sync.get(["underline"], (result) => {
                if(!result.underline) {
                    sender.parentElement.style.opacity = "100%";
                    underlineColor.style.opacity = "100%";
                }
            })
            
            // Set underline value in storage
            chrome.storage.sync.set({"underline": sender.checked});
            
            // Check if the checkbox is checked
            if(sender.checked) {
                sampleText.style.textDecoration = "underline";

                underlineColor.style.display = "block";
            }
            else {
                sampleText.style.textDecoration = "none";

                underlineColor.style.display = "none";
            }
        }

        // Clause for underline-color input change
        if(sender.id == "underline-color") {
            // Set underline-color value in storage
            chrome.storage.sync.set({"underlinecolor": sender.value});

            sampleText.style.textDecorationColor = sender.value;
        }

        // Clause for text-color input change
        if(sender.id == "color") {
            // Activate color input if it hasn't already been activated
            chrome.storage.sync.get(["color"], (result) => {
                if(!result.size) {
                    sender.parentElement.style.opacity = "100%";
                }
            })
            
            // Set text-color value in storage
            chrome.storage.sync.set({"color": sender.value});

            sampleText.style.color = sender.value;
        }

        // Clause for font input change
        if(sender.id == "FontSelect") {
            // Activate font input if it hasn't already been activated
            chrome.storage.sync.get(["font"], (result) => {
                if(!result.font) {
                    sender.style.opacity = "100%";
                }
            })
            
            // Set font value in storage
            chrome.storage.sync.set({"font": sender.value});

            // Remove previous font link, if it exists
            if(prevLink) {
                prevLink.remove();
            }
            
            // Create and add link element to pull the font
            let gfLink = document.createElement("link");
            gfLink.type = "text/css";
            gfLink.rel = "stylesheet";
            let gfLinkHref = "https://fonts.googleapis.com/css?family=" + sender.value;
            gfLink.href = gfLinkHref;
            prevLink = document.head.appendChild(gfLink);

            sampleText.style.fontFamily = sender.value;
        }

        // Clause for fontsize input change
        if(sender.id == "SizeSelect") {
            // Activate select input if it hasn't already been activated
            chrome.storage.sync.get(["size"], (result) => {
                if(!result.size) {
                    sender.style.opacity = "100%";
                }
            })
            
            // Set font-size value in storage
            chrome.storage.sync.set({"size": sender.value});

            sampleText.style.fontSize = sender.value + "px";
        }

        return false;
    })
})