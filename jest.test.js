// jest.test.js

// Mocking the alert and console functions
const mockAlert = jest.fn();
global.alert = mockAlert;
const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

document.body.innerHTML = `
    <form id="volunteer-form">
        <input type="text" id="charity-name" name="charityName" required />
        <input type="number" id="hours-volunteered" name="hoursVolunteered" required />
        <input type="date" id="date" name="date" required />
        <input type="number" id="experience-rating" name="experienceRating" required />
        <button type="submit">Submit</button>
    </form>
`;

// Import the submitForm function from script.js
const { submitForm } = require("./script");

describe("Volunteer Hours Tracker Form", () => {
    test("should flag empty required fields", () => {
        // Fill in the fields
        document.getElementById("charity-name").value = "";
        document.getElementById("hours-volunteered").value = "5";
        document.getElementById("date").value = "2024-11-28";
        document.getElementById("experience-rating").value = "3";

        // Simulate form submission
        document.getElementById("volunteer-form").dispatchEvent(new Event("submit"));

        // Check if alert was called with the correct message
        expect(mockAlert).toHaveBeenCalledWith("Please provide valid input for all fields.");
    });

    test("should validate hours volunteered", () => {
        document.getElementById("charity-name").value = "Charity A";
        document.getElementById("hours-volunteered").value = "-5"; // Invalid value
        document.getElementById("date").value = "2024-11-28";
        document.getElementById("experience-rating").value = "3";

        document.getElementById("volunteer-form").dispatchEvent(new Event("submit"));

        expect(mockAlert).toHaveBeenCalledWith("Please provide valid input for all fields.");
    });

    test("should validate experience rating", () => {
        document.getElementById("charity-name").value = "Charity A";
        document.getElementById("hours-volunteered").value = "5";
        document.getElementById("date").value = "2024-11-28";
        document.getElementById("experience-rating").value = "6"; // Invalid value

        document.getElementById("volunteer-form").dispatchEvent(new Event("submit"));

        expect(mockAlert).toHaveBeenCalledWith("Please provide valid input for all fields.");
    });

    test("should populate data object correctly", () => {
        // Reset the alert mock
        mockAlert.mockClear();

        document.getElementById("charity-name").value = "Charity A";
        document.getElementById("hours-volunteered").value = "5";
        document.getElementById("date").value = "2024-11-28";
        document.getElementById("experience-rating").value = "4";

        document.getElementById("volunteer-form").dispatchEvent(new Event("submit"));

        expect(consoleSpy).toHaveBeenCalledWith("Form Submitted:", {
            charityName: "Charity A",
            hoursVolunteered: 5,
            date: "2024-11-28",
            experienceRating: 4,
        });
    });
});
