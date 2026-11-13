import express from "express";
import { statsbombService } from "./services/StatsBombservices.js"

const app = express()

app.get("/api/competitions", async (req, res) => {
    try {
        const competitions = await statsbombService.getCompetitions()

        res.json(competitions)
    } catch (error) {
        res.status(500).json({ error: "Failed to load competitions" })
    }
})

app.get("/api/seasons", async (req, res) => {
    try {
        const leagueId = Number(req.query.competitionId)

        const seasons = await statsbombService.getLeague(leagueId)

        res.json(seasons)

    } catch (error) {
        res.status(500).json({
            error: "Failed to load seasons"
        })
    }
})

app.get("/api/clubs", async (req, res) => {
    try {
        const competitionId = Number(req.query.competitionId)
        const seasonId = Number(req.query.seasonId)

        const clubs = await statsbombService.getClubs(competitionId, seasonId)

        res.json(clubs)

    } catch (error) {
        console.error(error)

        res.status(500).json({
            error: "Failed to load clubs"
        })
    }
})

app.get("/api/matches", async (req, res)=>{
    try{
        const competitionId = Number(req.query.competitionId)
        const seasonId = Number(req.query.seasonId)
        const clubId = Number(req.query.clubId)

        const matches = await statsbombService.getClubMatches(competitionId, seasonId, clubId)
        res.json(matches)
    }catch(error){
        console.error(error)

        res.status(500).json({
            error: "Failed to load matches"
        })
    }
})

app.get("/api/analyze", async (req, res)=>{
    try{
        const matchId = Number(req.query.matchId)

        const matchEvents = await statsbombService.getMatchEvents(matchId)
        res.json(matchEvents)
    }catch(error){
        console.error(error)

        res.status(500).json({
            error: "Failed to load match info"
        })
    }
})



app.listen(3000, () => {
    console.log("Backend server running on port 3000")
})