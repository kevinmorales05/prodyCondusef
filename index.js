const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require("axios");
const cors = require("cors");
const { connectToDatabase, config } = require("./db/config");
const sql = require("mssql");
require('dotenv').config();


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
      process.env.API_CONDUSEF,
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
      msg: `Contraseña incorrecta ${error}`,
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
      // sendEmail(Reporte, ComentariosOC);
      let emailAddress = "cumplimiento@kuhnipay.com";
      let htmlContent = `<html>
    <head></head>
    <body style="text-align: center;
            background-color: whitesmoke;">
        <h2>Kuhnipay Buzón Anónimo</h2>
        <h1>Reporte anónimo</h1>
        <p>Por medio de este correo confirmamos que el repote anónimo fue realizado con éxito .</p>
        <p> <b>Asunto: </b>${Reporte} </p>
        <p> <b>Fecha: </b>${Fecha} </p>
        <p> <b>Detalle: </b>${ComentariosOC} </p>
    </body>
    <style>
        body {
            text-align: center;
            background-color: whitesmoke;
        }
        h1 {
            font-weight: bolder;
            font-size: 40px;
            margin-top: 20px;
        }
        h2 {
            font-size: 20px;
            margin-top: 60px;
        }
        p {
            font-size: 15px;
        }
    </style>
</html>`;

      let dataInfo = JSON.stringify({
        sender: {
          name: "Buzón Anónimo Kuhnipay",
          email: "kevin@quantumpay.mx",
        },
        to: [
          {
            email: emailAddress,
            name: "Cumplimiento",
          },
        ],
        subject: Reporte,
        htmlContent: htmlContent,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: process.env.URL_BREVO,
        headers: {
          Accept: "application/json",
          "api-key": process.env.APIKEY_BREVO,
          "Content-Type": "application/json",
        },
        data: dataInfo,
      };
      axios
        .request(config)
        .then((response) => {
          //console.log(JSON.stringify(response.data));
          console.log("response status ", response.status);
          //console.log('response ', response);
          if (response.status === 201) {
            res.status(201).json({
              message:
                "El reporte fue realizado con éxito y se entregó un correo de confirmación al equipo de Cumplimiento!",
              code: "01",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
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
