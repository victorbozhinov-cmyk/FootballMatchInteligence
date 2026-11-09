import { api } from "./footballInteligenceRequester.js"

const BASE_URL = "/api"

const endpoints = {
    loadCompetitions: `${BASE_URL}/competitions`,
    loadSeasons: `${BASE_URL}/seasons`,
    loadClubs: `${BASE_URL}/clubs`
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

export const footballInteligenceServices = {
    loadCompetitions,
    loadSeasons,
    loadClubs
}