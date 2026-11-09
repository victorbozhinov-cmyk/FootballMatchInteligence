import { api } from "../js/footballInteligenceRequester.js";
import { footballInteligenceServices } from "../js/footballInteligenceServices.js";
import { lib } from "../js/lib.js";

async function populateCompetitions(){
    const competitions = await footballInteligenceServices.loadCompetitions()

    const uniqueCompetitions = [...new Map(
    competitions.map(competition => [
        competition.competition_id,
        competition.competition_name
    ]))]

    const competitionsList = document.getElementById("competition")
    competitionsList.addEventListener("change", onChosenCompetition)

    const temp = ([id, name])=> lib.html `<option value="${id}">${name}</option>`

    const competitionsNames = uniqueCompetitions.map(competition=>temp(competition))



    lib.render(competitionsNames, competitionsList)
    
}

async function onChosenCompetition(e){

    const seasonsList = document.getElementById("season")
    seasonsList.disabled = false
    seasonsList.addEventListener("change", onChosenSeason)

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

}

async function onChosenSeason(e){
    const clubsList = document.getElementById("club")
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

export const homeView = {
    populateCompetitions
}

