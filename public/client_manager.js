
//fetch client data and display



async function fetchAndDisplayClients() {
    const tableElement = document.getElementById('clientTable');
    const tableBody = tableElement.querySelector('tbody');

    console.log("requesting client table");

    const response = await fetch('/clientTable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    let clients = [];

    tableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;

            if(index === 0){
                clients.push(field);
            }
        });
    });

    console.log("clients" + clients);

    updateUserSelect(clients);
}

async function fetchAndDisplayPayments() {
    const tableElement = document.getElementById('paymentTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/paymentTable', {
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

async function fetchAndDisplayEveryScanner() {
    const tableElement = document.getElementById('everyScannerTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/everyScannerTable', {
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


async function fetchAndDisplayFares() {
    const tableElement = document.getElementById('fareTable');
    const tableBody = tableElement.querySelector('tbody');
    const headerRow = document.getElementById('headerRow');

    
    const dropdown = document.getElementById("projections");
    const selectedOptions = Array.from(dropdown.selectedOptions).map(option => option.value);
    if(selectedOptions.length === 0){
        return;
    }
    const id = document.getElementById("selectCompass_Id").value;
    if(id === ""){
        return;
    }

    const proj = selectedOptions.join(", ");
    console.log("compassid:" + id);
    console.log("selectvals" + proj);


    const response = await fetch('/fareTable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            compass_id: id,
            selected: proj
        })
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    console.log("repsponsedata"+ responseData);

    // add all cols to thing
    if(headerRow){
        headerRow.innerHTML = '';
    }

    selectedOptions.forEach(opt => {
        let result = opt.includes('.') ? opt.split('.')[1] : opt;
        const newHeader = document.createElement('th');
        newHeader.textContent = result;
        headerRow.appendChild(newHeader); 
    });


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


function updateUserSelect(clients) {
    const selectelm = document.getElementById("selectCompass_Id");
    selectelm.innerHTML = "";

    console.log("clients in user select" + clients);

    for(let c of clients){
        console.log(c);
        const option = document.createElement('option');
        option.value = c;
        option.textContent = c;
        selectelm.appendChild(option);
    };
}

function populateDOB() {
    const selectelm = document.getElementById("insertDOB");
    selectelm.innerHTML = "";

    for(let year = 1930; year <= 2024; year ++){
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        selectelm.appendChild(option);
    }

}


async function insertClient(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertCompass_Id').value;
    let dobValue = document.getElementById('insertDOB').value;

    if(dobValue > 2024 || dobValue < 1930){
        alert('Invalid DOB');
    }
    dobValue = dobValue.toString();

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
        fetchAndDisplayClients();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

async function removeClient(){
    const id = document.getElementById("selectCompass_Id").value;
    if(id === ""){
        return;
    }

    const response = await fetch('/removeClient', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            compass_id: id,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchAndDisplayClients();
    } else {
        messageElement.textContent = "Error inserting data!";
    }

}

window.onload = function() {
    fetchAndDisplayClients();
    document.getElementById("ViewFaresBtn").addEventListener("click", fetchAndDisplayFares);
    document.getElementById("DeleteClientBtn").addEventListener("click",removeClient);
    document.getElementById("insertClientTable").addEventListener("submit", insertClient);
    document.getElementById("everyScannerTableBtn").addEventListener("click", fetchAndDisplayEveryScanner);
    document.getElementById("paymentTableBtn").addEventListener("click", fetchAndDisplayPayments);
};
