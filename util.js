const BASE_URL = 'http://localhost:3000'; // No easy way to get this dynamically

export class TeamDataFetcher {
  // Fetch team data from Statbotics API for a given team ID
  async fetchTeamDataStatbotics(teamId) {
    try {
      const url = `${BASE_URL}/api/statbotics/team/${teamId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch team data from Statbotics for team ${teamId}: ${response.statusText}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching team data from Statbotics:`, error);
      throw error;
    }
  }

  // Fetch all events for the current year from The Blue Alliance (TBA) for a given team ID
  async fetchAllEventsCurrentYearTBA(teamId, year = 2025) {
    try {
      const url = `${BASE_URL}/api/tba/team/${'frc' + teamId}/events/${year}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch events from TBA for team ${teamId} in year ${year}: ${response.statusText}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching events from TBA:`, error);
      throw error;
    }
  }

  // Fetch all event codes for the current year for a given team ID
  async fetchAllEventCodesCurrentYear(teamId, year = 2025) {
    const eventCodes = [];
    try {
      // Retrieve all events first
      const allEvents = await this.fetchAllEventsCurrentYearTBA(teamId, year);
      // Extract event codes from each event object
      allEvents.forEach(event => {
        const eventCode = event.event_code;
        eventCodes.push(eventCode);
      });
    } catch (error) {
      console.error(`Error fetching events from TBA:`, error);
      throw error;
    }
    return eventCodes;
  }

  // Fetch all matches for a specific event at TBA for a given team ID and event code
  async fetchAllMatchesAtEventTBA(teamId, eventCode, year = 2025) {
    try {
      const response = await fetch(
        `${BASE_URL}/api/tba/team/${'frc' + teamId}/event/${year + eventCode}/matches`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch matches for event ${eventCode}: ${response.statusText}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching matches for event ${eventCode}:`, error);
      throw error;
    }
  }

  // Fetch all match keys for a specific event at TBA for a given team ID and event code
  async fetchAllMatchKeysAtEventTBA(teamId, eventCode, year = 2025) {
    try {
      // Retrieve all matches at the event first
      const response = await this.fetchAllMatchesAtEventTBA(
        teamId,
        eventCode,
        year
      );
      const matchKeys = [];
      // Extract the match key from each match object
      for (const match of response) {
        matchKeys.push(match.key);
      }
      return matchKeys;
    } catch (error) {
      console.error(`Error fetching match keys for event ${eventCode}:`, error);
      throw error;
    }
  }

  // Fetch detailed match data from TBA for a given match key
  async fetchMatchDataTBA(matchKey) {
    try {
      const response = await fetch(`${BASE_URL}/api/tba/match/${matchKey}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch match data for match ${matchKey}: ${response.statusText}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching match data for match ${matchKey}:`, error);
      throw error;
    }
  }

  // Convert competition level code to a more descriptive name
  getFancyQualName(comp_level) {
    switch (comp_level) {
      case 'qm':
        return 'Qualifying Match';
      case 'sf':
        return 'Semifinal';
      case 'f':
        return 'Final';
      default:
        return comp_level;
    }
  }

  // Determine the appropriate match number to display based on competition level
  getFancyMatchNumber(comp_level, match_number, set_number) {
    switch (comp_level) {
      case 'qm':
        return match_number;
      case 'sf':
        return set_number;
      case 'f':
        return match_number;
      default:
        return match_number;
    }
  }

  // Fetch match data from Statbotics API for a given match key
  async getStatboticsMatchData(matchKey) {
    try {
      const response = await fetch(
        `${BASE_URL}/api/statbotics/match/${matchKey}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch match data for match ${matchKey}: ${response.statusText}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching match data for match ${matchKey}:`, error);
      throw error;
    }
  }
}
