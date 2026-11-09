import { api } from "./requester.js";

const BASE_URL = "https://raw.githubusercontent.com/hudl/open-data/master/data"

const endpoints = {
    getCompetitions: `${BASE_URL}/competitions.json`,
    getMatches: `${BASE_URL}/matches`,
    getMatchEvents: `${BASE_URL}/events`

}

async function getCompetitions(){
    const response = await api.get(endpoints.getCompetitions)

   return response
}

async function getSeason(seasonId){
    const competitions = await getCompetitions()

    const data = competitions.filter(competition => competition.season_id === seasonId)
   
    return data
}

async function getLeague(leagueId){
    const competitions = await getCompetitions()
    

    const data = competitions.filter(competition => competition.competition_id === leagueId)
   
    return data
}

async function getMatches(competitionId, seasonId){
    const matches = await api.get(`${endpoints.getMatches}/${competitionId}/${seasonId}.json`)

    return matches
   
}

async function getClubs(competitionId, seasonId){
    const matches = await getMatches(competitionId, seasonId)

    const homeClubs = matches.map(match => [
    match.home_team.home_team_id,
    match.home_team.home_team_name
    ])
    const awayClubs = matches.map(match => [
    match.away_team.away_team_id,
    match.away_team.away_team_name
    ])

    const clubs = [... new Map([...homeClubs, ...awayClubs])]
    return clubs
}

async function getClubMatches(competitionId, seasonId, clubId){

    const matches = await getMatches(competitionId, seasonId)

    const clubMatches = matches.filter(match=>match.home_team.home_team_id === clubId || match.away_team.away_team_id === clubId)

    return clubMatches
}

async function getMatchEvents(matchId){
    const matchEvents = await api.get(`${endpoints.getMatchEvents}/${matchId}.json`)

    return matchEvents
}




export const statsbombService = {
    getCompetitions,
    getSeason,
    getLeague,
    getMatches,
    getMatchEvents,
    getClubMatches,
    getClubs
}