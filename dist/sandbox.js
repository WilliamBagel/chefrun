let LOADERWORKS = false;
const myDirectory = 'https://williambagel.github.io/ThreeJsStuff/';
import * as THREE from "https://unpkg.com/three@0.141.0/build/three.module.js";//"https://threejs.org/build/three.module.js"; 
import * as CANNON from 'https://pmndrs.github.io/cannon-es/dist/cannon-es.js';
import * as SkeletonUtils from "https://threejs.org/examples/jsm/utils/SkeletonUtils.js";
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { ConvexGeometry } from 'https://unpkg.com/three@0.122.0/examples/jsm/geometries/ConvexGeometry.js';
import { SimplifyModifier } from 'https://threejs.org/examples/jsm/modifiers/SimplifyModifier.js';

import { ServerConnection } from './game-resources/ServerConnection.js';
import { TestGame } from './games/KitchenTest.js';
import { World } from "./world.js";

var MyConnection;
var gameLoad;

function init() {
  const world = new World();
  gameLoad = world.loadGame(TestGame);
  world.initGame()
  
}






//tween position over half of updatetime
// class PeerCharacter {
//     constructor(active = false,modelname){
//         const geo = new THREE.SphereGeometry()
//         const mat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide,color : 0xFF00FF,emission : 2})
//         this.threeMesh = new THREE.Mesh(geo,mat)
//         const fill = this.threeMesh
//         try{(function(){
//             if(Game.imports.models[modelname] == null)return console.log("Character model not loaded")
//             const group = Game.imports.models[modelname]
//             const scene = group.scene

//             const model = SkeletonUtils.clone(scene.getObjectByName('mesh'))
//             scene.add(model)
//             fill.geometry.computeBoundingSphere()
//             model.position.copy(new THREE.Vector3(0,-fill.geometry.boundingSphere.radius,0))
//             fill.add(model)
//             model.rotation.y = -Math.PI/2
//             fill.material.setValues({transparent: true,opacity:0})
//             fill.material.needsUpdate = true

//             //set position
//             //set rotation
//             //set scale
//             //add
//             //make animMixer
//             //set Anim

//         })()}catch(err){console.log(err)}

//         this.active = active
//     }
//     set position(pos){
//         // this.threeMesh.position.copy(pos)
//         this.tween({
//             type: 'position',
//             end: pos,
//         })
//         console.log('setting position')
//     }
//     set quaternion(quat){
//         // this.threeMesh.quaternion.copy(quat)
//         this.tween({
//             type: 'quaternion',
//             end: quat,
//         })
//     }
//     tween(options){
//         if(this.tweening)this.tweening = false
//         const type = (options.type == 'position' || options.type == 'quaternion')?options.type: console.error('set type for tween')
//         const end = options.end?(type == 'quaternion'?new THREE.Quaternion().copy(options.end):new THREE.Vector3().copy(options.end)):console.error('set end value')
//         const time = options.time || updateEvery/2
//         const resolution = options.resolution || 10
//         let start = this.threeMesh[type]
//         if(type == 'quaternion' && start._x == null)start = new THREE.Quaternion()

//         for(let x = 0; x < 1; x += 1/resolution){
//             setTimeout(()=>{
//                 type == 'position'?this.threeMesh.position.lerpVectors(start,end,x):this.threeMesh.quaternion.slerpQuaternions(start,end,x)
//             },time * x)
//         }
//         this.tweening  = true
//     }
//     set active(bool){
//         if(bool == true){
//             scene.add(this.threeMesh)
//             CannonWorld.addBody(this.cannonBody)
//         }else if(bool == false){
//             scene.remove(this.threeMesh)
//             CannonWorld.removeBody(this.cannonBody)
//         }
//     }
// }


// rat chef(random player) and food(players)
// CHEF
//  -iron mallet
//  -move obstacles
//  -turn on obstacles ex: stove
// FOOD
//  -customizable food
//  -get respawned at checkpoints  




/*
  -gameCreator via blender and custom properties
  -use sphere & box hulls instead of polyhedrons
  -make rat
  -make good html and stuff
  -find mesh based on custom properties which are a part of userdata?


    --<change presence messages to support mulitple types ex: trans, anim
    --<change connection to queue sending data
-handle disconnection
    --<make function to check server status

    --<setInterval for updating presence, store intervalId in object
  <>make startWorld seperate function && gameLoader
-implement borders, imports, convex hull, billboards, different pyhsic textures, more shapes, imported objects
-create assets: foods, cutting board, chairs, rat, chef hat
-game creator
-add stuff to game scene ex tables, room, 

FIX:
-checkPoints allow RayCasting
-shaders being on all sides
*/


// const myId = JSON.parse(window.sessionStorage.GameData).userid

document.getElementById('set-server-port').addEventListener('click', () => {
  const port = document.getElementById('server-port').value
  MyConnection = new ServerConnection(port,gameLoad);
});
document.getElementById('host-server').addEventListener('click', () => {
  if (MyConnection)MyConnection.hostServer()
});
document.getElementById('connect-server').addEventListener('click', () => {
  if (MyConnection)MyConnection.joinServer(document.getElementById('server-code').value)
});
document.getElementById('update-presence').addEventListener('click', () => {
  if (MyConnection) {
    MyConnection.setTransSending(true);
  }
});




init();