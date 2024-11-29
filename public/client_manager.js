
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
    populateDOB();
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
    const id = document.getElementById("selectCompass_Id_view").value;
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
    const selectelm1 = document.getElementById("selectCompass_Id_rem");
    const selectelm2 = document.getElementById("selectCompass_Id_view");
    selectelm1.innerHTML = "";
    selectelm2.innerHTML = "";



    for (let c of clients) {
        const option1 = document.createElement('option');
        option1.value = c;
        option1.textContent = c;
        selectelm1.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = c;
        option2.textContent = c;
        selectelm2.appendChild(option2);
    }
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
    const messageElement = document.getElementById('insertResultMsg');
    const idValue = document.getElementById('insertCompass_Id').value;
    let dobValue = document.getElementById('insertDOB').value;

    if(dobValue > 2024 || dobValue < 1930){
        messageElement.textContent = "DOB value invalid";
        return;
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
    

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
    } else {
        messageElement.textContent = "Error inserting data!";
    }

    fetchAndDisplayClients();
}

async function removeClient(){
    const id = document.getElementById("selectCompass_Id_rem").value;
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
    const messageElement = document.getElementById('removeResultMsg');
    console.log(responseData.data);

    if (responseData.data) {
        messageElement.textContent = "Data removed successfully!";
        fetchAndDisplayClients();
    } else {
        messageElement.textContent = "Error removing data!";
        fetchAndDisplayClients();
    }

}

async function getScannerWithMaxClients() {
    const tableElement = document.getElementById('maxClientsTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/max-clients', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(scan => {
        const row = tableBody.insertRow();
        scan.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        })
    })
}


function redirectHome(){
    window.location.href = "./index.html";
}

window.onload = function() {
    fetchAndDisplayClients();
    document.getElementById("ViewFaresBtn").addEventListener("click", fetchAndDisplayFares);
    document.getElementById("DeleteClientBtn").addEventListener("click",removeClient);
    document.getElementById("insertClientTable").addEventListener("submit", insertClient);
    document.getElementById("everyScannerTableBtn").addEventListener("click", fetchAndDisplayEveryScanner);
    document.getElementById("paymentTableBtn").addEventListener("click", fetchAndDisplayPayments);
    document.getElementById('fetchMaxClientsButton').addEventListener('click', getScannerWithMaxClients);
};

