// Handle form submission
document.getElementById("donation-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Collect form data
    const charityName = document.getElementById("charity-name").value.trim();
    const donationAmount = parseFloat(document.getElementById("donation-amount").value);
    const donationDate = document.getElementById("donation-date").value;
    const donorMessage = document.getElementById("donor-message").value.trim();

    // Validate inputs
    if (!charityName || !donationAmount || !donationDate || donationAmount <= 0 || isNaN(donationAmount)) {
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

    console.log("Donation Data:", donationData);
    alert("Donation submitted successfully!");
    document.getElementById("donation-form").reset();
});
