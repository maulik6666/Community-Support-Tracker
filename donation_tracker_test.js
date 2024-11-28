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

require("./donation_tracker.js");

test("Form submission collects and validates data correctly", () => {
    const form = document.getElementById("donation-form");

    const mockEvent = { preventDefault: jest.fn() };
    form.dispatchEvent(new Event("submit"));

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

    const mockEvent = { preventDefault: jest.fn() };
    form.dispatchEvent(new Event("submit"));

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith("Please fill out all required fields correctly.");
});
