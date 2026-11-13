export async function showAnalysisView(ctx) {

    const params = new URLSearchParams(ctx.querystring)

    const matchId = params.get("matchId")

    console.log("Match ID:", matchId)
}