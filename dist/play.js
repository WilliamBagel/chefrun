import { ServerConnection } from './game-resources/ServerConnection.js';
import { TestGame } from './games/KitchenTest.js';
import { World } from "./world.js";
import { PortEncrypt } from './game-resources/PortEncrypt.js';

const portEncrypt = new PortEncrypt()
var MyConnection;
var gameLoad;

function init(character) {
  const world = new World();
  TestGame.character.model = character
  gameLoad = world.loadGame(TestGame); 
  window.game = gameLoad
  world.initGame()
  world.addGameLoadListener(()=>{
    const members = MyConnection.members
    for (let i in members){
      let data = members[i]
      let folder = {}
      folder.model = data.model
      folder.position = gameLoad.jsonData.character.position
      folder.size = gameLoad.jsonData.character.size
      folder.mass = gameLoad.jsonData.character.mass || 20
      console.log(data,folder)
      let res = gameLoad.loadModel(folder,true)
      data.mesh = res.mesh
      data.body = res.body
    }
    MyConnection.send("set-player-status","ready")
    MyConnection.addGameEventListenser('begin',()=>{
      MyConnection.setTransSending(true,gameLoad.character)
    })
  })
}

document.getElementById('set-server-port').addEventListener('click', () => {
  let port = document.getElementById('server-port').value
  if(port == "global"){
    port = "https://chefrun.azurewebsites.net"
  }else{
    port = portEncrypt.decrypt(port) + ":3000"
  }
  MyConnection = new ServerConnection(port,gameLoad);
  MyConnection.addGameEventListenser("start",()=>{
    init(document.getElementById('character-selector').value)
  })
  window.MyConnection = MyConnection
});
document.getElementById('character-selector').addEventListener('change',(event)=>{
  if(MyConnection && MyConnection.gameStatus == "pregame")MyConnection.send('set-player-data',{model: document.getElementById('character-selector').value})
})
document.getElementById('host-room').addEventListener('click', () => {
  if (MyConnection){
    MyConnection.hostServer()
    MyConnection.addGameEventListenser("room-hosted",()=>{
      MyConnection.send('set-player-data',{model: document.getElementById('character-selector').value})
    })
  }
});
document.getElementById('start-game').addEventListener('click', () => {
  if (MyConnection && MyConnection.server == true){
    MyConnection.send("host-message","game-start")
  }
});
document.getElementById('join-room').addEventListener('click', () => {
  if (MyConnection){
    MyConnection.joinServer(document.getElementById('server-code').value)
    MyConnection.addGameEventListenser("room-joined",()=>{
      MyConnection.send('set-player-data',{model: document.getElementById('character-selector').value})
    })
  }
});
// document.getElementById('update-presence').addEventListener('click', () => {
//   if (MyConnection) {
    
//   }
// });