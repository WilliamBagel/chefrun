const form = document.getElementById("loginform")
const uElem = document.getElementById("username-input")
const pElem = document.getElementById("password-input")
const uFElem = document.getElementById("username-feedback")
const pFElem = document.getElementById("password-feedback")

form.addEventListener('submit',signup)

const sessionStorage = this.sessionStorage

function signup(e){
    e.preventDefault();
    const username = uElem.value
    const password = pElem.value
    uFElem.innerText = ""
    pFElem.innerText = ""
    uFElem.className = "feedback-hidden"
    pFElem.className = "feedback-hidden"
    post("http://localhost:7071/api/createaccount",{username,password})
}

let sendingRequest = false
post = function(url, data) {
    if(sendingRequest){
        pFElem.innerText = "PLEASE WAIT"
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false; // SOLUTION False not True
    
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            //xhr resolved
            const res = JSON.parse(this.responseText)//JSON.parse(this.responseText)
            console.log(res,typeof(res));
            if(res.Created){
                pFElem.innerText = "Account Succesfully Created\n";
                pFElem.className = "feedback-valid";
                window.location = "signin.html";
            }else{
                if(res.Code == 1){
                    pFElem.className = "feedback-invalid";
                    pFElem.innerText = "Get Request Error, this shouldn't happen\n";
                }else if(res.Code == 2){
                    uFElem.className = "feedback-invalid";
                    uFElem.innerText = "Username already taken\n";
                }
            }
            sendingRequest = false
        }
    });
    
    xhr.open('POST', url);
    xhr.setRequestHeader("content-type","text/plain")
    xhr.send(JSON.stringify(data));
    sendingRequest = true
}