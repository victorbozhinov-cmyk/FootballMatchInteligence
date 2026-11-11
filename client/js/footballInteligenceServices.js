import { api } from "./footballInteligenceRequester.js"

const BASE_URL = "/api"

const endpoints = {
    loadCompetitions: `${BASE_URL}/competitions`,
    loadSeasons: `${BASE_URL}/seasons`,
    loadClubs: `${BASE_URL}/clubs`,
    loadMatches: `${BASE_URL}/matches`
}

async function loadCompetitions() {
    const competitions = await api.get(endpoints.loadCompetitions)

    return competitions
}

async function loadSeasons(competitionId){
    const seasons = await api.get(`${endpoints.loadSeasons}?competitionId=${encodeURIComponent(competitionId)}`)
    
    return seasons
}

async function loadClubs(competitionId, seasonId){
    const clubs = await api.get
    (`${endpoints.loadClubs}?competitionId=${encodeURIComponent(competitionId)}&seasonId=${encodeURIComponent(seasonId)}`)
    
    return clubs
}

async function loadMatches(competitionId, seasonId, clubId){

    const matches = await api.get(
        `${endpoints.loadMatches}?competitionId=${encodeURIComponent(competitionId)}&seasonId=${encodeURIComponent(seasonId)}&clubId=${encodeURIComponent(clubId)}`
    )

    return matches

}

export const footballInteligenceServices = {
    loadCompetitions,
    loadSeasons,
    loadClubs,
    loadMatches
}