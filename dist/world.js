import * as THREE from "https://unpkg.com/three@0.141.0/build/three.module.js";
import { GameLoader } from "./game-resources/GameLoader.js";
import { GameMechanics } from "./game-resources/GameMechanics.js";

class World {
  constructor() {
    this.renderer = new THREE.WebGLRenderer;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.universalClock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.scene = new THREE.Scene();
    this._renderClock = new THREE.Clock();
    this._systems = [];
    this._callOnRender = [];

    const element = this.renderer.domElement;
    element.onmousedown = (e) => this.onMouseInput("DOWN", e, "MOUSE", element);
    element.onmouseup = (e) => this.onMouseInput("UP", e, "MOUSE", element);
    element.onmousemove = (e) => this.onMouseInput("MOVE", e, "MOUSE", element);
    element.ontouchstart = (e) => this.onMouseInput("DOWN", e, "TOUCH", element);
    element.ontouchmove = (e) => this.onMouseInput("MOVE", e, "TOUCH", element);
    document.onkeydown = (e) => this.onKeyInput("DOWN", e);
    document.onkeyup = (e) => this.onKeyInput("UP", e);

    this.InputTable = {
      mouse: false,
      mousedelta: [0, 0],
      mousepos: [0, 0],
      w: false,
      a: false,
      s: false,
      d: false,
      e: false,
      q: false,
      shift: false,
      " ": false
    };
    this.mouseLocked = false;

    this.onGameLoad = []
  }
  onKeyInput(type, e) {
    const key = e.key.toLowerCase();
    if (type == "DOWN") {
      if (this.InputTable[key] != null) this.InputTable[key] = true;
    } else if (type == "UP") {
      if (this.InputTable[key] != null) this.InputTable[key] = false;
    }
  }
  onMouseInput(type, e, itype, element) {
    if (type == "DOWN") {
      this.InputTable.mouse = true;
      if (itype == "MOUSE" && element.requestPointerLock) {
        // if(CannonMoveCharacter){PointerControls.lock()}else{
        element.requestPointerLock();
        // }
      } else if (itype == "MOUSE" && element.mozRequestPointerLock) {
        element.mozRequestPointerLock();
      }
      if (itype == "TOUCH") {
        this.InputTable.mousepos = [e.touches[0].pageX, e.touches[0].pageY];
      }
    } else if (type == "UP") {
      this.InputTable.mouse = false;
    } else if (type == "MOVE") {
      if (itype == "TOUCH") {
        e.x = e.touches[0].pageX;
        e.y = e.touches[0].pageY;
      }
      this.mouseLocked = document.pointerLockElement === element ||
        document.mozPointerLockElement === element;
      let mpos = [e.x, e.y];
      let mdelta;
      if (itype == "MOUSE") {
        mpos = [this.InputTable.mousepos[0] + e.movementX, this.InputTable.mousepos[1] + e.movementY];
      }
      mdelta = [mpos[0] - this.InputTable.mousepos[0], mpos[1] - this.InputTable.mousepos[1]];
      this.InputTable.mousedelta[0] = e.movementX;//+= mdelta[0];
      this.InputTable.mousedelta[1] = e.movementY;//+= mdelta[1];
      this.InputTable.mousepos = mpos;
    }
  }
  _animate(t) {
    requestAnimationFrame((t) => {
      if (this._previousRAF == null) {
        this._previousRAF = t;
      }
      this._onrender(t - this._previousRAF);
      this.renderer.render(this.scene, this.camera);
      this._previousRAF = t;
    }); 
  }
  _onrender(ms) {
    const secs = ms / 1000;
    for (let i = 0; i < this._systems.length; i++) {
      if(this._systems[i].step)this._systems[i].step(secs)
    }
    for (let i = 0; i < this._callOnRender.length; i++){
      this._callOnRender[i](secs)
    }
    this._animate();
  }
  add(object) {
    this.scene.add(object);
  }
  addSystem(system){
    this._systems.push(system)
  }
  remove(object) {
    this.scene.remove(object);
  }
  loadGame(game) {
    const loader = new GameLoader(game,this)
    const self = this;
    loader.gameLoading.then(()=>{
      if(self.initiatingGame){
        this.mechanics = new GameMechanics(self)
      }
      for (let i in this.onGameLoad){
        this.onGameLoad[i]()
      }
      // this.onGameLoad = null
    })
    
    // console.log(self.currentGame)
    // (async ()=>{
    //   //AWAIT LOADED PROMISE, THEN CONTINUE AND INIT GAME IF READY
      
    //   await loader.gameLoading()
    //   if(self.initiatingGame){
    //     this.mechanics = new GameMechanics(self)
    //   }
    // })()
    return this.currentGame = loader
  }
  addGameLoadListener(foo){
    this.onGameLoad.push(foo)
  }
  initGame(){
    if (this.gameLoaded){
      this.mechanics = new GameMechanics(this)
    }else{
      this.initiatingGame = true
    }
    
  }
}

export { World };