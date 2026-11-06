import { eventProcessor } from "./eventProcessor.js";

function groupEventIndicesByMinute(events){

    const minutes = {}


    for(let i=0; i<events.length;i++){

        const minute = events[i].minute
        
        if(!minutes[minute]){
            minutes[minute] = []
        }

        minutes[minute].push(i)
    }

    return minutes
}


function calculateMinuteMetrics(events, eventIndices, teamName) {
    const totals = {
    positiveXT: 0,
    xG: 0,
    risk: 0
    }

    for (let index of eventIndices){

        if(events[index].team.name !== teamName){
            continue
        }

        const metrics = eventProcessor.getEventMetrics(events, index)

        totals.positiveXT+=Math.max(0, metrics.xT)
        totals.xG+=metrics.xG
        totals.risk+=metrics.risk
    }

    return totals

}


function calculateMatchMetrics(events, teamName) {

    const groupedEvents = groupEventIndicesByMinute(events)

    let results = []

    const lastMinute = Math.max(...events.map(e => e.minute))

    for(let minute=0; minute<=lastMinute;minute++){

        const indices = groupedEvents[minute] || []

        const metrics = calculateMinuteMetrics(events, indices, teamName)

        results.push({minute, ...metrics})
    }

    return results

}

function calculateMinuteScore(minuteMetrics) {
    const {positiveXT, xG, risk} = minuteMetrics

    const minuteScore = positiveXT + xG + risk

    return minuteScore
}

function calculateMatchScores(matchMetrics) {
    
    return matchMetrics.map(minuteMetrics=>({minute:minuteMetrics.minute, 
        score: calculateMinuteScore(minuteMetrics)}))
}

function calculateMatchAdvantage(homeTeamScores, awayTeamScores){


    const matchAdvantage = homeTeamScores.map((homeTeamScore, index)=>{
        const awayTeamScore = awayTeamScores[index]

        const advantage = homeTeamScore.score-awayTeamScore.score

          return {
            minute: homeTeamScore.minute,
            advantage: advantage
        }

    })

    return matchAdvantage
}


export const momentumModel = {
    groupEventIndicesByMinute,
    calculateMinuteMetrics,
    calculateMatchMetrics,
    calculateMinuteScore,
    calculateMatchScores,
    calculateMatchAdvantage
}