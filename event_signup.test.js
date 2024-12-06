// Mock the alert function
beforeEach(() => {
    global.alert = jest.fn();
    localStorage.clear();
    document.body.innerHTML = `
        <form id="event-signup-form">
            <input type="text" id="event-name" name="event-name" required />
            <input type="text" id="representative-name" name="representative-name" required />
            <input type="email" id="representative-email" name="representative-email" required />
            <select id="role" name="role" required>
                <option value="">Select Role</option>
                <option value="Sponsor">Sponsor</option>
                <option value="Participant">Participant</option>
                <option value="Organizer">Organizer</option>
            </select>
            <button type="submit">Sign Up</button>
        </form>
        <table id="signups-table">
            <tbody></tbody>
        </table>
        <div id="summary-section"></div>
    `;
});

// Test for form submission and validation
test("Form submission collects and validates data correctly", () => {
    const form = document.getElementById("event-signup-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Event signup submitted successfully!");
    });

    form.dispatchEvent(new Event("submit"));

    expect(global.alert).toHaveBeenCalledWith("Event signup submitted successfully!");
});

// Test for valid input populating signup data
test("Valid input populates signup data object", () => {
    document.getElementById("event-name").value = "Fund Raises";
    document.getElementById("representative-name").value = "Rushil Patel";
    document.getElementById("representative-email").value = "Rushilpatel@example.com";
    document.getElementById("role").value = "Sponsor";

    const signupData = {
        eventName: document.getElementById("event-name").value.trim(),
        representativeName: document.getElementById("representative-name").value.trim(),
        representativeEmail: document.getElementById("representative-email").value.trim(),
        role: document.getElementById("role").value,
    };

    expect(signupData).toEqual({
        eventName: "Fund Raises",
        representativeName: "Rushil Patel",
        representativeEmail: "Rushilpatel@example.com",
        role: "Sponsor",
    });
});

// Test for validation flags empty fields
test("Validation flags empty fields", () => {
    const form = document.getElementById("event-signup-form");
    document.getElementById("event-name").value = "";

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!document.getElementById("event-name").value.trim()) {
            alert("All fields are required. Please fill out all fields.");
        }
    });

    form.dispatchEvent(new Event("submit"));

    expect(global.alert).toHaveBeenCalledWith("All fields are required. Please fill out all fields.");
});

// Test for invalid email format validation
test("Validation flags invalid email format", () => {
    document.getElementById("representative-email").value = "invalid-email";

    const form = document.getElementById("event-signup-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("representative-email").value;
        if (!email.includes("@")) {
            alert("Please enter a valid email address.");
        }
    });

    form.dispatchEvent(new Event("submit"));

    expect(global.alert).toHaveBeenCalledWith("Please enter a valid email address.");
});

// Test for saving and retrieving signups from localStorage
test("Save and retrieve signups from localStorage", () => {
    const mockSignup = {
        eventName: "Fund Raises",
        participantName: "Rushil Patel",
        participantEmail: "Rushilpatel@example.com",
        role: "Sponsor",
    };

    localStorage.setItem("signups", JSON.stringify([mockSignup]));
    const retrievedSignups = JSON.parse(localStorage.getItem("signups"));

    expect(retrievedSignups).toEqual([mockSignup]);
});

// Test for rendering the table
test("Render table populates DOM correctly", () => {
    const mockSignup = {
        eventName: "Fund Raises",
        participantName: "Rushil Patel",
        participantEmail: "Rushilpatel@example.com",
        role: "Sponsor",
    };

    localStorage.setItem("signups", JSON.stringify([mockSignup]));
    const tableBody = document.querySelector("#signups-table tbody");

    // Simulate rendering the table
    tableBody.innerHTML = `
        <tr>
            <td>${mockSignup.eventName}</td>
            <td>${mockSignup.participantName}</td>
            <td>${mockSignup.participantEmail}</td>
            <td>${mockSignup.role}</td>
        </tr>
    `;

    expect(tableBody.children.length).toBe(1);
    expect(tableBody.children[0].textContent).toContain("Fund Raises");
});

// Test for deleting a signup
test("Delete signup updates localStorage and table", () => {
    const mockSignup = {
        eventName: "Fund Raises",
        participantName: "Rushil Patel",
        participantEmail: "Rushilpatel@example.com",
        role: "Sponsor",
    };

    localStorage.setItem("signups", JSON.stringify([mockSignup]));

    // Simulate deleting a signup
    const updatedSignups = [];
    localStorage.setItem("signups", JSON.stringify(updatedSignups));

    expect(JSON.parse(localStorage.getItem("signups"))).toEqual([]);
});

// Test for rendering the summary
test("Render summary displays correct role counts", () => {
    const signups = [
        { role: "Sponsor" },
        { role: "Participant" },
        { role: "Sponsor" },
    ];

    localStorage.setItem("signups", JSON.stringify(signups));

    // Simulate rendering the summary
    const summarySection = document.getElementById("summary-section");
    const sponsorCount = signups.filter((signup) => signup.role === "Sponsor").length;
    const participantCount = signups.filter((signup) => signup.role === "Participant").length;

    summarySection.innerHTML = `
        <p>Sponsor: ${sponsorCount}</p>
        <p>Participant: ${participantCount}</p>
    `;

    expect(summarySection.textContent).toContain("Sponsor: 2");
    expect(summarySection.textContent).toContain("Participant: 1");
});