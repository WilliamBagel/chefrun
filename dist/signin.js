const form = document.getElementById("loginform")
const uElem = document.getElementById("username-input")
const pElem = document.getElementById("password-input")

form.addEventListener('submit',login)

const sessionStorage = this.sessionStorage

function login(e){
    e.preventDefault();
    const username = uElem.value
    const password = pElem.value
    console.log(username,password)
    post("http://localhost:7071/api/login",{username,password})
}

let sendingRequest = false
post = function(url, data) {
    if(sendingRequest)return;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false; // SOLUTION False not True
    
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            //xhr resolved
            const res = JSON.parse(this.responseText)//JSON.parse(this.responseText)
            // console.log(res,typeof(res));
            if(res.verified){
                res.data.username = data.username
                sessionStorage.GameData = JSON.stringify(res.data)
                delete sessionStorage.GameData.verified
                window.location = "play.html"
            }
            sendingRequest = false
        }
    });
    
    xhr.open('POST', url);
    xhr.setRequestHeader("content-type","text/plain")
    // xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
    // xhr.setRequestHeader("Accept-Encoding", "gzip, deflate, br");
    // xhr.setRequestHeader("cache-control", "max-age=0");
    // xhr.send(data,{mode: 'no-cors'});
    xhr.send(JSON.stringify(data));
    sendingRequest = true
}