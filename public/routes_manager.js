window.onload = function() {
    // checkDbConnection();
    // fetchAndDisplayBusRoutes();
    // fetchAndDisplayTrainLines();
    fetchAndDisplayRoutes();
    fetchBusRouteOptions();
    fetchRouteOptions();

    // event listeners
    document.getElementById("queryRoutesButton").addEventListener("click", selectQueryRoutes);
    document.getElementById("busStopsButton").addEventListener("click", fetchAndDisplayStopsOnRoute);
    // document.getElementById("queryTrainLinesButton").addEventListener("click", selectQueryTrainLines);
}

// fetch and display all routes
async function fetchAndDisplayRoutes() {
    const tableElement = document.getElementById('routeTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/routeTable', {
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
        route.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches data from the BusRoute table and displays it.
async function fetchAndDisplayBusRoutes() {
    const tableElement = document.getElementById('busRouteTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/routeTable', {
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

// async function fetchAndDisplayTrainLines() {
//     const tableElement = document.getElementById('trainLineTable');
//     const tableBody = tableElement.querySelector('tbody');

//     const response = await fetch('/trainLineTable', {
//         method: 'GET'
//     });

//     const responseData = await response.json();
//     const tableContent = responseData.data;

//     // Always clear old, already fetched data before new fetching process.
//     if (tableBody) {
//         tableBody.innerHTML = '';
//     }

//     tableContent.forEach(route => {
//         const row = tableBody.insertRow();
//         console.log("inserted " + row);
//         route.forEach((field, index) => {
//             console.log("field ", field , " index ", index);
//             const cell = row.insertCell(index);
//             cell.textContent = field;
//         });
//     });
// }

async function fetchRouteOptions() {
    const select = document.getElementById('selectRoutes');

    const response = await fetch('/routeTable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    tableContent.forEach(option => {
        const newOption1 = document.createElement('option');
        newOption1.value = option[0]; // sets input value
        newOption1.textContent = option[0]; // sets visible text
        select.appendChild(newOption1);
    });
}

async function fetchAndDisplayStopsOnRoute(event) {
    event.preventDefault();

    const tableElement = document.getElementById('busStopsTable');
    const tableBody = tableElement.querySelector('tbody');

    const select = document.getElementById('routeIDoptions');
    const route_id = select.value;


    const response = await fetch('/busRouteStopsAtTable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rid: route_id })
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    let currentEditableCell = null;

    tableContent.forEach(route => {
        const row = tableBody.insertRow();
        console.log("inserted " + row);
        console.log("current route", route);
        let currRID = route[1];

        route.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
            if (index > 1) {
                cell.classList.add('editable');

                cell.addEventListener('click', () => {
                    event.preventDefault();
                    
                    if (currentEditableCell === cell) {
                        return;
                    }

                    if (currentEditableCell) {
                        const input = currentEditableCell.querySelector('input');
                        if (input) {
                            currentEditableCell.textContent = input.value;
                        }
                    }
                    
                    if (!cell.querySelector('input')) {
                        const inputField = document.createElement('input');
                        inputField.type = 'text';
                        inputField.value = cell.textContent;
                        cell.appendChild(inputField);

                        // Add focus to the input field
                        inputField.focus();
                        inputField.addEventListener('blur', () => {
                            cell.textContent = field; // Revert to original value
                        });

                        inputField.addEventListener('keydown', (event) => {
                            if (event.key === 'Enter') {
                                if (index == 2) {
                                    updateTime(currRID, field, inputField.value);
                                } else {
                                    updatePos(currRID, field, inputField.value);
                                }
                            }
                        });
                    }
                    currentEditableCell = cell;
            });
            }
            console.log(row);
        });
    });

    fetchBusStopCounts(route_id);
}

async function fetchBusStopCounts(route_id) {
    const tableElement = document.getElementById('busStopCountTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/countBusStops', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(route => {
        const row = tableBody.insertRow();
        route.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
            if (field == route_id) {
                row.style.fontWeight = 'bold';
            }
        });
    });
}


async function fetchBusRouteOptions() {
    const select = document.getElementById('routeIDoptions');

    const response = await fetch('/busRouteTable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    tableContent.forEach(option => {
        const newOption1 = document.createElement('option');
        console.log(option);
        newOption1.value = option[0]; // sets input value
        newOption1.textContent = option[0]; // sets visible text
        select.appendChild(newOption1);
    });
}

// async function fetchTrainLines() {
//     const select = document.getElementById('selectTrainLines');
//     // const trainLineSelect = document.getElementById('routeNumsForTrainLines');

//     const response = await fetch('/trainLineTable', {
//         method: 'GET'
//     });

//     const responseData = await response.json();
//     const tableContent = responseData.data;

//     tableContent.forEach(option => {
//         const newOption = document.createElement('option');
//         console.log("train line " + option);
//         newOption.value = option[1]; // sets input value
//         newOption.textContent = option[1]; // sets visible text
//         select.appendChild(newOption);
//         // trainLineSelect.appendChild(newOption);
//     });
// }

async function selectQueryRoutes(event) {
    event.preventDefault();

    const select = document.getElementById('selectRoutes');
    const selectedValues = Array.from(select.selectedOptions).map(option => option.value);

    const dest = document.getElementById('destInput').value.replace(/\s/g, '');
    
    console.log(dest);

    if (selectedValues[0] == "All" && dest == "") {
        fetchAndDisplayRoutes();
        return;
    }

    const selectedLabel = document.getElementById('selectedRoutes');

    let string = "Selected Routes: ";
    for (val of selectedValues) {
        string += val +  "  ";
    }
    string += " - Destination: " + dest;

    selectedLabel.textContent = string;

    const response = await fetch("/query-select-Route", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rid: selectedValues, destination: dest })
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    const tableElement = document.getElementById('routeTable');
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

async function updateTime(route_id, oldTime, time) {
    const timePattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (timePattern.test(time)) { 
        try {
            const response = await fetch('/update-bus-time', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rid: route_id, old: oldTime, time: time })
            });
            if (response.ok) {
                alert(`Bus stop for bus route ${route_id} updated to ${time}!`);
            } else {
                alert(`Bus stop for bus route ${route_id} not updated. Please enter valid unique time.`);
            }
        } catch (error) {
            alert(error.message);
        }

        fetchAndDisplayStopsOnRoute();
        
    } else {
        alert("invalid time format, table not updated.");
    }
}

async function updatePos(route_id, oldPos, pos) {
    pos = Number(pos);
    try {
        const response = await fetch('/update-bus-pos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rid: route_id, old: oldPos, pos: pos })
        });
        if (response.ok) {
            alert(`Bus stop for bus route ${route_id} updated to ${pos}!`);
        } else {
            alert(`Bus stop for bus route ${route_id} not updated. Please enter valid unique position.`);
        }
    } catch (error) {
        alert(error.message);
    }
    fetchAndDisplayStopsOnRoute();
}

// async function selectQueryTrainLines(event) {
//     event.preventDefault();

//     const select = document.getElementById('selectTrainLines');
//     const selectedValues = Array.from(select.selectedOptions).map(option => option.value);

//     console.log(selectedValues[0] );
//     if (selectedValues[0] == "All") {
//         fetchAndDisplayBusRoutes();
//         return;
//     }

//     const selectedLabel = document.getElementById('selectedLines');

//     let string = "selected lines: ";
//     for (val of selectedValues) {
//         string = string + val +  "  ";
//     }
//     selectedLabel.textContent = string;

//     const response = await fetch("/query-select-TrainLine", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ lineNames: selectedValues })
//     });

//     const responseData = await response.json();
//     const tableContent = responseData.data;

//     const tableElement = document.getElementById('trainLineTable');
//     const tableBody = tableElement.querySelector('tbody');

//     if (tableBody) {
//         tableBody.innerHTML = '';
//     }

//     tableContent.forEach(route => {
//         const row = tableBody.insertRow();
//         route.forEach((field, index) => {
//             const cell = row.insertCell(index);
//             cell.textContent = field;
//         });
//     });

// }