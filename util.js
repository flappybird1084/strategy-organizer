
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


class TeamDataFetcher {
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
}

module.exports = TeamDataFetcher;
// export default TeamDataFetcher;