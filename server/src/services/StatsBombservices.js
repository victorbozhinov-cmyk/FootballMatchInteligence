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

async function getSeason(season){
    const competitions = await getCompetitions()

    const data = competitions.filter(competition => competition.season_name === season)
   
    return data
}

async function getLeague(league){
    const competitions = await getCompetitions()

    const data = competitions.filter(competition => competition.competition_name === league)
   
    return data
}

async function getMatches(competitionId, seasonId){
    const matches = await api.get(`${endpoints.getMatches}/${competitionId}/${seasonId}.json`)

    return matches
   
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
    getMatchEvents
}