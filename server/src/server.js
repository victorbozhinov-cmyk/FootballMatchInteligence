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



app.listen(3000, () => {
    console.log("Backend server running on port 3000")
})