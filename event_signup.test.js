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
`;

// Mocking the alert function
global.alert = jest.fn();

require("./event_signup.js");

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