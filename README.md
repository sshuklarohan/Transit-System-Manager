# Transit System Manager

## Project Description

The Transit System Manager is a comprehensive solution for managing public transportation systems. It is designed for use in the transportation management sector and focuses on operations, logistics, and staff management within a public transit system. Inspired by the public transport network in Metro Vancouver, this project includes features for managing routes, vehicles, stations, stops, drivers, riders, and fare payments.


This project leverages a REST API to seamlessly connect the frontend application with the relational database on the backend. The database is stored on an Oracle server, and the REST API acts as the communication bridge between the user interface and the database. 

- **REST API Functionality:** The REST API facilitates CRUD operations (Create, Read, Update, Delete) for managing data such as routes, clients, vehicles, and employees. It ensures a structured and secure way of interacting with the database.
- **Oracle Database:** The backend stores all the data in a relational schema on an Oracle database. Complex queries, aggregations, and relationships are handled efficiently using Oracle's powerful querying capabilities.


## GUI Features

### Routes Manager
- View query results and original tables.
- Input interfaces for SELECTION and UPDATE queries.
- Interfaces for GROUP BY Aggregation.

### Client Manager
- View query results and original tables.
- Input interfaces for INSERT, DELETE, and PROJECTION queries.
- Interfaces for Division, HAVING, and Nested Aggregation queries.

### Employee/Vehicle Manager
- View query results and original tables.
- Input interfaces for JOIN queries.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/sshuklarohan/Transit-System-Manager.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Transit-System-Manager
   ```

3. Set up the database:
   - Populate the database using the provided scripts.
   - Commit database changes
   - Change oracle configurations in .env file and remote-start.sh 

4. Start the application:
   ```bash
   sh remote-start.sh
   ```

   
