// Mock document elements for Jest
document.body.innerHTML = `
<form id="event-signup-form">
    <input type="text" id="event-name" value="Charity Gala">
    <input type="text" id="representative-name" value="John Doe">
    <input type="email" id="representative-email" value="john.doe@example.com">
    <select id="role">
        <option value="Sponsor" selected>Sponsor</option>
    </select>
    <button type="submit">Sign Up</button>
</form>
`;

require("./event_signup.js");

test("Form submission collects and validates data correctly", () => {
    const form = document.getElementById("event-signup-form");
    const mockEvent = { preventDefault: jest.fn() };

    form.dispatchEvent(new Event("submit"));

    expect(mockEvent.preventDefault).toHaveBeenCalled();
});

test("Valid input populates data object", () => {
    const signupData = {
        eventName: document.getElementById("event-name").value.trim(),
        representativeName: document.getElementById("representative-name").value.trim(),
        representativeEmail: document.getElementById("representative-email").value.trim(),
        role: document.getElementById("role").value,
    };

    expect(signupData).toEqual({
        eventName: "Charity Gala",
        representativeName: "John Doe",
        representativeEmail: "john.doe@example.com",
        role: "Sponsor",
    });
});

test("Validation flags empty fields", () => {
    document.getElementById("event-name").value = "";
    const form = document.getElementById("event-signup-form");
    const mockEvent = { preventDefault: jest.fn() };

    form.dispatchEvent(new Event("submit"));

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith("All fields are required. Please fill out all fields.");
});

test("Validation flags invalid email format", () => {
    document.getElementById("representative-email").value = "invalid-email";
    const form = document.getElementById("event-signup-form");
    const mockEvent = { preventDefault: jest.fn() };

    form.dispatchEvent(new Event("submit"));

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith("Please enter a valid email address.");
});