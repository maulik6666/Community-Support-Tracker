// In your script.js file
document.getElementById("volunteer-form").addEventListener("submit", submitForm);

function submitForm(event) {
    event.preventDefault();

    // Get the form field values
    const charityName = document.getElementById("charity-name").value;
    const hoursVolunteered = parseFloat(document.getElementById("hours-volunteered").value); 
    const date = document.getElementById("date").value;
    const experienceRating = parseInt(document.getElementById("experience-rating").value, 10); 

    // Check for empty required fields
    if (!charityName || !hoursVolunteered || !date || !experienceRating) {
        alert("Please provide valid input for all fields.");
        return;
    }

    // Additional validation for hours and experience rating
    if (hoursVolunteered <= 0 || experienceRating < 1 || experienceRating > 5) {
        alert("Please provide valid input for all fields.");
        return;
    }

    // Process the form data
    console.log("Form Submitted:", { charityName, hoursVolunteered, date, experienceRating });
}

