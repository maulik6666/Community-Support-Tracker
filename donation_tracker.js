// Handle form submission
function setupEventListeners() {
    const donationForm = document.getElementById("donation-form");
    if (donationForm) {
        donationForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Collect form data
            const charityName = document.getElementById("charity-name").value.trim();
            const donationAmount = parseFloat(document.getElementById("donation-amount").value);
            const donationDate = document.getElementById("donation-date").value;
            const donorMessage = document.getElementById("donor-message").value.trim();

            // Validate inputs
            if (!charityName || isNaN(donationAmount) || donationAmount <= 0 || !donationDate) {
                alert("Please fill out all required fields correctly.");
                return;
            }

            // Temporary data object
            const donationData = {
                charityName,
                donationAmount,
                donationDate,
                donorMessage,
            };

            saveDonation(donationData);
            renderTable();
            donationForm.reset();
        });
    }
}

// Save donation to localStorage
function saveDonation(donation) {
    const donations = JSON.parse(localStorage.getItem("donations")) || [];
    donations.push(donation);
    localStorage.setItem("donations", JSON.stringify(donations));
}

// Render donations table
function renderTable() {
    const donations = JSON.parse(localStorage.getItem("donations")) || [];
    const tableBody = document.getElementById("donations-table").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    donations.forEach((donation, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${donation.charityName}</td>
            <td>$${donation.donationAmount.toFixed(2)}</td>
            <td>${donation.donationDate}</td>
            <td>${donation.donorMessage}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });

    calculateSummary();
    attachDeleteHandlers();
}

// Calculate and display total donation amount
function calculateSummary() {
    const donations = JSON.parse(localStorage.getItem("donations")) || [];
    const total = donations.reduce((sum, donation) => sum + donation.donationAmount, 0);
    document.getElementById("total-donation").textContent = total.toFixed(2);
}

// Attach delete handlers
function attachDeleteHandlers() {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"), 10);
            deleteDonation(index);
        });
    });
}

// Delete donation
function deleteDonation(index) {
    const donations = JSON.parse(localStorage.getItem("donations")) || [];
    donations.splice(index, 1); // Remove donation by index
    localStorage.setItem("donations", JSON.stringify(donations));
    renderTable();
}

// Initial render and event listener setup on page load
document.addEventListener("DOMContentLoaded", () => {
    renderTable();
    setupEventListeners();
});

// Export functions for testing
module.exports = { renderTable, calculateSummary, deleteDonation, saveDonation, setupEventListeners };