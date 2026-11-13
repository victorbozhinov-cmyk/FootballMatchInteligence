import { footballInteligenceServices } from "../js/footballInteligenceServices.js";;
import { lib } from "../js/lib.js";
import { showAnalysisView } from "./analysisView.js";



export async function showMatchesView(ctx){
    
    
    const params = new URLSearchParams(ctx.querystring)
    const competitionId = params.get("competitionId")
    const seasonId = params.get("seasonId")
    const clubId = params.get("clubId")

    const homeView = document.getElementById("home-view")
    const dynamicView = document.getElementById("dynamic-view")

   
    const matches = await footballInteligenceServices.loadMatches(competitionId, seasonId, clubId)

    const temp = (match)=>{
        return lib.html`
        <section class="match-card">

            <h2>Match Details</h2>

            <div class="match-teams">

                <div class="home-team">
                    <div class="team-image">Home Team</div>
                    <h3>${match.home_team.home_team_name}</h3>
                </div>

                <div class="match-score">
                    <span>VS</span>
                    <h2>${match.home_score} : ${match.away_score}</h2>
                </div>

                <div class="away-team">
                    <div class="team-image">Away Team</div>
                    <h3>${match.away_team.away_team_name}</h3>
                </div>

            </div>

            <p>Match Date: ${match.match_date}</p>

            <button class="analyze-btn" type="button" @click=${() => lib.page(`/analysis?matchId=${match.match_id}`)}>
                Analyze
            </button>

        </section>
        `
    }

    let matchesList = []
    if(matches){
        matchesList = matches.map(match=>temp(match))
    }

    homeView.hidden = true

    const template = lib.html`
        <main>
            <button type="button" @click=${() => lib.page("/")}>
                ← Back
            </button>

            <h1>Match Results</h1>

            ${matchesList}
        </main>`

    lib.render(template, dynamicView)
    
}