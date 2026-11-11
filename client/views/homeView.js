import { api } from "../js/footballInteligenceRequester.js";
import { footballInteligenceServices } from "../js/footballInteligenceServices.js";
import { lib } from "../js/lib.js";


const competitionsList = document.getElementById("competition")
competitionsList.addEventListener("change", onChosenCompetition)
const findMatchesButton = document.getElementById("find-matches")
findMatchesButton.addEventListener("click", onFindMatches)
const clubsList = document.getElementById("club")
const seasonsList = document.getElementById("season")
seasonsList.addEventListener("change", onChosenSeason)
clubsList.addEventListener("change", updateFindMatchesButton)

async function populateCompetitions(){
    findMatchesButton.disabled = true
    const competitions = await footballInteligenceServices.loadCompetitions()

    const uniqueCompetitions = [...new Map(
    competitions.map(competition => [
        competition.competition_id,
        competition.competition_name
    ]))]

    

    const temp = ([id, name])=> lib.html `<option value="${id}">${name}</option>`

    const competitionsNames = uniqueCompetitions.map(competition=>temp(competition))



    lib.render(competitionsNames, competitionsList)

}

async function onChosenCompetition(e){

    findMatchesButton.disabled = true
    seasonsList.disabled = false
    

    const competitionId = e.target.value

    const seasons = await footballInteligenceServices.loadSeasons(competitionId)
    

    const uniqueSeasons = [...new Map(
    seasons.map(season => [
        season.season_id,
        season.season_name
    ]))]

    

    const temp = ([id, name])=> lib.html `<option value="${id}">${name}</option>`

    const seasonsNames = uniqueSeasons.map(season=>temp(season))

    lib.render(seasonsNames, seasonsList)
    seasonsList.value = ""
    seasonsList.disabled = false
    
    clubsList.value = ""

}

async function onChosenSeason(e){
    
    findMatchesButton.disabled = true
    clubsList.disabled = false
    
    const seasonId = e.target.value
    const competitionId = document.getElementById("competition").value

    const clubs = await footballInteligenceServices.loadClubs(competitionId, seasonId)

   
    const temp = ([id, name])=> lib.html `<option value="${id}">${name}</option>`

    const clubNames = clubs.map(club=>temp(club))

    lib.render(clubNames, clubsList)
    clubsList.value = ""
    clubsList.disabled = false
    

}

function updateFindMatchesButton() {
    if (
        competitionsList.value !== "" &&
        seasonsList.value !== "" &&
        clubsList.value !== ""
    ) {
        findMatchesButton.disabled = false
    } else {
        findMatchesButton.disabled = true
    }
}

function onFindMatches(e){
    
    const competitionId = competitionsList.value
    const seasonId = seasonsList.value
    const clubId = clubsList.value
    lib.page(`/matches?competitionId=${competitionId}&seasonId=${seasonId}&clubId=${clubId}`)
}

export function showHomeView(){
    populateCompetitions()
}

