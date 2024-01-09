import * as THREE from "three";
import * as CANNON from 'cannon';
import { Toolbar } from '/chefrun/dist/game-resources/Toolbar.js';
import * as Tools from '/chefrun/dist/game-resources/Tools.js';

class GameMechanics {
  constructor(world) {
    // setTimeout(()=>{
    this.world = world;
    const game = world.currentGame;
    const CannonWorld = game.CannonWorld;
    this.initCharacterMechanics();
    this.character.body.position.y = 100000;
    CannonWorld.addBody(this.character.body);
    this.character.body.position.copy(game.checkPoints[0].position).y += 1;
    this.character.body.material = game.materials.cannon.character;
    // setTimeout(()=>{
    world._callOnRender.push((delta) => {
      CannonWorld.step(1 / 60, delta);
    });
    // },500)
    let light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 0, 0);
    // console.log(light)
    light.distance = 10;
    light.castShadow = true; // default false
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 10;
    light.shadow.camera.right = 10;
    light.shadow.camera.left = -10;
    light.shadow.camera.top = 10;
    light.shadow.camera.bottom = -10;
    light.shadow.mapSize.width = 64;
    light.shadow.mapSize.height = 64;
    // this.character.mesh.add(light);

    this.cameraSense = 1;
    this.cameraLock = false;
    this.ThirdPerson = true;
    this.cameraOffset = new THREE.Vector2(1, 1);
    this.cameraTargetOffset = new THREE.Vector3(0, 0, 0);
    this.lastOffsetPercent = 0.9;
    this._Toolbar = new Toolbar(world);
    this._Toolbar.addTool("grab", new Tools.Grab("e"));
    world.addSystem(this._Toolbar);

    world._animate();
    // },1)
  }
  initCharacterMechanics() {
    const world = this.world;
    const loader = world.currentGame;
    const gameData = loader.jsonData;
    const charData = gameData.character;

    // const scene = world.scene;
    const character = loader.character;
    this.character = character;
    character.canSprint = true

    character.walkSpeed = charData.walkSpeed || 10;
    character.sprintSpeed = charData.sprintSpeed || 20;
    character.jumpPower = charData.jumpPower || 15;
    character.checkPoint = 0;

    character.Speed = character.walkSpeed;


    this._lon = 0;
    this._lat = 0;
    this._theta = 0;
    this._phi = 0;
    this._targetLook = new THREE.Vector3();
    this._targetPosition = new THREE.Vector3();

    this._CanFloorCast = new CANNON.Ray();
    this._raycastResult = new CANNON.RaycastResult();
    this._wallCaster = new THREE.Raycaster();
    this._excludeCaster = new THREE.Raycaster();

    world.addInputEventListener("c",this.onCameraLockKey)
    // console.log(loader._excludeHullMeshes)
  }
  onCameraLockKey(){
    this.cameraLock = !this.cameraLock
  }
  step(deltatime) {
    const world = this.world;
    const loader = world.currentGame;
    const CannonWorld = loader.CannonWorld;
    const character = loader.character;
    const camera = world.camera;

    let lon = this._lon;
    let lat = this._lat;
    let theta = this._theta;
    let phi = this._phi;
    const targetLook = this._targetLook;
    const targetPosition = this._targetPosition;

    const CanFloorCast = this._CanFloorCast;
    const raycastResult = this._raycastResult;
    const wallCaster = this._wallCaster;
    const excludeCaster = this._excludeCaster;
    camera.position.copy(character.mesh.position);

    targetPosition.copy(targetLook.add(camera.position));
    if ((world.InputTable.mouse || world.mouseLocked) && (this._Toolbar._cameraLocked != true) && this.cameraLock == false) {
      lon -= (world.InputTable.mousedelta[0] * this.cameraSense);
      lat -= (world.InputTable.mousedelta[1] * -this.cameraSense); //* actualLookSpeed * verticalLookRatio;
      lat = Math.max(- 8, Math.min(89, lat));
      // lon = Math.max(0,lon)
      // console.log(lat)
      phi = radians(90 - lat);
      theta = radians(lon);

      targetLook.setFromSphericalCoords(-1, phi, theta);
      camera.lookAt(targetPosition);
      world.InputTable.mousedelta[0] = 0;
      world.InputTable.mousedelta[1] = 0;
    }
    camera.theta = theta;

    let moveDis = -character.Speed * deltatime;
    let sphericalCoords = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
    targetLook.copy(sphericalCoords);
    targetLook.y = 0;

    character.mesh.lookAt(targetPosition);

    CanFloorCast.hasHit = false;
    CanFloorCast.from = new CANNON.Vec3().copy(character.body.position.vadd(new CANNON.Vec3(0, 0.1, 0)));
    CanFloorCast.to = new CANNON.Vec3(0, -character.body.boundingRadius * 1.2, 0).vadd(character.body.position);

    raycastResult.reset();
    CannonWorld.removeBody(character.body);
    const floorHit = CanFloorCast.intersectWorld(CannonWorld, { mode: 1, skipBackFaces: false, result: raycastResult });
    character.body.floorHit = floorHit;
    character.body.floorHitResult = raycastResult;
    CannonWorld.addBody(character.body);

    if (character.colliding) {
      moveDis = -character.Speed / deltatime;
      if (this.ThirdPerson) moveDis *= -1;
      character.walking = false;

      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(character.mesh.quaternion);
      const right = new THREE.Vector3(-1, 0, 0).applyQuaternion(character.mesh.quaternion);
      // moveDis *= 20;
      const yVel = character.body.velocity.y;
      character.body.velocity.y = 0;
      if (world.InputTable.w) { character.body.velocity.vadd(forward.multiplyScalar(moveDis), character.body.velocity); character.walking = true; }
      if (world.InputTable.a) { character.body.velocity.vadd(right.multiplyScalar(moveDis), character.body.velocity); character.walking = true; }
      if (world.InputTable.s) { character.body.velocity.vadd(forward.multiplyScalar(-moveDis), character.body.velocity); character.walking = true; }
      if (world.InputTable.d) { character.body.velocity.vadd(right.multiplyScalar(-moveDis), character.body.velocity); character.walking = true; }
      if (character.walking) {
        character.body.velocity.normalize();
        character.body.velocity.scale(character.Speed, character.body.velocity);
        character.body.velocity.y = yVel;
      }
      if (world.InputTable[" "] && (floorHit || (character.wallClimbing))) {
        character.body.velocity.y = character.jumpPower;
        character.jumping = true;
      } else if (floorHit) {
        character.jumping = false;
      }
      if (character.body.position.distanceTo(character.body.previousPosition) > 0.1) {
        character.recentlyMoved = true;
      } else {
        character.recentlyMoved = false;
      }
    }
    if (world.InputTable["shift"] && floorHit && character.canSprint) {
      character.Speed = character.sprintSpeed;
    } else if (floorHit) {
      character.Speed = character.walkSpeed;
    }
    // if(floorHit&&character.walking){
    //     if(world.InputTable["shift"]){
    //         character.animStatus = 'running'
    //     }else{
    //         character.animStatus = 'walking'
    //     }
    // }else{
    //     if(floorHit)character.animStatus = 'idle'
    // }
    if (character.body.position.y < loader.settings.yLevel) {
      const cPoint = loader.checkPoints[character.checkPoint];
      character.body.position.copy(cPoint.position).y += 1;
      character.body.velocity.set(0, 0, 0);
      character.body.angularVelocity.set(0, 0, 0);
      character.body.quaternion.set(0, 0, 0, 1);
    }
    if (this.ThirdPerson) {
      // const disAbove = this.cameraOffset.x;
      // const disOut = this.cameraOffset.y;
      const dis = this.cameraOffset.length();

      const lookVec = sphericalCoords.clone();
      // const camPos = lookVec.clone().multiplyScalar(disOut*this.lastOffsetPercent).add(character.mesh.position).add(upVec.clone().multiplyScalar(disAbove*this.lastOffsetPercent));
      const camPos = lookVec.multiplyScalar(this.lastOffsetPercent * dis).add(character.mesh.position.clone().add(this.cameraTargetOffset));
      // console.log(sceneChildren)
      wallCaster.set(character.mesh.position.clone(), camPos.clone().sub(character.mesh.position).normalize());
      excludeCaster.set(character.mesh.position.clone(), camPos.clone().sub(character.mesh.position).normalize());
      // debug.position.copy(wallCaster.ray.origin.clone().add(new THREE.Vector3(0,0,0)).add(wallCaster.ray.direction.clone().multiplyScalar(Date.now()%1000)))
      let sceneChildren = [...this.world.scene.children];
      let mesh = character.mesh.getObjectByProperty("type", "SkinnedMesh") || character.mesh;
      sceneChildren = sceneChildren.filter(child => (child != character.mesh && child != mesh && child.layers != undefined && !child.opaque));
      let intersects = wallCaster.intersectObjects(sceneChildren);
      // console.log(loader._excludeHullMeshes)
      // console.log(loader._excludeHullMeshes.length)
      let excludeIntersects = excludeCaster.intersectObjects(loader._excludeHullMeshes);
      if (intersects.length > 0) {
        let distance = intersects[0].distance;
        let percent = distance / dis;
        if (excludeIntersects.length > 0 && excludeIntersects[0].distance < distance) percent = 1.02;
        if (percent < 1.01) {
          percent = (this.lastOffsetPercent * 0.8 + percent * 0.2);
          this.lastOffsetPercent = percent;
          // camPos.copy(sphericalCoords.clone().multiplyScalar(disOut*percent).add(character.mesh.position).add(upVec.multiplyScalar(disAbove*percent)));
        } else {
          this.lastOffsetPercent = (this.lastOffsetPercent * 0.8 + 0.2);
        }
      } else {
        this.lastOffsetPercent = (this.lastOffsetPercent * 0.8 + 0.2);
      }
      mesh.material.transparent = false;
      mesh.material.opacity = 1;
      if (this.lastOffsetPercent < mesh.geometry.boundingSphere.radius / 30) {
        mesh.material.transparent = true;
        mesh.material.opacity = 0;
      };

      camera.position.copy(camPos);

      camera.lookAt(character.mesh.position.clone().add(this.cameraTargetOffset));
    } else {
      camera.position.copy(character.mesh.position);
    }
    character.mesh.quaternion.copy(character.body.quaternion);
    character.colliding = false;

    // if(character.currentAnimation == undefined)return;
    // switch(character.animStatus){

    //     case 'walking':
    //         // print(character.currentAnimation.paused,character.currentAnimation.isRunning())
    //         if(character.currentAnimation.paused){
    //             character.currentAnimation.paused = false
    //         }
    //         character.currentAnimation.timeScale = 1
    //         character.currentAnimation.play()
    //         break;
    //     case 'running':
    //         character.currentAnimation.timeScale = 2
    //         break;
    //     case 'idle':
    //         character.currentAnimation.paused = true
    //         break;
    //     case 'falling':
    //         break;
    // }
    this._lon = lon;
    this._lat = lat;
    this._theta = theta;
    this._phi = phi;
  };
}

var radians = function (deg) {
  return deg * Math.PI / 180;
};
var degrees = function (rad) {
  return rad * 180 * Math.PI;
};

export { GameMechanics };