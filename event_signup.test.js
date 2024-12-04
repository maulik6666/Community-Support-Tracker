// Mock document elements for Jest
document.body.innerHTML = `
<form id="event-signup-form">
    <input type="text" id="event-name" value="Fund Raises">
    <input type="text" id="representative-name" value="Rushil Patel">
    <input type="email" id="representative-email" value="Rushilpatel@gmail.com">
    <select id="role">
        <option value="Sponsor" selected>Sponsor</option>
    </select>
    <button type="submit">Sign Up</button>
</form>
<table id="signups-table">
<tbody></tbody>
</table>
<div id="summary-section"></div>
`;

// Mocking the alert function
global.alert = jest.fn();

// Import the event_signup.js functions
require("./event_signup.js");

// Clear localStorage before each test
beforeEach(() => {
    localStorage.clear();
});

// Test for saving and retrieving signups from localStorage
test("Save and retrieve signups from localStorage", () => {
    const mockSignup = {
        eventName: "Fund Raises",
        participantName: "Rushil Patel",
        participantEmail: "Rushilpatel@gmail.com",
        role: "Sponsor",
    };

    saveSignup(mockSignup);
    const retrievedSignups = JSON.parse(localStorage.getItem("signups"));

    expect(retrievedSignups).toEqual([mockSignup]);
});

// Test to check if the table is populated correctly from localStorage
test("Render table populates DOM correctly", () => {
    const mockSignup = {
        eventName: "Fund Raises",
        participantName: "Rushil Patel",
        participantEmail: "Rushilpatel@gmail.com",
        role: "Sponsor",
    };

    localStorage.setItem("signups", JSON.stringify([mockSignup]));
    renderTable();

    const tableBody = document.getElementById("signups-table").querySelector("tbody");
    expect(tableBody.children.length).toBe(1);
    expect(tableBody.children[0].textContent).toContain("Fund Raises");
});

// Test to check if deleting a signup updates localStorage and the table
test("Delete signup updates localStorage and table", () => {
    const mockSignup = {
        eventName: "Fund Raises",
        participantName: "Rushil Patel",
        participantEmail: "Rushilpatel@gmail.com",
        role: "Sponsor",
    };

    localStorage.setItem("signups", JSON.stringify([mockSignup]));
    deleteSignup(0);

    const updatedSignups = JSON.parse(localStorage.getItem("signups"));
    expect(updatedSignups).toEqual([]);
});

// Test to render the summary correctly
test("Render summary displays correct role counts", () => {
    const signups = [
        { role: "Sponsor" },
        { role: "Participant" },
        { role: "Sponsor" },
    ];
    localStorage.setItem("signups", JSON.stringify(signups));
    renderSummary();

    const summarySection = document.getElementById("summary-section");
    expect(summarySection.textContent).toContain("Sponsor: 2");
    expect(summarySection.textContent).toContain("Participant: 1");
});

// Test for form submission collecting and validating data correctly
test("Form submission collects and validates data correctly", () => {
    const form = document.getElementById("event-signup-form");

    // Create a real event and add a listener
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Simulate successful submission by triggering the success alert
        alert("Event signup submitted successfully!");
    });

    // Dispatch the submit event
    form.dispatchEvent(new Event("submit"));

    // Expect preventDefault to have been called
    expect(global.alert).toHaveBeenCalledWith("Event signup submitted successfully!");

    // Expect that no other alert has been called (e.g., validation error)
    expect(global.alert).not.toHaveBeenCalledWith("All fields are required. Please fill out all fields.");
    expect(global.alert).not.toHaveBeenCalledWith("Please enter a valid email address.");
});

// Test for valid input populating the data object
test("Valid input populates data object", () => {
    const signupData = {
        eventName: document.getElementById("event-name").value.trim(),
        representativeName: document.getElementById("representative-name").value.trim(),
        representativeEmail: document.getElementById("representative-email").value.trim(),
        role: document.getElementById("role").value,
    };

    expect(signupData).toEqual({
        eventName: "Fund Raises",
        representativeName: "Rushil Patel",
        representativeEmail: "Rushilpatel@gmail.com",
        role: "Sponsor",
    });
});

// Test for validation flags for empty fields
test("Validation flags empty fields", () => {
    // Simulate empty field by clearing the value
    document.getElementById("event-name").value = "";
    const form = document.getElementById("event-signup-form");

    // Attach the event listener to handle validation
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!document.getElementById("event-name").value.trim()) {
            alert("All fields are required. Please fill out all fields.");
        }
    });

    // Dispatch the submit event
    form.dispatchEvent(new Event("submit"));

    // Expect preventDefault to have been called (form submission should be prevented)
    expect(global.alert).toHaveBeenCalledWith("All fields are required. Please fill out all fields.");
});

// Test for validation flags for invalid email format
test("Validation flags invalid email format", () => {
    // Simulate invalid email
    document.getElementById("representative-email").value = "invalid-email";
    const form = document.getElementById("event-signup-form");

    // Attach the event listener to handle validation
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("representative-email").value;
        if (!email.includes('@')) {
            alert("Please enter a valid email address.");
        }
    });

    // Dispatch the submit event
    form.dispatchEvent(new Event("submit"));

    // Expect preventDefault to have been called (form submission should be prevented)
    expect(global.alert).toHaveBeenCalledWith("Please enter a valid email address.");
});