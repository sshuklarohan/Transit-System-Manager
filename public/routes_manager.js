window.onload = function() {
    // checkDbConnection();
    fetchAndDisplayBusRoutes();
    fetchAndDisplayTrainLines();
    fetchRouteNums();
    fetchTrainLines();

    // event listeners
    document.getElementById("queryBusRoutesButton").addEventListener("click", selectQueryBusRoutes);
    document.getElementById("queryTrainLinesButton").addEventListener("click", selectQueryTrainLines);
    // const filterInput = document.getElementById("filterInput");
    // filterInput.addEventListener("input", filterSelectInput);
}

// Fetches data from the BusRoute table and displays it.
async function fetchAndDisplayBusRoutes() {
    const tableElement = document.getElementById('busRouteTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/busRouteTable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(route => {
        const row = tableBody.insertRow();
        console.log("inserted " + row);
        route.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchAndDisplayTrainLines() {
    const tableElement = document.getElementById('trainLineTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/trainLineTable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(route => {
        const row = tableBody.insertRow();
        console.log("inserted " + row);
        route.forEach((field, index) => {
            console.log("field ", field , " index ", index);
            const cell = row.insertCell(index);
            cell.textContent = field;
            cell.classList.add('editable');
            if (index == 1) {
                const buttonCell = row.insertCell();
                const button = document.createElement('button');
                button.textContent = "Update"; 
                // button.classList.add('edit-button'); // Optional: Add a class for styling
                button.addEventListener('click', () => {
                    console.log("Button clicked for route:", route);
                });
                buttonCell.appendChild(button);
            }
        });
    });
       

    const editableCells = document.querySelectorAll('#trainLineTable .editable');

    editableCells.forEach(cell => {
    cell.addEventListener('click', function () {
            // Save the current value of the cell
            const originalValue = cell.textContent;

            // Prevent multiple input fields if already in editing mode
            if (cell.querySelector('input')) return;

            // Change the cell content to an input field for editing
            const inputField = document.createElement('input');
            inputField.value = originalValue; // Set the input field's value to the original text
            cell.appendChild(inputField);
        })
    });

    // Focus the input field and select the text
    inputField.focus();
    inputField.select();

    // Handle input field blur (when the user clicks away)
    inputField.addEventListener('blur', function () {
      const newValue = inputField.value;

      if (newValue !== originalValue) {
        cell.textContent = newValue; // Set the cell content to the new value
      } else {
        cell.textContent = originalValue; // Revert to original value if unchanged
      }
    });

    // Handle Enter key to save the value
    inputField.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        inputField.blur(); // Trigger blur event to save the value
      }
    });
}

async function fetchRouteNums() {
    const select = document.getElementById('selectBusRoutes');
    const busStopSelect = document.getElementById('routeNumForBusStops');

    const response = await fetch('/busRouteTable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    tableContent.forEach(option => {
        const newOption1 = document.createElement('option');
        console.log(option);
        newOption1.value = option[1]; // sets input value
        newOption1.textContent = option[1]; // sets visible text
        select.appendChild(newOption1);
        const newOption2 = document.createElement('option');
        newOption2.value = option[1]; 
        newOption2.textContent = option[1]; 
        busStopSelect.appendChild(newOption2);
    });
}

async function fetchTrainLines() {
    const select = document.getElementById('selectTrainLines');
    // const trainLineSelect = document.getElementById('routeNumsForTrainLines');

    const response = await fetch('/trainLineTable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    tableContent.forEach(option => {
        const newOption = document.createElement('option');
        console.log("train line " + option);
        newOption.value = option[1]; // sets input value
        newOption.textContent = option[1]; // sets visible text
        select.appendChild(newOption);
        // trainLineSelect.appendChild(newOption);
    });
}

async function selectQueryBusRoutes(event) {
    event.preventDefault();

    const select = document.getElementById('selectBusRoutes');
    const selectedValues = Array.from(select.selectedOptions).map(option => option.value);

    if (selectedValues[0] == "All") {
        fetchAndDisplayBusRoutes();
        return;
    }

    const selectedLabel = document.getElementById('selectedRoutes');

    let string = "selected routes: ";
    for (val of selectedValues) {
        string = string + val +  "  ";
    }
    selectedLabel.textContent = string;

    const response = await fetch("/query-select-BusRoute", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ routeNumbers: selectedValues })
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    const tableElement = document.getElementById('busRouteTable');
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(route => {
        const row = tableBody.insertRow();
        route.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function selectQueryTrainLines(event) {
    event.preventDefault();

    const select = document.getElementById('selectTrainLines');
    const selectedValues = Array.from(select.selectedOptions).map(option => option.value);

    console.log(selectedValues[0] );
    if (selectedValues[0] == "All") {
        fetchAndDisplayBusRoutes();
        return;
    }

    const selectedLabel = document.getElementById('selectedLines');

    let string = "selected lines: ";
    for (val of selectedValues) {
        string = string + val +  "  ";
    }
    selectedLabel.textContent = string;

    const response = await fetch("/query-select-TrainLine", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lineNames: selectedValues })
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    const tableElement = document.getElementById('trainLineTable');
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(route => {
        const row = tableBody.insertRow();
        route.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

}

// function filterSelectInput() {
//     const filter = filterInput.value.toLowerCase();
//     Array.from(select.options).forEach(option => {
//         const text = option.textContent.toLowerCase();
//         option.style.display = text.includes(filter) ? "" : "none";
//     });
// }