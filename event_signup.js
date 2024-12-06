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
 
    // Save signup to localStorage
    saveSignup(signupData);
 
    // Render the table with updated signups
    renderTable();
 
    // Clear the form
    document.getElementById("event-signup-form").reset();
 
    alert("Event signup submitted successfully!");
});
 
// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
 
// Save signup to localStorage
function saveSignup(signup) {
    const signups = JSON.parse(localStorage.getItem("signups")) || [];
    signups.push(signup);
    localStorage.setItem("signups", JSON.stringify(signups));
}
 
// Render the table with all signups
function renderTable() {
    const signups = JSON.parse(localStorage.getItem("signups")) || [];
    const tableBody = document.getElementById("signups-table").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows
 
    signups.forEach((signup, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
<td>${signup.eventName}</td>
<td>${signup.representativeName}</td>
<td>${signup.representativeEmail}</td>
<td>${signup.role}</td>
<td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
 
    renderSummary();
    attachDeleteHandlers();
}
 
// Render summary of signups by role
function renderSummary() {
    const signups = JSON.parse(localStorage.getItem("signups")) || [];
    const summary = {};
 
    signups.forEach((signup) => {
        summary[signup.role] = (summary[signup.role] || 0) + 1;
    });
 
    const summarySection = document.getElementById("summary-section");
    summarySection.innerHTML = Object.entries(summary)
        .map(([role, count]) => `<p>${role}: ${count} signups</p>`)
        .join("");
}
 
// Attach delete button handlers
function attachDeleteHandlers() {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"), 10);
            deleteSignup(index);
        });
    });
}
 
// Delete signup from localStorage and update the table
function deleteSignup(index) {
    const signups = JSON.parse(localStorage.getItem("signups")) || [];
    signups.splice(index, 1); // Remove signup by index
    localStorage.setItem("signups", JSON.stringify(signups));
    renderTable();
}
 
// Initialize table and event listeners on page load
document.addEventListener("DOMContentLoaded", () => {
    renderTable();
});
 
// Export functions to be used in tests (CommonJS)
module.exports = {
    saveSignup,
    renderTable,
    deleteSignup,
    renderSummary,
};