window.onload = function() {
    fetchAssignedVehicles();
    populateRouteDropdown();
    
    document.getElementById('routeDropdown').addEventListener('change', fetchDriversByRoute);
    document.getElementById('fetchMaxClientsButton').addEventListener('click', getScannerWithMaxClients);
};

async function fetchAssignedVehicles() {
    const tableElement = document.getElementById('empvehtable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/employees-vehicles', {
        method: 'GET'
    });

    const responseData = await response.json();
    const empVehTableContent = responseData.data;
    console.log(empVehTableContent);

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    empVehTableContent.forEach(employee => {
        const row = tableBody.insertRow();
        console.log(row);
        employee.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function populateRouteDropdown() {
    const dropdown = document.getElementById('routeDropdown');
    const response = await fetch('/routes', {
        method: 'GET'
    });
    
    const responseData = await response.json();
    const routes = responseData.data;
    
    dropdown.innerHTML = '<option value = "">Select a route</option>';

    routes.forEach(route => {
        const option = document.createElement('option');
        option.value = route[0];
        option.textContent = route[0];
        dropdown.appendChild(option);
    })
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

async function fetchDriversByRoute() {
    const dropdown = document.getElementById('routeDropdown');
    const routeId = dropdown.value;

    if (!routeId) {
        alert('Please select a valid route');
        return;
    }

    const response = await fetch('drivers-routes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ routeNum: routeId })
    });

    const responseData = await response.json();
    const data = responseData.data;

    const tableElement = document.getElementById('driversResultTable');
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    data.forEach(driver => {
        const row = tableBody.insertRow();
        driver.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    })


    // const resultsContainer = document.getElementById('driversResult');
    // resultsContainer.innerHTML = '';

    // const list = document.createElement('ul');
    // data.forEach(driver => {
    //     const listItem= document.createElement('li');
    //     listItem.textContent = `${driver[0]]} (${driver[1]})`;
    //     list.appendChild(listItem);
    // });
    // resultsContainer.appendChild(list);
}