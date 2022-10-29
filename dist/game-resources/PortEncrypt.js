const valid = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"
const validNumbers = 6

function simpleDivide(dd,ds){
  return [Math.floor(dd/ds),dd%ds]
}

class PortEncrypt{
  encrypt(ip){
    const newBase = valid.length

    let numbers = ip.split(/[.\s]/)
    let decimal = 0
    for(let i in numbers){
      let number = parseInt(numbers[i])
      let value = number*(256**(3-i))
      // console.log(number + " means " + value)
      decimal += value
    }
    // console.log(decimal)
    let output = ""
    let remainder = decimal
    let power = validNumbers - 1
    let value
    while (power >= 0){
      [value,remainder] = simpleDivide(remainder,newBase**power)
      // console.log(value + " is " + value*(newBase**power) + "time base " + newBase + " at power " + power)
      output += valid[value]
      power--
    }
    return output
  }
  decrypt(code){
    const oldBase = 62
    const newBase = 256
    let numbers = code.split("")
    // console.log(numbers)
    let decimal = 0
    for(let i in numbers){
      let index = valid.indexOf(numbers[i])
      let value = index*(oldBase**(5-i))
      // console.log(index + " times " + oldBase + " to power" + (5-i))
      // console.log(value)
      decimal += value
    }
    // console.log(decimal)
    let output = ""
    let remainder = decimal
    let power = 3
    let value
    while (power >= 0){
      [value,remainder] = simpleDivide(remainder,newBase**power)
      // console.log(value + " is " + value*(newBase**power) + "time base " + newBase + " at power " + power)
      output += value + "."
      power--
    }
    output = output.slice(0,-1)
    return output
  }
}

export {PortEncrypt}