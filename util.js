// async function fetchTeamDataStatbotics(teamId){
//   const url = `localhost:3000/teams/api/statbotics/${teamId}`;
//   const response = await fetch(url);
//   const data = await response.json();
//   return data;
// }
// module.exports = {fetchTeamDataStatbotics};

// async function fetchAllEventsCurrentYearTBA(teamId, year=2025){
//   const url = `localhost:3000/api/tba/team/${"frc"+teamId}/events/${year}/matches`;
//   const response = await fetch(url);
//   const data = await response.json();
//   return data;
// }
// module.exports = {fetchAllEventsCurrentYearTBA};

class TeamDataFetcher {
    async fetchTeamDataStatbotics(teamId) {
      const url = `localhost:3000/teams/api/statbotics/${teamId}`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }
  
    async fetchAllEventsCurrentYearTBA(teamId, year = 2025) {
      const url = `localhost:3000/api/tba/team/${"frc" + teamId}/events/${year}/matches`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }
  }
  
  module.exports = TeamDataFetcher;