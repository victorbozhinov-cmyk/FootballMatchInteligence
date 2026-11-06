import xTGrid from "../data/xTGrid.json" with { type: "json" };


function getTeamEvents(events, teamName) {
    return events.filter(e => e.team.name === teamName);
}

function getBallProgressionTeamEvents(events){

    return events.filter(e=>e.type.name === "Pass" || e.type.name==="Carry")

}

function getXTZone(location) {
    
    const x = location[0]
    const y = location[1]

    const zoneWidth = 120 / 12
    const zoneHeight = 80 / 8

    const col = Math.min(Math.floor(x / zoneWidth), 11)
    const row = Math.min(Math.floor(y / zoneHeight), 7)

    return { row, col }
}

function getXTValue(location) {
    const {row, col} = getXTZone(location)

    return xTGrid[row][col]
}

function calculateXT(event){

    if(event.type.name === "Pass" && event.pass.outcome){
        return 0
    }

    const initialLocation  = event.location
    const endLocation = event.type.name === "Pass" ? event.pass.end_location : event.carry.end_location

    return getXTValue(endLocation) - getXTValue(initialLocation)
}

function getShotsTeam(events) {
    return events.filter(e=>e.type.name === "Shot")

}

function getShotXG(event){
    return event.shot?.statsbomb_xg ?? 0
}

function didOpponentGainPossession(events, passIndex) {
    
    const teamId = events[passIndex].team.id;

    const nextEvents = events.slice(passIndex + 1, passIndex + 7);

    const nextControlEvent = nextEvents.find(e =>
        e.type.name === "Pass" ||
        e.type.name === "Carry" ||
        (e.type.name === "Ball Recovery" && !e.ball_recovery?.recovery_failure)
    );

    if (!nextControlEvent) {
        return false;
    }

    return nextControlEvent.team.id !== teamId;
}

function calculatePossessionRisk(events, passIndex) {

    if(events[passIndex].type.name !=="Pass" || 
        events[passIndex].pass?.outcome?.name !== "Incomplete" 
        || !didOpponentGainPossession(events, passIndex))
        {
        return 0
    }

    const lostBallLocation = events[passIndex].pass.end_location
    const opponentLocation = [120-Number(lostBallLocation[0]), Number(80-lostBallLocation[1])]

    return -getXTValue(opponentLocation)


}


function getEventMetrics(events, eventIndex){

    const event = events[eventIndex]

    let xT = 0;

    if (event.type.name === "Pass" || event.type.name === "Carry") {
        xT = calculateXT(event);
    }

    const xG = getShotXG(event)

    
    const risk = calculatePossessionRisk(events, eventIndex)

    const matrics = {
        xT,
        xG,
        risk
    }

    return matrics
}

export const eventProcessor = {
    getTeamEvents,
    getBallProgressionTeamEvents,
    getXTZone,
    getXTValue,
    calculateXT,
    getShotsTeam,
    getShotXG,
    didOpponentGainPossession,
    calculatePossessionRisk,
    getEventMetrics
}