var Randomizer = {
    nextInt(min,max){
        const len = Math.abs(min) + Math.abs(max)
        const rando = Math.random()
        return Math.round(rando*len)+min
    },
    nextFloat(){
        return Math.random()
    },
    nextBoolean(prob = 0.5){
        return Math.random() < prob
    }
}

// export{Randomizer}