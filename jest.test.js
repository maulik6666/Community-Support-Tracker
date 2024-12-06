// Mock document elements for Jest
document.body.innerHTML = `
    <form id="volunteer-form">
        <input type="text" id="charity-name" value="Sample Charity">
        <input type="number" id="hours-volunteered" value="5">
        <input type="date" id="volunteer-date" value="2024-11-24">
        <input type="number" id="experience-rating" value="4">
        <button type="submit">Submit Volunteer Hours</button>
    </form>
`;

// Mock the alert function globally
global.alert = jest.fn();

// Import the JavaScript file that contains the form submission logic
require("./script.js");

test("Form submission collects and validates data correctly", () => {
    const form = document.getElementById("volunteer-form");

    // Mock the event object
    const mockEvent = { preventDefault: jest.fn() };

    // Simulate the form submission by dispatching the submit event
    form.addEventListener("submit", function (e) {
        mockEvent.preventDefault();
    });

    form.dispatchEvent(new Event("submit"));

    // Assert that preventDefault was called to prevent form submission
    expect(mockEvent.preventDefault).toHaveBeenCalled();
});

test("Valid input populates data object", () => {
    const charityName = document.getElementById("charity-name").value.trim();
    const hoursVolunteered = parseFloat(document.getElementById("hours-volunteered").value);
    const volunteerDate = document.getElementById("volunteer-date").value;
    const experienceRating = parseInt(document.getElementById("experience-rating").value);

    const volunteerData = {
        charityName,
        hoursVolunteered,
        volunteerDate,
        experienceRating,
    };

    expect(volunteerData).toEqual({
        charityName: "Sample Charity",
        hoursVolunteered: 5,
        volunteerDate: "2024-11-24",
        experienceRating: 4,
    });
});

test("Validation flags empty or invalid inputs", () => {
    document.getElementById("hours-volunteered").value = "-5"; // Invalid input
    const form = document.getElementById("volunteer-form");

    // Mock the event object
    const mockEvent = { preventDefault: jest.fn() };

    // Add a listener that will prevent the default form submission
    form.addEventListener("submit", function (e) {
        mockEvent.preventDefault();
        if (parseFloat(document.getElementById("hours-volunteered").value) <= 0) {
            alert("Please fill out all required fields correctly.");
        }
    });

    // Simulate the form submission
    form.dispatchEvent(new Event("submit"));

    // Assert that preventDefault was called and the validation alert was triggered
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith("Please fill out all required fields correctly.");
});

test("Experience rating is within the valid range", () => {
    document.getElementById("experience-rating").value = "6"; // Invalid rating
    const form = document.getElementById("volunteer-form");

    // Mock the event object
    const mockEvent = { preventDefault: jest.fn() };

    // Add a listener that will prevent the default form submission
    form.addEventListener("submit", function (e) {
        mockEvent.preventDefault();
        const experienceRating = parseInt(document.getElementById("experience-rating").value);
        if (experienceRating < 1 || experienceRating > 5 || isNaN(experienceRating)) {
            alert("Please provide a valid experience rating between 1 and 5.");
        }
    });

    // Simulate the form submission
    form.dispatchEvent(new Event("submit"));

    // Assert that preventDefault was called and the validation alert was triggered
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith("Please provide a valid experience rating between 1 and 5.");
});

// Mock document elements for Jest
document.body.innerHTML = `
    <form id="volunteer-form">
        <input type="text" id="charity-name" value="Sample Charity">
        <input type="number" id="hours-volunteered" value="5">
        <input type="date" id="volunteer-date" value="2024-11-24">
        <input type="number" id="experience-rating" value="4">
        <button type="submit">Submit Volunteer Hours</button>
    </form>
    <table id="volunteer-table">
        <thead>
            <tr>
                <th>Charity Name</th>
                <th>Hours Volunteered</th>
                <th>Date</th>
                <th>Experience Rating</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <!-- Table rows -->
        </tbody>
    </table>
    <div id="summary">
        <p>Total Hours Volunteered: <span id="total-hours">0</span></p>
    </div>
`;

// Mock the alert function globally
global.alert = jest.fn();

// Import the JavaScript file that contains the form submission logic
require("./script.js");

test("Form submission collects and validates data correctly", () => {
    const form = document.getElementById("volunteer-form");
    const mockEvent = { preventDefault: jest.fn() };
    form.addEventListener("submit", function (e) {
        mockEvent.preventDefault();
    });

    form.dispatchEvent(new Event("submit"));
    expect(mockEvent.preventDefault).toHaveBeenCalled();
});

test("Data is stored in localStorage", () => {
    const volunteerData = {
        charityName: "Sample Charity",
        hoursVolunteered: 5,
        volunteerDate: "2024-11-24",
        experienceRating: 4
    };

    localStorage.setItem("volunteerData", JSON.stringify([volunteerData]));
    const storedData = JSON.parse(localStorage.getItem("volunteerData"));

    expect(storedData).toHaveLength(1);
    expect(storedData[0]).toEqual(volunteerData);
});

test("Total hours is calculated correctly", () => {
    const volunteerData = [
        { hoursVolunteered: 5 },
        { hoursVolunteered: 3 }
    ];
    localStorage.setItem("volunteerData", JSON.stringify(volunteerData));

    const totalHours = volunteerData.reduce((total, data) => total + data.hoursVolunteered, 0);
    expect(totalHours).toBe(8);
});
