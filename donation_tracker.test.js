const { renderTable, calculateSummary, deleteDonation, saveDonation, setupEventListeners } = require("./donation_tracker.js");

// Mock DOM
document.body.innerHTML = `
    <form id="donation-form">
        <input type="text" id="charity-name">
        <input type="number" id="donation-amount">
        <input type="date" id="donation-date">
        <textarea id="donor-message"></textarea>
        <button type="submit">Submit</button>
    </form>
    <table id="donations-table">
        <tbody></tbody>
    </table>
    <span id="total-donation">0</span>
`;

// Set up event listeners in the test environment
beforeEach(() => {
    setupEventListeners();
});

test("Save and retrieve donations from localStorage", () => {
    const mockDonation = {
        charityName: "Charity A",
        donationAmount: 100,
        donationDate: "2024-11-24",
        donorMessage: "Great work!",
    };

    saveDonation(mockDonation);
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

test("Render table populates DOM correctly", () => {
    const mockDonation = {
        charityName: "Charity A",
        donationAmount: 100,
        donationDate: "2024-11-24",
        donorMessage: "Great work!",
    };

    localStorage.setItem("donations", JSON.stringify([mockDonation]));
    renderTable();

    const tableBody = document.getElementById("donations-table").querySelector("tbody");
    expect(tableBody.children.length).toBe(1);
    expect(tableBody.children[0].textContent).toContain("Charity A");
});
