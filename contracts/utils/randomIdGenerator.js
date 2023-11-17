
//returns random numder between 1 to 9
const rndInt = () => Math.floor(Math.random() * 9) + 1

//returns 16 digit random Id
const randomId = () => {
    return Date.now() + ""+ rndInt() + "" + rndInt() + "" + rndInt()
   
}

module.exports = randomId
