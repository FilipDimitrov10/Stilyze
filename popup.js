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

// Google fonts array
const gFonts = ["Tangerine", "Cantarell", "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Archivo Narrow"];

// Add an option for each google font and add it to the font select input
gFonts.forEach((font) => {
    let fontOption = document.createElement("option");
    fontOption.textContent = font;
    fontOption.value = font;

    inputs[5].appendChild(fontOption);
})

// Get all stored values from storage
chrome.storage.sync.get(["bold", "italic", "underline", "color", "underlinecolor", "font", "size"], (result) => {
    // Check whether values are null (check if user has saved input field values)
    if(result.bold != null) {
        // Verify if bold input was checked
        if(result.bold) {
            // Set italic input value to storage value
            inputs[0].click();
            inputs[0].checked = "true";
        }
        // Verify if italic input was checked
        if(result.italic) {
            // Set italic input value to storage value
            inputs[1].click();
            inputs[1].checked = "true";
        }
        // Verify if underline input was checked
        if(result.underline) {
            // Set underline input value to storage value
            inputs[2].click();
            inputs[2].checked = "true";

            // Set underline-color input value to storage value
            inputs[4].style.display = "block";
            inputs[4].value = result.underlinecolor
        }

        // Set color input value to storage value
        inputs[3].value = result.color;
        // Set font input value to storage value
        inputs[5].value = result.font;
        // Set size input value to storage value
        inputs[6].value = result.size;

        // Update sample text appearance
        sampleText.style.color = result.color;
        sampleText.style.textDecorationColor = result.underlinecolor;
        sampleText.style.fontFamily = result.font;
        sampleText.style.fontSize = result.size + "px";

        Save.click();
        Save.checked = "true";
    }
    else {
        return;
    }
})

// Form submission event
form.addEventListener("submit", (e) => {   
    e.preventDefault();
    
    // Submission fields object
    var Submission = {
        "bold": inputs[0].checked,
        "italic": inputs[1].checked,
        "underline": inputs[2].checked,
        "color": inputs[3].value,
        "underlinecolor": inputs[4].value,
        "font": inputs[5].value,
        "size": inputs[6].value,
    };

    // Send submitted values to content script
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, Submission, (response) => {
                console.log(response);
        })
    });

    return false;
})

// Cycle through each input element
inputs.forEach((element) => {
    // Track and apply input changes to the sample text for each input element
    element.addEventListener("change", (e) => {
        e.preventDefault();

        const sender = e.target;

        // Clause for bold-checkbox input change
        if(sender.id == "bold") {
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

        if(sender.id == "FontSelect") {
            
            // Remove previous font link, if it exists
            if(prevLink) {
                prevLink.remove();
            }
            
            // Create and add link element to pull the submitted font
            let gfLink = document.createElement("link");
            gfLink.type = "text/css";
            gfLink.rel = "stylesheet";
            let gfLinkHref = "https://fonts.googleapis.com/css?family=" + sender.value;
            gfLink.href = gfLinkHref;
            prevLink = document.head.appendChild(gfLink);
        }

        // Clause for fontsize input change
        if(sender.id == "SizeSelect") {
            sampleText.style.fontSize = sender.value + "px";
        }

        // Apply to the sample text the rest of the input changes
        sampleText.style[sender.dataset.input] = sender.value;

        // Clause for save field
        if(sender.id == "save") {
            // Check if input fields are saved
            if(sender.checked) {
                // Add input field values to storage
                chrome.storage.sync.set({"bold": inputs[0].checked, "italic": inputs[1].checked, "underline": inputs[2].checked, "color": inputs[3].value, "underlinecolor": inputs[4].value, "font": inputs[5].value, "size": inputs[6].value, "saved": sender.checked}, () => {
                    console.log("Value fields saved!");
                })
                
                // Alert background script of change in value of saved-state
                chrome.runtime.sendMessage({saved: true});
            }
            else {
                // Clear input field values from storage
                chrome.storage.sync.clear();

                // Alert background script of change in value of saved-state
                chrome.runtime.sendMessage({saved: false});
            }
        }
        else {
            // Uncheck the save checkbox
            Save.checked = "false"
            Save.click()
            chrome.storage.sync.clear();
        }

        return false;
    })
})