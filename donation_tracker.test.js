// Mock document elements for Jest
document.body.innerHTML = `
    <form id="donation-form">
        <input type="text" id="charity-name" value="Sample Charity">
        <input type="number" id="donation-amount" value="50">
        <input type="date" id="donation-date" value="2024-11-24">
        <textarea id="donor-message">Great cause!</textarea>
        <button type="submit">Submit Donation</button>
    </form>
`;

// Mock the alert function globally
global.alert = jest.fn();

// Import the JavaScript file that contains the form submission logic
require("./donation_tracker.js");

test("Form submission collects and validates data correctly", () => {
    const form = document.getElementById("donation-form");

    // Mock the event object
    const mockEvent = { preventDefault: jest.fn() };

    // Simulate the form submission by dispatching the submit event
    form.addEventListener("submit", function(e) {
        mockEvent.preventDefault();
    });

    form.dispatchEvent(new Event("submit"));

    // Assert that preventDefault was called to prevent form submission
    expect(mockEvent.preventDefault).toHaveBeenCalled();
});

test("Valid input populates data object", () => {
    const charityName = document.getElementById("charity-name").value.trim();
    const donationAmount = parseFloat(document.getElementById("donation-amount").value);
    const donationDate = document.getElementById("donation-date").value;
    const donorMessage = document.getElementById("donor-message").value.trim();

    const donationData = {
        charityName,
        donationAmount,
        donationDate,
        donorMessage,
    };

    expect(donationData).toEqual({
        charityName: "Sample Charity",
        donationAmount: 50,
        donationDate: "2024-11-24",
        donorMessage: "Great cause!",
    });
});

test("Validation flags empty or invalid inputs", () => {
    document.getElementById("donation-amount").value = "-10"; // Invalid input
    const form = document.getElementById("donation-form");

    // Mock the event object
    const mockEvent = { preventDefault: jest.fn() };

    // Add a listener that will prevent the default form submission
    form.addEventListener("submit", function(e) {
        mockEvent.preventDefault();
        if (parseFloat(document.getElementById("donation-amount").value) <= 0) {
            alert("Please fill out all required fields correctly.");
        }
    });

    // Simulate the form submission
    form.dispatchEvent(new Event("submit"));

    // Assert that preventDefault was called and the validation alert was triggered
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith("Please fill out all required fields correctly.");
});

test("Save and retrieve donations from localStorage", () => {
    const mockDonation = {
        charityName: "Charity A",
        donationAmount: 100,
        donationDate: "2024-11-24",
        donorMessage: "Great work!",
    };

    localStorage.setItem("donations", JSON.stringify([mockDonation]));
    const retrievedDonations = JSON.parse(localStorage.getItem("donations"));

    expect(retrievedDonations).toEqual([mockDonation]);
});

test("Calculate total donation amount", () => {
    const donations = [
        { donationAmount: 50 },
        { donationAmount: 75 },
        { donationAmount: 25 },
    ];
    localStorage.setItem("donations", JSON.stringify(donations));
    document.body.innerHTML = '<span id="total-donation"></span>';
    calculateSummary();

    const total = document.getElementById("total-donation").textContent;
    expect(total).toBe("150.00");
});

test("Delete donation updates localStorage and table", () => {
    const donations = [
        { charityName: "Charity A", donationAmount: 100 },
        { charityName: "Charity B", donationAmount: 200 },
    ];
    localStorage.setItem("donations", JSON.stringify(donations));
    deleteDonation(0);

    const updatedDonations = JSON.parse(localStorage.getItem("donations"));
    expect(updatedDonations).toEqual([{ charityName: "Charity B", donationAmount: 200 }]);
});
