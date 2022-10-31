

class ServerConnection {
  constructor(port) {
    // this.channel = AblyRealtime.channels.get(this.channelName)
    // this.userid = JSON.parse(window.sessionStorage.GameData).userid
    this.port = port
    this.socket = io(port);
    this.selfListening = false;
    this.members = {};
    this.dataQueue = [];
    this.preUpdate = {};
    this.updateEvery = 50;
    this.connected = false;
    this.gameEvents = {}

    this.messageTypes = {
      'server': (message) => {
        console.log(message);
        switch(message){
          case "game-start":
            if(this.gameEvents["start"]){
              this.gameEvents["start"]()
              this.gameStatus == "loadinggame"
            }
            break;
          case "game-begin":
            this.gameStatus = "ingame"
            if(this.gameEvents["begin"]){
              this.gameEvents["begin"]()
            }
            break
        }
        //recive messages about when game is starting
        //?somewhere else send game events like if they touched end point?
      },
      'player-join': (data) => {
        console.log(data)
        // const character = this.gameLoader.loadModel(data.data, true);
        this.members[data.id] = {
          model: data.data.model
        };
      },
      'player-set-data' : (data)=>{
        let id;
        ({id, data} = data);
        if(this.members[id]){
          this.members[id].model = data.model
        }
        console.log(this)
      },
      'player-update': (message) => {
        let {updates, id} = message;
        for(let i = 0; i < updates.length;i ++){
          const type = updates[i].type;
          const data = updates[i].data;
          if(type == 'transformation' && this.gameStatus == "ingame"){
            let char = this.members[id];
            char.body.position.set(parseFloat(data[1][0]),parseFloat(data[1][1]),parseFloat(data[1][2]));
            let parsedQuat = []
            for(let n in data[0]){
              parsedQuat[n] = (data[0][n].charCodeAt(0)-this._encryptStart)/this._encryptPrecision
            }
            // console.log(parsedQuat,data)
            char.body.quaternion.set(parsedQuat[0],parsedQuat[1],parsedQuat[2],parsedQuat[3]).normalize();
          }
        }
      },
      'server-response': (data) => {
        const gamecodeDisplay = document.getElementById('gamecode-display');
        if (data.state == 'host') {
          const code = data.code;
          this.server = true
          this.gameStatus = "pregame"
          gamecodeDisplay.innerText = "server code ^_^: " + code;
          if(this.gameEvents["room-hosted"])this.gameEvents["room-hosted"]()
        } else if (data.state === 'join') {
          if (data.status == 1) {
            gamecodeDisplay.innerText = "yayy, you connected to server ^-^";
            this.gameStatus = "pregame"
            // console.log(data)
            for(let i = 0; i < data.members.length;i++){
              const member = data.members[i]
              console.log(member)
              this.members[member.id] = {
                model: member.data.model
              };
            }
            if(this.gameEvents["room-joined"])this.gameEvents["room-joined"]()
          } else {
            gamecodeDisplay.innerText = "-_- noooo, " + data.info;
            console.log(data);
          }
        }
      }
    };

    this._encryptStart = 6656
    this._encryptEnd = 6912
    this._encryptPrecision = this._encryptEnd - this._encryptStart

    this.connect();
  }
  connect() {
    if (this.listening) return;

    console.log(new Date().toUTCString());
    this.connected = true;
    const self = this;//in callbacks use SELF instead of THIS
    this.socket.on('connection', (socket) => {
      console.log('connected to ws');
      this.connected = true
      //not fired bc this is registered after connection
    });
    for (let type in this.messageTypes) {
      this.socket.on(type, message => {
        this.messageTypes[type](message);
      });
    }
    this.intervalId = setInterval(()=>{// call on game start?
      this.update()
    },this.updateEvery)
    this.listening = true;
  }
  disconnect() {
    clearInterval(this.intervalId);
    if (this.listening) {

      // for(let i in this.members){
      //     const member = this.members[i]
      //     Game.scene.remove(member)
      // }
    }
  }
  setTransSending(bool,character){
    if(bool && !this.transSending){
      this.addPreUpdateListener('transSending',() => {
        const cD = {
            q: [
              character.body.quaternion.x,
              character.body.quaternion.y,
              character.body.quaternion.z,
              character.body.quaternion.w
            ],
            p: [
              (character.body.position.x).toFixed(2),
              (character.body.position.y).toFixed(2),
              (character.body.position.z).toFixed(2)
            ]
        }
        let smallQuat = ""
        for (let i in cD.q){
          smallQuat += String.fromCharCode(Math.round(cD.q[i]*this._encryptPrecision)+this._encryptStart)
        }
        // console.log(smallQuat)
        this.queueUpData({
          type: 'transformation',
          data: [smallQuat,cD.p]
        })
      });
      this.transSending  = true;
    } else if(this.transSending){
      this.removePreUpdateListener('transSending')
      this.transSending = false;
    }
  }
  addGameEventListenser(event,foo){
    this.gameEvents[event] = foo
  }
  hostServer(){
    this.send('host-server', {
      servertype: 1,
      private: true,
    });
  }
  joinServer(code){
    this.send('join-server', {
      code
    });
  }
  send(type, message) {
    this.socket.emit(type, message);
    // type,message
  }
  queueUpData(message) {
    this.dataQueue.push(message);
  }
  addPreUpdateListener(name, foo) {
    this.preUpdate[name] = foo;
  }
  removePreUpdateListener(name) {
    delete this.preUpdate[name];
  }
  update(message) {
    if (this.connected == false) return;
    if (message) this.dataQueue.push(message);
    for (let i in this.preUpdate) {
      this.preUpdate[i]();
    }
    if (this.dataQueue.length == 0) return;
    // console.log(this.dataQueue)
    this.send('player-update', this.dataQueue);
    this.dataQueue = [];
  }
}

function shallowClone(obj){ 
  const clone = {}
  for (let i in obj)clone[i] = obj[i]
  return clone
}

export { ServerConnection };