document.getElementById("volunteer-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const charityName = document.getElementById("charity-name").value.trim();
    const hoursVolunteered = parseFloat(document.getElementById("hours-volunteered").value);
    const volunteerDate = document.getElementById("volunteer-date").value;
    const experienceRating = parseInt(document.getElementById("experience-rating").value);

    if (!charityName || !hoursVolunteered || !volunteerDate || isNaN(hoursVolunteered) || hoursVolunteered <= 0) {
        alert("Please fill out all required fields correctly.");
        return;
    }

    if (experienceRating < 1 || experienceRating > 5 || isNaN(experienceRating)) {
        alert("Please provide a valid experience rating between 1 and 5.");
        return;
    }

    const volunteerData = { charityName, hoursVolunteered, volunteerDate, experienceRating };
    storeVolunteerData(volunteerData);
    displayVolunteerData();
    updateTotalHours();

    document.getElementById("volunteer-form").reset();
});

// Store volunteer data in localStorage
function storeVolunteerData(volunteerData) {
    let volunteerDataArray = JSON.parse(localStorage.getItem("volunteerData")) || [];
    volunteerDataArray.push(volunteerData);
    localStorage.setItem("volunteerData", JSON.stringify(volunteerDataArray));
}

// Display volunteer data from localStorage
function displayVolunteerData() {
    const volunteerDataArray = JSON.parse(localStorage.getItem("volunteerData")) || [];
    const tableBody = document.getElementById("volunteer-table").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear the existing table

    volunteerDataArray.forEach((data, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.charityName}</td>
            <td>${data.hoursVolunteered}</td>
            <td>${data.volunteerDate}</td>
            <td>${data.experienceRating}</td>
            <td><button onclick="deleteVolunteerData(${index})">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Delete a volunteer data record
function deleteVolunteerData(index) {
    let volunteerData = JSON.parse(localStorage.getItem("volunteerData"));

    if (volunteerData && volunteerData.length > 0) {
        // Remove the specific record based on the index
        volunteerData.splice(index, 1);

        // Update localStorage with the new array
        localStorage.setItem("volunteerData", JSON.stringify(volunteerData));

        // Re-display the updated table and update total hours
        displayVolunteerData();
        updateTotalHours();
    }
}

// Update total hours in the summary section
function updateTotalHours() {
    const volunteerDataArray = JSON.parse(localStorage.getItem("volunteerData")) || [];
    const totalHours = volunteerDataArray.reduce((total, data) => total + data.hoursVolunteered, 0);
    document.getElementById("total-hours").textContent = totalHours;
}

// Load volunteer data when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
    displayVolunteerData();
    updateTotalHours();
});
