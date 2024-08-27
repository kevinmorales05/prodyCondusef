const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

let todos = [];

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, World!' });
  });

app.post('/api/refreshToken', async (req, res) => {
    //console.log("body ",req.body);
    const { username, password} = req.body;

try {
    const response = await axios.get('https://api-reune-pruebas.condusef.gob.mx/auth/users/token/', {
        data: { username: username, password: password }, // Esto coloca el payload en la solicitud GET
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
      });
      console.log('response ', response.data);

       if(response.data.user !== null){
        console.log('incorrect password')
        res.status(201).json(response.data);
      }
      else {
        res.status(201).json({
            msg: "Contraseña incorrecta",
            code: 101
        });
      }
} catch (error) {
    res.status(201).json({
        msg: "Contraseña incorrecta",
        code: 101
    });
}


   
    
  });



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});