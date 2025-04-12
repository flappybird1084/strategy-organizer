const express = require('express');
const path = require('path');
var methodOverride = require('method-override');
const app = express();
require('dotenv').config();
const TeamDataFetcher = require('./util.js');
const fetchTeamData = new TeamDataFetcher();

const apiKey = process.env.API_KEY;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api/tba', (req, res) => {
  const reroutePath = req.originalUrl.replace('/api/tba', '');
  const fetchUrl = `https://www.thebluealliance.com/api/v3${reroutePath}`;
  const headers = {
    'Accept': 'application/json',
    'X-TBA-Auth-Key': apiKey
  };

  fetch(fetchUrl, {
    method: req.method,
    headers: headers
  })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data from TBA API' });
    });
});

app.use('/api/statbotics', (req, res) => {
  const reroutePath = req.originalUrl.replace('/api/statbotics', '');
  const fetchUrl = `https://api.statbotics.io/v3${reroutePath}`;
  const headers = {
    'Accept': 'application/json',
  };
  fetch(fetchUrl, {
    method: req.method,
    headers: headers
  })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data from TBA API' });
    });
});





app.get('/', async(req, res) => {
  // console.log(path.join(__dirname, 'public', 'index.html'));
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
  console.log(await fetchTeamData.fetchTeamDataStatbotics(1));
  console.log(await fetchTeamData.fetchAllEventsCurrentYearTBA(1));

  res.sendFile("index.html", { root: path.join(__dirname, 'public') });
  //temp for now. we can do login later
});

app.get('/:team/', (req, res) => {
  const team = req.params.team;
  res.render('mainpage', { team });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
