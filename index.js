import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { TeamDataFetcher } from './util.js'; // Custom module
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { mongoose } from 'mongoose';

// Patch for __dirname and __filename in ESM (real solution is WIP in Node.js next version)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// load environment variables
dotenv.config();
const fetchTeamData = new TeamDataFetcher(); // Utils

const apiKey = process.env.API_KEY;
const mongoIP = process.env.MONGO_IP;
const mongoPort = process.env.MONGO_PORT;

// set up express
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public')); // serve static files

// mongoose connect
mongoose
  .connect(`mongodb://${mongoIP}:${mongoPort}/strategydb`, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// API routes
// This is a pass-through route to the TBA API, mainly for debugging
app.use('/api/tba', (req, res) => {
  const reroutePath = req.originalUrl.replace('/api/tba', '');
  const fetchUrl = `https://www.thebluealliance.com/api/v3${reroutePath}`;
  const headers = {
    Accept: 'application/json',
    'X-TBA-Auth-Key': apiKey,
  };

  fetch(fetchUrl, {
    method: req.method,
    headers: headers,
  })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data from TBA API' });
    });
});

// This is a pass-through route to the Statbotics API
app.use('/api/statbotics', (req, res) => {
  const reroutePath = req.originalUrl.replace('/api/statbotics', '');
  const fetchUrl = `https://api.statbotics.io/v3${reroutePath}`;
  const headers = {
    Accept: 'application/json',
  };
  fetch(fetchUrl, {
    method: req.method,
    headers: headers,
  })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error fetching data:', error);
      res
        .status(500)
        .json({ error: 'Error fetching data from Statbotics API' });
    });
});


// Whiteboard database setup
const whiteboardSchema = new mongoose.Schema({
  matchKey: String,
  teamNumber: String,
  gamePhase: String,
  data: Object,
});

// Create the Whiteboard model (actually it's not create, it's rather get)
const Whiteboard = mongoose.model('Whiteboard', whiteboardSchema);

// Routes
app.get('/', async (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

app.get('/team/:team/', async (req, res) => {
  // API query for team
  const team = req.params.team;
  try {
    const allEvents = await fetchTeamData.fetchAllEventsCurrentYearTBA(team);

    const eventData = allEvents
      .map(event => ({
        event_code: event.event_code,
        name: event.name,
        week: event.week,
        end_date: event.end_date,
      }))
      .sort((a, b) => {
        const parseDate = str => {
          const [year, month, day] = str.split('-').map(Number);
          return new Date(2000 + year, month - 1, day);
        };

        return parseDate(a.end_date) - parseDate(b.end_date);
      });

    const allMatchData = [];

    for (const eventCode of eventData.map(event => event.event_code)) {
      const matchData = await fetchTeamData.fetchAllMatchesAtEventTBA(
        team,
        eventCode
      );
      allMatchData.push(
        matchData
          .map(match => ({
            key: match.key,
            comp_level: match.comp_level,
            match_number: match.match_number,
            set_number: match.set_number,
            fancy_comp_level: fetchTeamData.getFancyQualName(match.comp_level),
            fancy_match_number: fetchTeamData.getFancyMatchNumber(
              match.comp_level,
              match.match_number,
              match.set_number
            ),
            end_time: match.post_result_time,
          }))
          .sort((a, b) => {
            return a.end_time - b.end_time;
          })
      );
    }

    res.render('mainpage', { team, eventData, allMatchData });
  } catch (error) {
    console.error(`Error fetching data for team ${team}:`, error);
    // res.status(404).send(`Error 404<br>Team ${team} not found <br> <a href="/">Go back</a>`);
    var error = `Team ${team} not found`;
    res.status(404).render('404', { error });
  }
});

// Match for a specific team
app.get('/match/:matchKey/:team', async (req, res) => {
  const matchKey = req.params.matchKey;
  const matchData = await fetchTeamData.fetchMatchDataTBA(matchKey);
  const teamNumber = req.params.team;
  const statboticsData = await fetchTeamData.getStatboticsMatchData(matchKey);
  res.render('match', { matchKey, matchData, teamNumber, statboticsData });
});

app.get('/redirect/team/', async (req, res) => {
  const team = req.query.team;
  res.redirect(`/team/${team}`);
});

// Whiteboard for a specific team for a specific match for a specific game phase
app.get('/whiteboard/:matchKey/:teamNumber/:gamePhase', async (req, res) => {
  const matchKey = req.params.matchKey;
  const gamePhase = req.params.gamePhase;
  const matchData = await fetchTeamData.fetchMatchDataTBA(matchKey);
  const unformattedTeams = matchData.alliances.red.team_keys.concat(
    matchData.alliances.blue.team_keys
  );
  const teamNumber = req.params.teamNumber;
  const teams = [];
  unformattedTeams.forEach(element => {
    teams.push(element.substring(3));
  });
  res.render('whiteboard', {
    matchKey,
    matchData,
    teams,
    teamNumber,
    gamePhase,
  });
});

// Save to db
app.post('/save/whiteboard', async (req, res) => {
  const { matchKey, teamNumber, gamePhase, data } = req.body;

  const whiteboardData = new Whiteboard({
    matchKey,
    teamNumber,
    gamePhase,
    data, // This is a json object representing the whiteboard state
  });

  try {
    await Whiteboard.deleteMany({ matchKey, teamNumber, gamePhase });
    //delete existing whiteboard saves because i'm too lazy to even try making multiple saves
    await whiteboardData.save();
    res.status(200).json({ message: 'Whiteboard data saved successfully' });
  } catch (error) {
    console.error('Error saving whiteboard data:', error);
    res.status(500).json({ error: 'Error saving whiteboard data' });
  }
});

// Fetch from db
app.get('/saved/whiteboard', async (req, res) => {
  const matchKey = req.query.matchKey;
  const teamNumber = req.query.teamNumber;
  const gamePhase = req.query.gamePhase;

  // console.log(`received request for matchKey: ${matchKey}, teamNumber: ${teamNumber}, gamePhase: ${gamePhase}`);
  try {
    const whiteboards = await Whiteboard.find({
      matchKey,
      teamNumber,
      gamePhase,
    });
    res.status(200).json(whiteboards);
  } catch (error) {
    console.error('Error fetching saved whiteboard data:', error);
    res.status(500).json({ error: 'Error fetching saved whiteboard data' });
  }
});

// Delete from db. Not implemented in frontend
app.delete('/delete/whiteboard', async (req, res) => {
  const { matchKey, teamNumber, gamePhase } = req.body;

  try {
    await Whiteboard.deleteMany({ matchKey, teamNumber, gamePhase });
    res.status(200).json({ message: 'Whiteboard data deleted successfully' });
  } catch (error) {
    console.error('Error deleting whiteboard data:', error);
    res.status(500).json({ error: 'Error deleting whiteboard data' });
  }
});

// 404 catch
app.use((req, res, next) => {
  var error = `Page not found`;
  res.status(404).render('404', { error });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
