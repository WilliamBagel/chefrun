import { ServerConnection } from './game-resources/ServerConnection.js';
import { TestGame } from './games/KitchenMap1.js';
import { World } from "./world.js";
import { PortEncrypt } from './game-resources/PortEncrypt.js';
import { ref } from 'vue';
import { RatMechanics } from './game-resources/RatMechanics.js';
import { LerpController } from './game-resources/LerpController.js';

const portEncrypt = new PortEncrypt();
var MyConnection;
var MyData = {};
window.MyData = MyData;
var gameLoad;

function init(character) {
  const world = new World();
  TestGame.character.model = character;
  gameLoad = world.loadGame(TestGame);
  window.game = gameLoad;
  world.initGame();
  world.addGameLoadListener(() => {
    gameLoad.character.body.isCharacter = true;
    const members = MyConnection.members;
    const connectedObjects = gameLoad.getConnectedObjects();
    connectedObjects[MyConnection.id] = gameLoad.character.body;
    for (let i in connectedObjects){const elem = connectedObjects[i]; elem.lerpController = new LerpController(elem, 'b'); world.addSystem(elem.lerpController); };
    MyConnection.setConnectedObjects(connectedObjects);
    if (game.character.ratMechanics) {
      const animatedObjects = [[MyConnection.id, gameLoad.character.ratMechanics]];
      MyConnection.setAnimatedObjects(animatedObjects);
    }
    for (let i in members) {
      let data = members[i];
      let folder = {};
      folder.model = data.model;
      folder.position = gameLoad.jsonData.character.position;
      folder.size = gameLoad.jsonData.character.size;
      folder.mass = gameLoad.jsonData.character.mass || 20;
      console.log(data, folder);
      let res = gameLoad.loadModel(folder, true);
      if (data.model.search("Rat") != -1) {
        const ratMechs = new RatMechanics(false, res);
        world.addSystem(ratMechs);
        MyConnection._animatedObjects.push([data.id, ratMechs]);
      }
      res.body.lerpController = new LerpController(res.body, 'b');
      world.addSystem(res.body.lerpController);
      MyConnection.setMemberModel(data.id, res);
    }
    MyConnection.send("set-player-status", "ready");
    MyConnection.addGameEventListenser('begin', () => {
      MyConnection.setTransSending(true);
      MyConnection.setAnimSending(true);
    });
  });
};

const PlayerList = ref({});
const ServerPort = ref("");
const GameCode = ref("");
const PlayerName = ref("");
const Character = ref("Potato");
const GamecodeDisplay = ref("you have no code x_x");
const GameRole = ref(undefined);
const Page = ref("connect-choice");
const ConnectType = ref(undefined);
const GameRooms = ref([]);
const Warn = ref("");
const Confirm = ref("");
const IsPrivate = ref(true);


const SetServerPort = ref(() => {
  if (MyConnection) return;
  let port;
  if (ConnectType.value == "global") {
    port = "https://chefrun.azurewebsites.net";
  } else if (ConnectType.value == "local") {
    port = "http://" + portEncrypt.decrypt(ServerPort.value) + ":3000";
  } else {
    return;
  }
  MyConnection = new ServerConnection(port);
  confirm("connecting...");
  MyConnection.addGameEventListenser('connected-to-server', () => {
    confirm("connected");
  });
  MyConnection.addGameEventListenser("game-rooms-update", (rooms) => {
    GameRooms.value = rooms;
  });
  MyConnection.addGameEventListenser("start", () => {
    Page.value = "game";
    init(Character.value);
    MyConnection.intervalId = setInterval(() => {// call on game start? yea
      MyConnection.update();
    }, 1000 / MyConnection.updateEvery);
  });
  window.MyConnection = MyConnection;
});
const SetCharacter = ref(() => {
  if (MyConnection && MyConnection.gameStatus == "pregame") {
    MyConnection.send('set-player-data', { model: Character.value });
    MyData.model = Character.value;
    updatePlayerList();
  }
});
const SetPrivateServer = ref(() => {
  if (MyConnection && MyConnection.gameStatus == "pregame" && MyConnection.server == true) MyConnection.send('set-game-data', { permission: IsPrivate.value ? 'private' : 'public' });
});
function updatePlayerList() {
  let { name, model, id } = MyData;
  let list = [{ name, model, id }];
  for (let i in MyConnection.members) {
    ({ name, model, id } = MyConnection.members[i]);
    list.push({ name, model, id });
  }
  PlayerList.value = list;
};
function connectGameEvents() {
  if (MyConnection) {
    MyData.id = MyConnection.id;
    // PlayerList.value = MyConnection.members
    const update = updatePlayerList;
    update();
    MyConnection.addGameEventListenser('player-data-update', update);
    MyConnection.addGameEventListenser('this-data-update', (model) => {
      Character.value = model;
    });
    MyConnection.addGameEventListenser('player-left', (player, id) => {
      if (player.mesh && player.body) {
        gameLoad.scene.remove(player.mesh);
        gameLoad.CannonWorld.removeBody(player.body);
      }
      delete MyConnection.members[id];
      update();
    });
    MyConnection.addGameEventListenser('disconnect', () => {
      Page.value = 'connection';
      PlayerList.value = [];
      GameRooms.value = [];
      update();
      warn("disconnected");
      MyConnection = undefined;
      SetServerPort.value();
      GameRole.value = "";
    });
  }
}
function checkName() {
  if (PlayerName.value == '') {
    warn("Please enter a name");
    return false;
  }
  return true;
}
let lastWarn = false;
function warn(value) {
  Warn.value = value;
  let time = Date.now();
  lastWarn = time;
  setTimeout((time) => {
    if (lastWarn == time) {
      Warn.value = "";
    }
  }, 2000, time);
}
let lastConfirm;
function confirm(value) {
  Confirm.value = value;
  let time = Date.now();
  lastConfirm = time;
  setTimeout((time) => {
    if (lastConfirm == time) {
      Confirm.value = "";
    }
  }, 2000, time);
}
const HostRoom = ref(() => {
  if (MyConnection && checkName()) {
    MyConnection.hostServer();
    MyConnection.addGameEventListenser("room-hosted", (code) => {
      MyConnection.send('set-game-data', { permission: IsPrivate.value ? 'private' : 'public' });
      GamecodeDisplay.value = /*"server code ^_^: " + */code;
      GameRole.value = "host";
      Page.value = "lobby";
      MyData.name = PlayerName.value;
      MyData.model = Character.value;
      connectGameEvents();
      MyConnection.send('set-player-data', { name: PlayerName.value, model: Character.value });
    });
  }
});
const JoinRoom = ref((code) => {
  if (MyConnection && checkName()) {
    MyConnection.joinServer(code);
    MyConnection.addGameEventListenser("room-joined", () => {
      Page.value = "lobby";
      GamecodeDisplay.value = code;//"yayy, you connected to server ^-^";
      GameRole.value = "player";
      MyData.name = PlayerName.value;
      MyData.model = Character.value;
      connectGameEvents();
      MyConnection.send('set-player-data', { name: PlayerName.value, model: Character.value });
    });
  }
});
const StartGame = ref(() => {
  if (MyConnection && MyConnection.server == true) {
    const rplayers = Object.keys(MyConnection.members);
    rplayers.push(MyConnection.id);
    const id = rplayers[Math.floor(Math.random() * rplayers.length)];
    console.log(id);
    MyConnection.send('host-set-player-data', { id, data: { model: "Rat" } });
    MyConnection.send("host-message", "game-start");
  }
});
const KickPlayer = ref((id) => {
  if (MyConnection && MyConnection.server == true && (MyConnection.members[id] != undefined || id == MyData.id)) {
    MyConnection.send("host-moderation", { type: "kick", id });
    if (id == MyData.id) confirm("you kicked yourself");
  }
});
const BackPage = ref(() => {
  if (Page.value == "connection") {
    Page.value = "connect-choice";
  } else if (Page.value == "lobby") {
    Page.value = "connection";
    if (MyConnection) {
      MyConnection.socket.disconnect();
      MyConnection.messageTypes['disconnect']();
    }
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
  Warn,
  Confirm,
  IsPrivate,
  SetPrivateServer,
  KickPlayer,
  BackPage
};