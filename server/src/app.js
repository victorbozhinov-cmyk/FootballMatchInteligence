import { statsbombService } from "./services/StatsBombservices.js";
import { eventProcessor } from "./utils/eventProcessor.js";
import { momentumModel } from "./utils/momentumModel.js";

// 1. Извличаме всички събития от мача
const events = await statsbombService.getMatchEvents(3890563);

// 2. Филтрираме събитията на Leverkusen
const teamEvents = eventProcessor.getTeamEvents(events, "Bayer Leverkusen");

// 3. Взимаме само Pass и Carry
const progressionEvents = eventProcessor.getBallProgressionTeamEvents(teamEvents);

// 4. Избираме три различни действия
const successfulPass = progressionEvents.find(
    e => e.type.name === "Pass" && !e.pass.outcome
);

const failedPass = progressionEvents.find(
    e => e.type.name === "Pass" && e.pass.outcome
);

const carry = progressionEvents.find(
    e => e.type.name === "Carry"
);

// 5. Тестваме calculateXT()
console.log("Successful Pass xT:", eventProcessor.calculateXT(successfulPass));
console.log("Failed Pass xT:", eventProcessor.calculateXT(failedPass));
console.log("Carry xT:", eventProcessor.calculateXT(carry));

const xTResults = progressionEvents
    .map(e => eventProcessor.calculateXT(e))
    .filter(value => value !== 0);

console.log("Non-zero xT values:", xTResults.slice(0, 10));
console.log("Total non-zero actions:", xTResults.length);

const shots = eventProcessor.getShotsTeam(teamEvents);

console.log("Total shots:", shots.length);

for (const shot of shots) {
    console.log("Shot xG:", eventProcessor.getShotXG(shot));
}

const failedPasses = teamEvents.filter(
    e => e.type.name === "Pass" && e.pass.outcome
);

const outcomes = failedPasses.map(
    e => e.pass.outcome.name
);

console.log("Failed pass outcomes:", [...new Set(outcomes)]);

const outcomeCounts = {};

for (const outcome of outcomes) {
    outcomeCounts[outcome] = (outcomeCounts[outcome] || 0) + 1;
}

console.log(outcomeCounts);

const index = events.findIndex(
    e => e.type.name === "Pass" &&
         e.team.name === "Bayer Leverkusen" &&
         e.pass?.outcome?.name === "Incomplete"
);

console.table(events.slice(index, index + 5).map(e => ({
    team: e.team.name,
    possession: e.possession,
    possessionTeam: e.possession_team.name,
    type: e.type.name
})));


console.log(
    "Opponent gained possession:",
    eventProcessor.didOpponentGainPossession(events, index)
);

const riskResults = [];

for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (
        event.team.name === "Bayer Leverkusen" &&
        event.type.name === "Pass" &&
        event.pass?.outcome?.name === "Incomplete"
    ) {
        riskResults.push({
            minute: event.minute,
            location: event.pass.end_location,
            opponentGained: eventProcessor.didOpponentGainPossession(events, i),
            risk: eventProcessor.calculatePossessionRisk(events, i)
        });
    }
}

console.table(riskResults.slice(0, 15));

console.log(
    "Total possession losses:",
    riskResults.filter(e => e.risk < 0).length
);


// 1. Намираме успешно подаване с ненулев xT
const passIndex = events.findIndex(e =>
    e.type.name === "Pass" &&
    !e.pass.outcome &&
    eventProcessor.calculateXT(e) !== 0
);

// 2. Намираме удар
const shotIndex = events.findIndex(e =>
    e.type.name === "Shot"
);

// 3. Намираме неуспешно подаване със загубено владение
const lostPassIndex = events.findIndex((e, i) =>
    e.type.name === "Pass" &&
    e.pass?.outcome?.name === "Incomplete" &&
    eventProcessor.calculatePossessionRisk(events, i) < 0
);

// 4. Тестваме getEventMetrics()
console.table([
    {
        action: "Successful Pass",
        ...eventProcessor.getEventMetrics(events, passIndex)
    },
    {
        action: "Shot",
        ...eventProcessor.getEventMetrics(events, shotIndex)
    },
    {
        action: "Lost Possession",
        ...eventProcessor.getEventMetrics(events, lostPassIndex)
    }
]);


const totals = {
    positiveXT: 0,
    negativeXT: 0,
    xG: 0,
    risk: 0
};

for (let i = 0; i < events.length; i++) {

    if (events[i].team.name !== "Bayer Leverkusen") {
        continue;
    }

    const metrics = eventProcessor.getEventMetrics(events, i);

    totals.positiveXT += Math.max(0, metrics.xT);
    totals.negativeXT += Math.min(0, metrics.xT);
    totals.xG += metrics.xG;
    totals.risk += metrics.risk;
}

console.table(totals);


// Групираме всички събития по минути
const groupedEvents = momentumModel.groupEventIndicesByMinute(events);

// Показваме броя събития през първите 10 минути
const results = [];

for (let minute = 0; minute < 10; minute++) {
    const indices = groupedEvents[minute] || [];

    results.push({
        minute: minute,
        eventCount: indices.length,
        firstEventIndex: indices[0] ?? "None"
    });
}

console.table(results);

// Проверяваме дали сме групирали всички събития
const totalGrouped = Object.values(groupedEvents)
    .reduce((sum, indices) => sum + indices.length, 0);

console.log("Total events:", events.length);
console.log("Total grouped:", totalGrouped);


const minuteResults = [];

for (let minute = 0; minute < 10; minute++) {
    const indices = groupedEvents[minute] || [];

    const leverkusen = momentumModel.calculateMinuteMetrics(
        events,
        indices,
        "Bayer Leverkusen"
    );

    const ingolstadt = momentumModel.calculateMinuteMetrics(
        events,
        indices,
        "Ingolstadt"
    );

    minuteResults.push({
        minute,
        leverkusenXT: leverkusen.positiveXT.toFixed(4),
        leverkusenXG: leverkusen.xG.toFixed(4),
        leverkusenRisk: leverkusen.risk.toFixed(4),
        ingolstadtXT: ingolstadt.positiveXT.toFixed(4),
        ingolstadtXG: ingolstadt.xG.toFixed(4),
        ingolstadtRisk: ingolstadt.risk.toFixed(4)
    });
}

console.table(minuteResults);


// 1. Изчисляваме показателите за целия мач
const leverkusenMetrics = momentumModel.calculateMatchMetrics(
    events,
    "Bayer Leverkusen"
);

const ingolstadtMetrics = momentumModel.calculateMatchMetrics(
    events,
    "Ingolstadt"
);

// 2. Показваме първите 10 минути на Leverkusen
console.table(leverkusenMetrics.slice(0, 10));

// 3. Проверяваме броя минути
console.log("Leverkusen minutes:", leverkusenMetrics.length);
console.log("Ingolstadt minutes:", ingolstadtMetrics.length);

// 4. Проверяваме общите стойности за Leverkusen
const matchTotals = {
    positiveXT: 0,
    xG: 0,
    risk: 0
};

for (const minute of leverkusenMetrics) {
    matchTotals.positiveXT += minute.positiveXT;
    matchTotals.xG += minute.xG;
    matchTotals.risk += minute.risk;
}

console.table(matchTotals);

// 5. Проверяваме дали всички стойности са валидни числа
const validResults = leverkusenMetrics.every(m =>
    Number.isFinite(m.positiveXT) &&
    Number.isFinite(m.xG) &&
    Number.isFinite(m.risk)
);

console.log("All metrics valid:", validResults);


const leverkuseMetrics = momentumModel.calculateMatchMetrics(
    events,
    "Bayer Leverkusen"
);

const minuteScore = momentumModel.calculateMinuteScore(
    leverkuseMetrics[0]
);

console.log("Leverkusen minute 0 score:", minuteScore);


const leverkusenScores = momentumModel.calculateMatchScores(leverkusenMetrics);
const ingolstadtScores = momentumModel.calculateMatchScores(ingolstadtMetrics);

console.table(leverkusenScores.slice(0, 10));
console.table(ingolstadtScores.slice(0, 10));

console.log("Leverkusen:", leverkusenScores.length);
console.log("Ingolstadt:", ingolstadtScores.length);


const matchAdvantage = momentumModel.calculateMatchAdvantage(
    leverkusenScores,
    ingolstadtScores
);

console.table(matchAdvantage.slice(0, 10));

console.log("Total minutes:", matchAdvantage.length);
