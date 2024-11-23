async function fetchEmployeesVehicles() {
    const tableElement = document.getElementById('empvehtable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/employees-vehicles', {
        method: 'GET'
    });

    const responseData = await response.json();
    const empVehTableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    empVehTableContent.forEach(employee => {
        const row = tableBody.insertRow();
        employee.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

window.onload = function() {
    fetchEmployeesVehicles();
    document.getElementById("findDriverForm").addEventListener("submit", findDriver);
};