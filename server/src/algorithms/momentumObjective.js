function calculateSmoothnessCost(previousMomentum, currentMomentum, lambda) {

    const cost = lambda*(currentMomentum-previousMomentum)**2

    return cost
}

function calculateAccuracyCost(momentum, advantage) {

    const accuracyCost = (momentum-advantage)**2
    return accuracyCost

}

function calculateTotalCost(momentumValues, advantageValues, lambda){

    let totalCost = 0

    for(let i=0;i<=momentumValues.length-1;i++){
        totalCost+=calculateAccuracyCost(momentumValues[i], advantageValues[i])
    }

    for(let i=1;i<=momentumValues.length-1;i++){
        const previousMomentum = momentumValues[i-1]
        const currentMomentum = momentumValues[i]

        totalCost+=calculateSmoothnessCost(previousMomentum, currentMomentum, lambda)
    }

    return totalCost
}


export const momentumObjective = {
    calculateAccuracyCost,
    calculateSmoothnessCost,
    calculateTotalCost
}