const sql = require('mssql');

// Configuration for the database
const config = {
  user: 'minds_qa',          // your SQL Server username
  password: 'zeqBzBD2N6^SSUCUJxj5',      // your SQL Server password
  server: '54.81.49.20',  // e.g., 'localhost' or an IP address
  database: 'master', // name of your database
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

    // // Example query
    // let result = await pool.request().query(`SELECT * FROM Minds_Quantum.dbo.ReporteAnonimo`);
    // console.log(result);
    return pool;
  } catch (err) {
    console.log("Error: ", err);
  }
}

module.exports = {
    connectToDatabase,
    config
}


