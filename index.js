const express = require('express');
const path = require('path');
var methodOverride = require('method-override');
const app = express();
require('dotenv').config();

const apiKey = process.env.API_KEY;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  // console.log(path.join(__dirname, 'public', 'index.html'));
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.sendFile("index.html", { root: path.join(__dirname, 'public') });

  //temp for now. we can do login later
});

app.get('/:team/', (req, res) => {
  const team = req.params.team;
  res.render('mainpage', { team });
});

app.get('/api/tba/:request/', (req, res) => {
  const request = req.params.request;
  const headers = {
    'Accept': 'application/json',
    'X-TBA-Auth-Key': apiKey
  };

  fetch(`https://www.thebluealliance.com/api/v3/${request}`,{
    method: 'GET',
    headers: headers
  })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => console.error('Error fetching data:', error));
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
