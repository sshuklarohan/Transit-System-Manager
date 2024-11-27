
//fetch client data and display
async function fetchAndDisplayClients() {
    const tableElement = document.getElementById('clientTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/clientTable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


async function insertClient(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertCompass_Id').value;
    const dobValue = document.getElementById('insertDOB').value;

    const response = await fetch('/insert-clientTable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            compass_id: idValue,
            dob: dobValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}