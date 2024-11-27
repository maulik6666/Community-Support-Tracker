// Handle form submission
document.getElementById("event-signup-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission behavior

    // Collect form data
    const eventName = document.getElementById("event-name").value.trim();
    const representativeName = document.getElementById("representative-name").value.trim();
    const representativeEmail = document.getElementById("representative-email").value.trim();
    const role = document.getElementById("role").value;

    // Validate form inputs
    if (!eventName || !representativeName || !representativeEmail || !role) {
        alert("All fields are required. Please fill out all fields.");
        return;
    }

    if (!validateEmail(representativeEmail)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Temporary data object
    const signupData = {
        eventName,
        representativeName,
        representativeEmail,
        role,
    };

    console.log("Signup Data:", signupData);
    alert("Event signup submitted successfully!");
    document.getElementById("event-signup-form").reset();
});

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}