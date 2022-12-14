import * as THREE from "three";
import * as CANNON from 'https://pmndrs.github.io/cannon-es/dist/cannon-es.js';

class GameMechanics {
  constructor(world) {
    // setTimeout(()=>{
    this.world = world;
    const game = world.currentGame;
    const CannonWorld = game.CannonWorld;
    this.initCharacterMechanics();
    this.character.body.position.y = 100000;
    // CannonWorld.removeBody(this.character.body)
    // setTimeout(()=>{
    CannonWorld.addBody(this.character.body);
    this.character.body.position.copy(game.checkPoints[0].position).y += 1;
    // },1000)
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
    light.shadow.mapSize.width = 612;
    light.shadow.mapSize.height = 612;
    this.character.mesh.add(light);

    world._animate();
    this.ThirdPerson = true;
    this.cameraOffset = new THREE.Vector2(1, 1);
    this.lastOffsetPercent = 0.9;
    // },1)
  }
  initCharacterMechanics() {
    const world = this.world;
    const loader = world.currentGame;
    const gameData = loader.jsonData;
    const charData = gameData.character;
    const CannonWorld = loader.CannonWorld;
    const camera = world.camera;
    // const scene = world.scene;
    const character = loader.character;
    this.character = character;

    character.walkSpeed = charData.walkSpeed || 10;
    character.sprintSpeed = charData.sprintSpeed || 20;
    character.jumpPower = charData.jumpPower || 15;
    character.checkPoint = 0;

    character.Speed = character.walkSpeed;


    let lon = 180;
    let lat = 0;
    let theta = 0;
    let phi = 0;

    const targetLook = new THREE.Vector3();
    const targetPosition = new THREE.Vector3();
    // const tmpObject = new THREE.Object3D();
    // let debug = new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshBasicMaterial({color:0xff0000}))
    // this.world.scene.add(debug)

    const CanFloorCast = new CANNON.Ray();
    const raycastResult = new CANNON.RaycastResult();
    const wallCaster = new THREE.Raycaster();
    loader.onrender = (deltatime) => {
      camera.position.copy(character.mesh.position);

      if (world.InputTable.mouse || world.mouseLocked) {
        lon -= (world.InputTable.mousedelta[0] * 0.4);
        lat -= (world.InputTable.mousedelta[1] * -0.4); //* actualLookSpeed * verticalLookRatio;
        lat = Math.max(- 85, Math.min(85, lat));
        phi = radians(90 - lat);
        theta = radians(lon);

        targetLook.setFromSphericalCoords(-1, phi, theta);
        targetPosition.copy(targetLook.add(camera.position));

        camera.lookAt(targetPosition);
        world.InputTable.mousedelta[0] = 0;
        world.InputTable.mousedelta[1] = 0;
      }
      camera.theta = theta;

      let moveDis = -character.Speed * deltatime;
      let sphericalCoords = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
      targetLook.copy(sphericalCoords);
      targetLook.y = 0;
      targetPosition.copy(targetLook.add(camera.position));
      character.mesh.lookAt(targetPosition);

      CanFloorCast.hasHit = false;
      CanFloorCast.from = new CANNON.Vec3().copy(character.body.position.vadd(new CANNON.Vec3(0,2,0)));
      CanFloorCast.to = new CANNON.Vec3(0, -this.character.body.boundingRadius*1.2, 0).vadd(character.body.position);

      raycastResult.reset();
      CannonWorld.removeBody(character.body);
      const floorHit = CanFloorCast.intersectWorld(CannonWorld, { mode: 1, skipBackFaces: false, result: raycastResult });
      character.body.floorHit = floorHit;
      character.body.floorHitResult = raycastResult;
      CannonWorld.addBody(character.body);

      if (character.colliding) {
        moveDis = -character.Speed * deltatime;
        if (this.ThirdPerson) moveDis *= -1;
        character.walking = false;

        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(character.mesh.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(character.mesh.quaternion);
        moveDis *= 20;
        const yVel = character.body.velocity.y;
        character.body.velocity.y = 0;
        if (world.InputTable.w) { character.body.velocity.vadd(forward.multiplyScalar(-moveDis), character.body.velocity); character.walking = true; }
        if (world.InputTable.a) { character.body.velocity.vadd(right.multiplyScalar(-moveDis), character.body.velocity); character.walking = true; }
        if (world.InputTable.s) { character.body.velocity.vadd(forward.multiplyScalar(moveDis), character.body.velocity); character.walking = true; }
        if (world.InputTable.d) { character.body.velocity.vadd(right.multiplyScalar(moveDis), character.body.velocity); character.walking = true; }
        if (character.walking) {
          character.body.velocity.normalize();
          character.body.velocity.scale(character.Speed, character.body.velocity);
          character.body.velocity.y = yVel;
        }
        if (world.InputTable[" "] && floorHit) {
          character.body.velocity.y = character.jumpPower;
          character.jumping = true;
        } else if (floorHit) {
          character.jumping = false;
        }

        character.body.touchingObjects = false;
        if (character.body.position.distanceTo(character.body.previousPosition) > 0.1) {
          character.recentlyMoved = true;
        } else {
          character.recentlyMoved = false;
        }
      }
      if (world.InputTable["shift"] && floorHit) {
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

        const upVec = new THREE.Vector3(0, 1, 0);
        const lookVec = sphericalCoords.clone();
        // const camPos = lookVec.clone().multiplyScalar(disOut*this.lastOffsetPercent).add(character.mesh.position).add(upVec.clone().multiplyScalar(disAbove*this.lastOffsetPercent));
        const camPos = lookVec.multiplyScalar(this.lastOffsetPercent * dis).add(character.mesh.position);
        let sceneChildren = [...this.world.scene.children];
        let mesh = character.mesh.getObjectByProperty("type","SkinnedMesh") || character.mesh 
        sceneChildren = sceneChildren.filter(child => (child != character.mesh && child != mesh && child.layers != undefined));
        // console.log(sceneChildren)
        wallCaster.set(character.mesh.position, camPos.clone().sub(character.mesh.position).normalize());
        // debug.position.copy(wallCaster.ray.origin.clone().add(new THREE.Vector3(0,0,0)).add(wallCaster.ray.direction.clone().multiplyScalar(Date.now()%1000)))
        let intersects = wallCaster.intersectObjects(sceneChildren);
        
        if (intersects.length > 0) {
          let distance = intersects[0].distance;
          let percent = distance / dis;
          if (percent < 1.01) {
            percent = (this.lastOffsetPercent * 0.8 + percent * 0.2) -0.05;
            this.lastOffsetPercent = percent;
            // camPos.copy(sphericalCoords.clone().multiplyScalar(disOut*percent).add(character.mesh.position).add(upVec.multiplyScalar(disAbove*percent)));
          }else{
            this.lastOffsetPercent = (this.lastOffsetPercent * 0.8 + 0.2);
          }
        } else {
          this.lastOffsetPercent = (this.lastOffsetPercent * 0.8 + 0.2);
        }
        mesh.material.transparent = false;
        mesh.material.opacity = 1
        if(this.lastOffsetPercent < mesh.geometry.boundingSphere.radius/30){
          mesh.material.transparent = true;
          mesh.material.opacity = 0;
        };

        camera.position.copy(camPos);

        camera.lookAt(character.body.position.x, character.body.position.y, character.body.position.z);
      } else {
        camera.position.copy(character.body.position);
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
    };
  }
}

var radians = function (deg) {
  return deg * Math.PI / 180;
};
var degrees = function (rad) {
  return rad * 180 * Math.PI;
};

export { GameMechanics };