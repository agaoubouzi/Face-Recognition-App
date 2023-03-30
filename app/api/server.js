const express = require("express");
const multer = require("multer");
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const faceapi = require('face-api.js');
const canvas = require('canvas');

const path = require('path');



// load face detection and landmark models
const MODEL_URL = './models';
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
  faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL),
  faceapi.nets.faceExpressionNet.loadFromDisk(MODEL_URL)

]).then(startServer);

const modelPath = path.join(__dirname, 'models');
faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);


const app = express();



app.use(cors());
app.use(express.json());



const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());


const upload = multer({ dest: "uploads/" });


const users = [];

//////---------------------- Register ---------------------------------

// define your routes and handlers
app.post('/register', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required', infoclass: 'uk-alert-danger' });
  }
  // check if user already exists in the list of registered users
  const userExists = users.find(user => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: 'User already exists', infoclass: 'uk-alert-danger' });
  }

  // add the user to the list of registered users
  users.push({ username });

  const token = jwt.sign({ username }, 'JWT_SECRET', { expiresIn: '30m' });
  // send a response to the client
  res.status(201).json({ user: username, token, message: 'User registered successfully', infoclass: 'uk-alert-success' });
});


//////---------------------- Get the Users ---------------------------------

app.get('/users', (req, res) => {
  // send the user data back to the client
  res.json(users);
});


//////---------------------- Login ---------------------------------


app.post('/login', (req, res) => {
  const { username } = req.body;

  const user = users.find(user => user.username === username);
  if (user) {
    const token = jwt.sign({ username }, 'JWT_SECRET', { expiresIn: '3m' });
    res.status(200).json({ user: username, token, message: 'Login successful!', infoclass: 'uk-alert-success' });
  } else if (!user) {
    res.status(400).json({ message: "The username doesn't exist", infoclass: 'uk-alert-danger' });
  } else {
    res.status(401).json({ message: 'Login failed, try again!', infoclass: 'uk-alert-danger' });
  }
});

//////----------------------upload image/annotation---------------------------------


function startServer() {
  // start your server code here
  app.post('/requests', upload.single('image'), async (req, res) => {
    const { authorization } = req.headers;
    const { name } = req.body;

    if (!authorization) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authorization.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, 'JWT_SECRET');
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { username } = decodedToken;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    try {
      let maxExpression = '';
      const buffer = await fs.promises.readFile(req.file.path);
      const img = await canvas.loadImage(buffer);
      const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
      const numFaces = detections.length;
      const detectionsWithExpressions = await faceapi.detectAllFaces(img).withFaceExpressions();
      //  Get the image expression
      detectionsWithExpressions.forEach(detection => {
        const expressions = detection.expressions;
        let maxLikelihood = 0;
        maxExpression = '';
        
        for (let expression in expressions) {
          if (expressions[expression] > maxLikelihood) {
            maxLikelihood = expressions[expression];
            maxExpression = expression;
          }
        }
        
      });

      // Get the image from the thumbnail
      const thumbnail = await canvas.loadImage(req.file.path);

      // Convert the image to a data URL
      const canvasThumbnail = canvas.createCanvas(thumbnail.width, thumbnail.height);
      const contextThumbnail = canvasThumbnail.getContext('2d');
      contextThumbnail.drawImage(thumbnail, 0, 0, thumbnail.width, thumbnail.height);
      const dataUrl = canvasThumbnail.toDataURL();

      const result = {
        name,
        expression: maxExpression,
        numFaces,
        thumbnail: dataUrl,
        dataUrl,
      };

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
}


// get the  registred users
app.get('/me', (req, res) => {

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'JWT_SECRET');
  const expTimeMs = decodedToken.exp * 1000; // convert expiration time to milliseconds
  const currentTimeMs = Date.now(); // get current time in milliseconds
  if (currentTimeMs >= expTimeMs) {
    return res.status(500).json({ message: 'jwt expired' });
  }
  const userId = decodedToken.username;
  res.status(200).json({ username: userId });
});


app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
