const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require("axios");
const cors = require("cors");
const { connectToDatabase, config } = require("./db/config");
const sql = require("mssql");
const { sendEmail } = require("./mailServer/mail");

app.use(bodyParser.json());
const corsOptions = {
  origin: "*", // Replace with the allowed domain
};
app.use(cors(corsOptions));

const port = process.env.PORT || 3000;

let pool = connectToDatabase();

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.post("/api/refreshToken", async (req, res) => {
  //console.log("body ",req.body);
  const { username, password } = req.body;

  try {
    const response = await axios.get(
      "https://api-reune-pruebas.condusef.gob.mx/auth/users/token/",
      {
        data: { username: username, password: password }, // Esto coloca el payload en la solicitud GET
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
      }
    );
    console.log("response ", response.data);

    if (response.data.user !== null) {
      console.log("incorrect password");
      res.status(201).json(response.data);
    } else {
      res.status(201).json({
        msg: "Contraseña incorrecta",
        code: 101,
      });
    }
  } catch (error) {
    res.status(201).json({
      msg: "Contraseña incorrecta",
      code: 101,
    });
  }
});

app.post("/api/insertReporteAnonimo", async (req, res) => {
  console.log("start here!");
  const { Reporte, DatosPersona, Fecha, ComentariosOC } = req.body;
  let pool = await sql.connect(config);
  console.log("req.body ", req.body);
  // insert to MINDS DB
  try {
    let query = `INSERT INTO Minds_Quantum.dbo.ReporteAnonimo (Reporte, DatosPersona, Fecha, ComentariosOC, idEstatus) VALUES (@Reporte, @DatosPersona, @Fecha, @ComentariosOC, 1)`;

    let result = await pool
      .request()
      .input("Reporte", sql.VarChar, Reporte)
      .input("DatosPersona", sql.VarChar, DatosPersona)
      .input("Fecha", sql.DateTime, Fecha)
      .input("ComentariosOC", sql.VarChar, ComentariosOC)
      .query(query);
    console.log(result);
    try {
      sendEmail(Reporte, ComentariosOC);
    } catch (error) {
      console.log(error);
    }

    res.status(201).json({
      message: "The report was succesfully inserted in MINDS",
      code: "01",
    });
  } catch (error) {
    res.status(201).json({
      message: "The report was unsuccesfully inserted in MINDS",
      code: "02",
      mistake: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
