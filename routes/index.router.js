const express = require('express');
const convert = require('../controller/convertController');

const app = express();

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit', async (req, res) => {
  const inputText = req.body.inputText;
  const basePath = req.body.basePath;
  //console.log(req.body);

  const finalObj = await convert.soapToJson(inputText, basePath);
  //console.log(finalObj);

  res.render('index', { outputText: finalObj, inputText: inputText, basePath: basePath });
});

module.exports = app;
