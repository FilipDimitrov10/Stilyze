console.log("Hello Stilyze!");

const sampleText = document.querySelector(".sample");

// Submission fields object
var Submission = {
    "bold": "",
    "italic": "",
    "underline": "",
    "textback": "",
    "font": "",
    "size": "",
    "textcolor": ""
};

// Populate submission fields 
function onSubmission(e) {
    e.preventDefault();
    
    console.log("Form Submited!");
    
    Submission.bold = document.querySelector("#bold").value;
    Submission.italic = document.querySelector("#italic").value;
    Submission.underline = document.querySelector("#underline").value;
    Submission.textback = document.querySelector("#textbackground").value;
    Submission.font = document.querySelector("#FontSelect").value;
    Submission.size = document.querySelector("#SizeSelect").value;
    Submission.textcolor = document.querySelector("#textcolor").value;

    console.log(Submission);

    return false;
}

// Declare counters for checkbox switching
var boldCounter = 2;
var italicCounter = 2;

// Track and apply input changes to the sample text
function onChangeEvent(e) {
    e.preventDefault();

    const sender = e.target;
    
    // Clause for bold-checkbox input change
    if(sender.id == "bold") {
        // Check if checkbox is on or off
        if(boldCounter % 2 == 0) {
            sampleText.style.fontWeight = "bold";
        }
        else {
            sampleText.style.fontWeight = "normal";
        }

        // Update counter (change state)
        boldCounter++;
    }
    // Clause for italic-checkbox input change
    if(sender.id == "italic") {
        //Check if checkbox is on or off
        if(italicCounter % 2 == 0) {
            sampleText.style.fontStyle = "italic";
        }
        else {
            sampleText.style.fontStyle = "normal";
        }

        // Update counter (change state)
        italicCounter++;
    }
    // Clause for fontsize input change
    if(sender.id == "SizeSelect") {
        sampleText.style.fontSize = sender.value + "px";
    }

    // Apply to the sample text the rest of the input changes
    sampleText.style[sender.name] = sender.value;

    return false;
}