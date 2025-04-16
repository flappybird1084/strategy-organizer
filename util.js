
// class TeamDataFetcher {
//     async fetchTeamDataStatbotics(teamId) {
//       const url = `localhost:3000/api/statbotics/team/${teamId}`;
//       const response = await fetch(url);
//       const data = await response.json();
//       return data;
//     }
  
//     async fetchAllEventsCurrentYearTBA(teamId, year = 2025) {
//       const url = `localhost:3000/api/tba/team/${"frc" + teamId}/events/${year}/matches`;
//       const response = await fetch(url);
//       const data = await response.json();
//       return data;
//     }
//   }
  
//   module.exports = TeamDataFetcher;
// // export default TeamDataFetcher;


export class TeamDataFetcher {
  async fetchTeamDataStatbotics(teamId) {
    try {
      const url = `http://localhost:3000/api/statbotics/team/${teamId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch team data from Statbotics for team ${teamId}: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching team data from Statbotics:`, error);
      throw error; // rethrow the error if you want to handle it further up the call stack
    }
  }

  async fetchAllEventsCurrentYearTBA(teamId, year = 2025) {
    try {
      const url = `http://localhost:3000/api/tba/team/${"frc" + teamId}/events/${year}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch events from TBA for team ${teamId} in year ${year}: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching events from TBA:`, error);
      throw error; // rethrow the error if you want to handle it further up the call stack
    }
  }

  async fetchAllEventCodesCurrentYear(teamId, year = 2025) {
    const eventCodes = [];
    try{
      const allEvents = await this.fetchAllEventsCurrentYearTBA(teamId, year);
      allEvents.forEach(event => {
        const eventName = event.event_code;
        console.log(eventName);
        eventCodes.push(eventName);
      });
    }
    catch (error){
      console.error(`Error fetching events from TBA:`, error);
      throw error; // rethrow the error if you want to handle it further up the call stack
    }
    return eventCodes;
  }

  async fetchAllMatchesAtEventTBA(teamId, eventCode, year = 2025) {
    try {
      const response = await fetch(`http://localhost:3000/api/tba/team/${"frc"+teamId}/event/${year+eventCode}/matches`);
      if (!response.ok) {
        throw new Error(`Failed to fetch matches for event ${eventCode}: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching matches for event ${eventCode}:`, error);
      throw error; // rethrow the error if you want to handle it further up the call stack
    }
  }

  async fetchAllMatchKeysAtEventTBA(teamId, eventCode, year = 2025) {
    try{
      const response = await this.fetchAllMatchesAtEventTBA(teamId, eventCode, year);
      const matchKeys = [];
      for (const match of response) {
        matchKeys.push(match.key);
      }
      return matchKeys;
    } catch(error){
      console.error(`Error fetching match keys for event ${eventCode}:`, error);
      throw error; // rethrow the error if you want to handle it further up the call stack
    }
  }

  async fetchMatchDataTBA(matchKey) {
    try {
      const response = await fetch(`http://localhost:3000/api/tba/match/${matchKey}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch matches for event ${eventCode}: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching matches for event ${eventCode}:`, error);
      throw error; // rethrow the error if you want to handle it further up the call stack
    }
  }
}