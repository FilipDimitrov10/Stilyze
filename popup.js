console.log("Hello Stilyze!");

const sampleText = document.querySelector(".sample");
const form = document.querySelector("form");

// Select all inputs in form
const inputs = document.querySelectorAll("[data-input]");
const underlineColor = document.querySelector("div.col-8");

// Form submission event
form.addEventListener("submit", () => {   

    // Submission fields object
    var Submission = {
        "bold": inputs[0].checked,
        "italic": inputs[1].checked,
        "underline": inputs[2].checked,
        "color": inputs[3].value,
        "underlinecolor": inputs[4].value,
        "font": inputs[5].value,
        "size": inputs[6].value,
        "backgroundcolor": inputs[7].value
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

        // Clause for fontsize input change
        if(sender.id == "SizeSelect") {
            sampleText.style.fontSize = sender.value + "px";
        }

        // Apply to the sample text the rest of the input changes
        sampleText.style[sender.dataset.input] = sender.value;

        return false;
    })
})