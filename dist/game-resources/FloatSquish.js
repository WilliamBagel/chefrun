
class FloatSquish{
  constructor(floatBits){
    if(floatBits == 64){
      this.floatType = 1
    }else{
      console.warn(floatBits + " is not a valid float bit number")
    }
  }
  squish(input){
    let float64Arr;
    if(input instanceof Array){
      float64Arr = new Float64Array(input)
    }else if(typeof(input) == "number"){
      float64Arr = new Float64Array(1);
      float64Arr[0] = input;
    }
    const Uint16 = new Uint16Array(float64Arr.buffer);
    let str = ""
    for(let i = 0; i < Uint16.length; i++){
        str += String.fromCharCode(Uint16[i])
    }
    return str;
  }
  unsquish(data){
    if(data == "")return console.error("Data cannot be blank");
    if(data.length%4 != 0)return console.warn("Data length must be a multiple of 4, yours is " + data.length)
    const arr = []
    for(let i = 0; i < data.length;i++){
      arr[i] = data.charCodeAt(i)
    }
    const Uint16 = new Uint16Array(arr)
    const float64Arr = new Float64Array(Uint16.buffer)
    let result = float64Arr[0];
    if(float64Arr.length > 1)result = [].slice.call(float64Arr);
    return result
  }
}


/*
//Example:
let squisher = new FloatSquish(64)
let shrunk = squisher.squish([10,1.7976931348623157e+308
,83275.2342])
let stretch = squisher.unsquish(shrunk)
console.log(shrunk)
console.log(stretch)

*/
