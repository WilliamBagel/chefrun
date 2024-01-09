import * as CANNON from 'cannon';
import * as THREE from 'three';

class Tool {
  constructor(keycode) {
    this.activateKey = keycode;
    this._enabled = false;
    this._inputEventListeners = [];
  }
  addInputEventListener(key, callback) {
    this._inputEventListeners.push({ key, callback });
  }
  toggle() {
    if (this._enabled) return this.disable();
    this.enable();
  }
  enable() {
    this._enabled = true;
    if (this.onEnable) this.onEnable();
  }
  disable() {
    this._enabled = false;
    if (this.onDisable) this.onDisable();
  }
  shouldEnable(input) {
    if (input[this.activateKey] == true) return true;
    return false;
  }
  step(ms) {
    if (this._enabled == false) return;
    if (this.safeStep) this.safeStep(ms);
  }
}

//seperate keybind for pointerlock
class GrabBase extends Tool {
  init() {
    this.world = this.toolbar.world;
    this.cannon = this.world.currentGame.CannonWorld;
    this.scene = this.world.scene;
    this.character = this.world.currentGame.character;

    this.speedDebuff = 0.9;
    this.range = 5;
    this.currentReach = this.range;
    this.grabForce = 10;
    this.launchForce = 10;
    this.bodyGrabbedLocalPosition = new CANNON.Vec3();

    this.objectRay = new CANNON.Ray();
    this.raycastResult = new CANNON.RaycastResult();

    this.bodyGrabbed = false;

    const selectionGeo = new THREE.SphereGeometry(0.03);
    const selectionMat = new THREE.MeshBasicMaterial({ color: new THREE.Color() });
    this.selectionMesh = new THREE.Mesh(selectionGeo, selectionMat);

    this.addInputEventListener("mousedown", this.onClick.bind(this));
  }
  safeStep(ms) {
    const { body } = this.character;
    const mouseWorldPosition = new THREE.Vector3(this.world.InputTable.mousepercent[0] * 2 - 1, this.world.InputTable.mousepercent[1] * -2 + 1, 0).unproject(this.world.camera);
    const mouseVector = mouseWorldPosition.clone().sub(this.world.camera.position);
    if (this.bodyGrabbed) {
      const camCharDif = this.world.camera.position.clone().sub(body.position);
      const bodyCharDif = new THREE.Vector3().copy(this.bodyGrabbed.position).sub(body.position);
      const currentReach = this.currentReach;
      if (bodyCharDif > this.range) return this.releaseBody();
      const targetLength = Math.sqrt(camCharDif.length() ** 2 + currentReach ** 2 - 2 * camCharDif.length() * currentReach * Math.cos(camCharDif.clone().angleTo(bodyCharDif.clone())));//this.character.position.clone().add(mouseVector.clone().multiplyScalar(this.currentReach))
      const targetPosition = this.world.camera.position.clone().add(mouseVector.clone().normalize().multiplyScalar(targetLength));
      this.selectionMesh.position.copy(targetPosition);
      this.bodyGrabbed.applyForce(targetPosition.sub(this.bodyGrabbed.position).multiplyScalar(this.bodyGrabbed.mass * this.grabForce)/*, this.bodyGrabbed.pointToLocalFrame(this.raycastResult.hitPointWorld)*/);

    } else if (this.bodyGrabbed == false) {
      this.objectRay.hasHit = false;
      this.world.camera.updateMatrixWorld();
      this.objectRay.from = new CANNON.Vec3().copy(this.world.camera.position);
      this.objectRay.to = new CANNON.Vec3().copy(this.world.camera.position.add(mouseVector.clone().multiplyScalar(20)));
      this.raycastResult.reset();
      this.cannon.removeBody(body);
      this.canGrab = this.objectRay.intersectWorld(this.cannon, { mode: 1, skipBackFaces: false, result: this.raycastResult });
      this.selectionMesh.position.copy(this.objectRay.to);
      this.scene.add(this.selectionMesh);
      this.cannon.addBody(body);
      if (this.raycastResult.hasHit) {
        this.selectionMesh.position.copy(this.raycastResult.hitPointWorld);
        const distancepercent = new THREE.Vector3().copy(this.raycastResult.hitPointWorld).sub(body.position).length() / this.range;
        let colorLerp = Math.min(1, Math.max(0, distancepercent));
        if (!this.validateBody(this.raycastResult.body)) colorLerp = 1;
        this.selectionMesh.material.color.lerpColors(new THREE.Color(0, 1, 0), new THREE.Color(1, 0, 0), colorLerp);
        this.scene.add(this.selectionMesh);
      } else {
        this.scene.remove(this.selectionMesh);
      }
    }
  }
  validateBody(body) {
    if (body.mass == 0 || body.type == CANNON.Body.STATIC) return false;
    return true;
  }
  grabBody() {
    console.log("Body Grabbed")
    if (!this.validateBody(this.raycastResult.body)) return;
    this.bodyGrabbed = this.raycastResult.body;
    this.bodyGrabbedSettings = { angluarDamping: this.bodyGrabbed.angluarDamping };
    this.currentReach = this.character.mesh.position.clone().sub(this.raycastResult.hitPointWorld).length();
  }
  launchBody() {
    const camTargetVector = this.selectionMesh.position.clone().sub(this.world.camera.position).normalize()
    this.bodyGrabbed.applyImpulse(camTargetVector.multiplyScalar(this.bodyGrabbed.mass*this.launchForce))
    this.releaseBody()
  }
  releaseBody() {
    console.log("Body Released")
    this.currentReach = this.range;

    for (let property in this.bodyGrabbedSettings) {
      this.bodyGrabbed[property] = this.bodyGrabbedLocalPosition[property];
    }
    //reset body settings, clear this.____
    //fires when body dropped, too far away, or tool disabled
    this.bodyGrabbed = false;
    this.bodyGrabbedSettings = {};
  }
  onClick() {
    if (this.bodyGrabbed == false && this.raycastResult.hasHit) {
      // this.scene.remove(this.selectionMesh);
      this.grabBody();
      this.toolbar.setCameraLock(false);
    }
    else if (this.bodyGrabbed) {
      this.launchBody();
      this.toolbar.setCameraLock(true)
    }
  }
  onEnable() {
    this.character.Speed = this.character.walkSpeed * this.speedDebuff;
    this.character.canSprint = false;
    this.toolbar.setCameraLock(true);
    this.scene.add(this.selectionMesh);
  }
  onDisable() {
    this.character.Speed = this.character.walkSpeed;
    this.character.canSprint = true;
    this.toolbar.setCameraLock(false);
    this.scene.remove(this.selectionMesh);
    this.releaseBody();
  }
}

export {
  GrabBase as Grab
};