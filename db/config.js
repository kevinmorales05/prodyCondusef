const sql = require('mssql');
require('dotenv').config();

// Configuration for the database
const config = {
  user: process.env.DB_User,          // your SQL Server username
  password: process.env.DB_Password,      // your SQL Server password
  server: process.env.DB_Server,  // e.g., 'localhost' or an IP address
  database: process.env.DB_Name, // name of your database
  options: {
    encrypt: true,               // true for Azure, false for local SQL Server
    trustServerCertificate: true // true for self-signed certificates
  }
};

// Function to connect to the database
async function connectToDatabase() {
  try {
    // Make the connection to the database
    let pool = await sql.connect(config);
    console.log("Connected to SQL Server");

    // Example query
    let result = await pool.request().query(`SELECT * FROM Minds_Quantum.dbo.ReporteAnonimo`);
    console.log(result);
    return pool;
  } catch (err) {
    console.log("Error: ", err);
  }
}

module.exports = {
    connectToDatabase,
    config
}


