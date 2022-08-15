console.log("Hello Stilyze!");

const sampleText = document.querySelector(".sample");

// Select all inputs in form
const inputs = document.querySelectorAll("[data-input]");
const underlineColor = document.querySelector("div.col-8");

// Submission fields object
var Submission = {
    "bold": "",
    "italic": "",
    "underline": "",
    "color": "",
    "font": "",
    "size": "",
    "backgroundcolor": ""
};

// Populate submission fields 
function onSubmission(e) {
    e.preventDefault();
    
    console.log("Form Submited!");
    
    Submission.bold = document.querySelector("#bold").value;
    Submission.italic = document.querySelector("#italic").value;
    Submission.underline = document.querySelector("#underline").value;
    Submission.color = document.querySelector("#color").value;
    Submission.font = document.querySelector("#FontSelect").value;
    Submission.size = document.querySelector("#SizeSelect").value;
    Submission.backgroundcolor = document.querySelector("#backgroundcolor").value;

    console.log(Submission);

    return false;
}

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