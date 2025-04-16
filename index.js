import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import { TeamDataFetcher } from './util.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const fetchTeamData = new TeamDataFetcher();

const apiKey = process.env.API_KEY;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

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
 
  // console.log(await fetchTeamData.fetchTeamDataStatbotics(1));
  // console.log(await fetchTeamData.fetchAllEventsCurrentYearTBA(1));
  // console.log(await fetchTeamData.fetchAllEventCodesCurrentYear(10252));
  // console.log(await fetchTeamData.fetchAllMatchesAtEventTBA(10252, "cabe"));
  // console.log(await fetchTeamData.fetchAllMatchKeysAtEventTBA(10252, "casj"));

  res.sendFile("index.html", { root: path.join(__dirname, 'public') });
  //temp for now. we can do login later
});

app.get('/team/:team/', async (req, res) => {
  const team = req.params.team;
  const eventCodes = await fetchTeamData.fetchAllEventCodesCurrentYear(team);
  const allMatchCodes = [];
  for (const eventCode of eventCodes) {
    const matchKeys = await fetchTeamData.fetchAllMatchKeysAtEventTBA(team, eventCode);
    allMatchCodes.push(matchKeys);
  }
  res.render('mainpage', { team , eventCodes , allMatchCodes});
});

app.get('/redirect/team/', async (req, res) => {
  const team = req.query.team;
  res.redirect(`/team/${team}`);
});

app.get('/dev/whiteboard/', async (req, res) => {
  res.render("whiteboard");
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
