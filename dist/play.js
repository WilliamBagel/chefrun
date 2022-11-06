import { ServerConnection } from './game-resources/ServerConnection.js';
import { TestGame } from './games/KitchenTest.js';
import { World } from "./world.js";
import { PortEncrypt } from './game-resources/PortEncrypt.js';
import { ref } from 'vue';

const portEncrypt = new PortEncrypt();
var MyConnection;
var gameLoad;

function init(character) {
  const world = new World();
  TestGame.character.model = character;
  gameLoad = world.loadGame(TestGame);
  window.game = gameLoad;
  world.initGame();
  world.addGameLoadListener(() => {
    const members = MyConnection.members;
    for (let i in members) {
      let data = members[i];
      let folder = {};
      folder.model = data.model;
      folder.position = gameLoad.jsonData.character.position;
      folder.size = gameLoad.jsonData.character.size;
      folder.mass = gameLoad.jsonData.character.mass || 20;
      console.log(data, folder);
      let res = gameLoad.loadModel(folder, true);
      data.mesh = res.mesh;
      data.body = res.body;
    }
    MyConnection.send("set-player-status", "ready");
    MyConnection.addGameEventListenser('begin', () => {
      MyConnection.setTransSending(true, gameLoad.character);
    });
  });
};

const PlayerList = ref({});
const ServerPort = ref("");
const GameCode = ref("");
const PlayerName = ref("")
const Character = ref("Rat");
const GamecodeDisplay = ref("you have no code x_x");
const GameRole = ref(undefined)
const Page = ref("connect-choice")
const ConnectType = ref(undefined)
const GameRooms = ref([])
const Warn = ref("")


const SetServerPort = ref(() => {
  if(MyConnection)return
  let port;
  if (ConnectType.value == "global") {
    port = "https://chefrun.azurewebsites.net";
  } else if (ConnectType.value == "local") {
    port = portEncrypt.decrypt(ServerPort.value) + ":3000";
  } else {
    return
  }
  console.log(port)
  MyConnection = new ServerConnection(port);
  MyConnection.addGameEventListenser("game-rooms-update",(rooms)=>{
    GameRooms.value = rooms
  })
  MyConnection.addGameEventListenser("start", () => {
    Page.value = "game"
    init(Character.value);
  });
  window.MyConnection = MyConnection;
});
const SetCharacter = ref(() => {
  if (MyConnection && MyConnection.gameStatus == "pregame") MyConnection.send('set-player-data', { model: Character.value });
});
function connectPlayerData(){
  if(MyConnection){
    // PlayerList.value = MyConnection.members
    const update = ()=>{
      let list = []
      let name,model;
      for( let i in MyConnection.members){
        ({name,model} = MyConnection.members[i])
        list.push({name,model})
      }
      PlayerList.value = list
    }
    update()
    MyConnection.addGameEventListenser('player-data-update',update)
  }
}
let lastWarn = false
function checkName(){
  if(PlayerName.value == ''){
    Warn.value = "Please enter a name"
    let time = Date.now()
    lastWarn = time
    setTimeout((time)=>{
      if(lastWarn == time){
        Warn.value = ""
      }
    },2000,time)
    return false
  }
  return true
}
const HostRoom = ref(() => {
  if (MyConnection && checkName()) {
    MyConnection.hostServer();
    MyConnection.addGameEventListenser("room-hosted", (code) => {
      console.log(code)
      GamecodeDisplay.value = "server code ^_^: " + code;
      GameRole.value = "host"
      Page.value = "lobby"
      connectPlayerData()
      MyConnection.send('set-player-data', { name:PlayerName.value, model: Character.value });
    });
  }
});
const JoinRoom = ref((code) => {
  if (MyConnection && checkName()) {
    MyConnection.joinServer(code);
    MyConnection.addGameEventListenser("room-joined", () => {
      Page.value = "lobby"
      GamecodeDisplay.value = "yayy, you connected to server ^-^";
      GameRole.value = "player"
      connectPlayerData()
      MyConnection.send('set-player-data', { name: PlayerName.value, model: Character.value });
    });
  }
});
const StartGame = ref(() => {
  if (MyConnection && MyConnection.server == true) {
    MyConnection.send("host-message", "game-start");
  }
});

export {
  PlayerList,
  ServerPort,
  SetCharacter,
  HostRoom,
  StartGame,
  JoinRoom,
  SetServerPort,
  GameCode,
  GamecodeDisplay,
  Character,
  GameRole,
  Page,
  ConnectType,
  PlayerName,
  GameRooms,
  Warn
};