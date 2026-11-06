import { momentumObjective } from "./momentumObjective.js"

function buildMomentumSegment(advantageValues, start, end, lambda) {

    const momentumValues = []

    if(start==end){
        return [advantageValues[start]]
    }

    const mid = Math.floor((end+start)/2)

    const leftSegment = buildMomentumSegment(advantageValues, start, mid, lambda)
    const rightSegment = buildMomentumSegment(advantageValues, mid+1, end, lambda)
    
    const mergedSegment = [...leftSegment, ...rightSegment]

    const candidateSegment = [...mergedSegment]

    const alpha = lambda/(1+2*lambda)

    const leftBorderIdx = leftSegment.length-1
    const rightBorderIdx = leftSegment.length
    
    const newLeftBorder = candidateSegment[leftBorderIdx] +  alpha*(candidateSegment[rightBorderIdx]-candidateSegment[leftBorderIdx])
    const newRightBorder = candidateSegment[rightBorderIdx] +  alpha*(candidateSegment[leftBorderIdx]-candidateSegment[rightBorderIdx])

    candidateSegment[leftBorderIdx] = newLeftBorder
    candidateSegment[rightBorderIdx] = newRightBorder

    const originalSegment = advantageValues.slice(start, end + 1)

    const candidateCost = momentumObjective.calculateTotalCost(candidateSegment, originalSegment, lambda)
    const mergedCost = momentumObjective.calculateTotalCost(mergedSegment, originalSegment, lambda)

    return candidateCost<mergedCost ? candidateSegment : mergedSegment

}



export const divideAndConquer = {
    buildMomentumSegment
}