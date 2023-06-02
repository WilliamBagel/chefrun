import { Vector3, Quaternion,Euler, Matrix4, Object3D, DirectionalLightHelper, AnimationMixer, DirectionalLight, PointLight, CameraHelper} from "three";
import * as CANNON from 'cannon';

// import { IKSolver } from './IKSolver.js'

//CENTER RAT IN BLENDER!!!
class RatMechanics{
  constructor(loader,character){
    if(loader){
      this.world = loader.world;
      this.isCurrentCharacter = true;
      this.isConnectedCharacter = false;
    }else{
      this.isCurrentCharacter = false;
      this.isConnectedCharacter = true;
    }
    this.character = character
    this.mesh = character.mesh
    this.body = character.body

    const skin = this.mesh.getObjectByProperty("isSkinnedMesh",true)
    // console.log(skin,this.mesh)
    skin.receiveShadow = false
    skin.castShadow = true
    character.wallClimbing = true;
    // let light = new PointLight( 0xffffff, 1 );
    // light.position.set(0,0,0)
    // // console.log(light)
    // light.distance = 10
    // light.castShadow = true; // default false
    // light.shadow.camera.near    =   1;
    // light.shadow.camera.far     =   10;
    // light.shadow.camera.right   =   10;
    // light.shadow.camera.left    =  -10;
    // light.shadow.camera.top     =   10;
    // light.shadow.camera.bottom  =  -10;
    // light.shadow.mapSize.width  = 612;
    // light.shadow.mapSize.height = 612; 
    // this.mesh.add(light)

    // const ikSolver = new IKSolver(this.mesh)
    // this.armJointL = ikSolver.addJoint("LeftArm",[{bone: "LeftArm"},{bone:"LeftForeArm"},"LeftHand","LeftArmIKTarget"])
    // // this.armJointL.angle = -Math.PI
    // this.armJointR = ikSolver.addJoint("RightArm",["RightArm","RightForeArm","RightHand","RightArmIKTarget"])

    // this.legJointL = ikSolver.addJoint("LeftLeg",[{bone:"LeftUpLeg",limitation:new Vector3(-1,0,0)},{bone:"LeftLeg",limitation:new Vector3(1,0,0)},{bone:"LeftFoot",limitation:new Vector3(0,1,0)},"LeftToeBase","LeftLegIKTarget"])
    // this.legJointR = ikSolver.addJoint("RightLeg",["RightUpLeg","RightLeg","RightFoot","RightToeBase","RightLegIKTarget"])

    // this.scene.add(this.armJointL.helper)
    // this.scene.add(this.armJointR.helper)
    // this.scene.add(this.legJointR.helper)
    // this.scene.add(this.legJointL.helper)

    // this.world.addSystem(ikSolver)


    // this.armInfo = {
    //   animScale : 0.4,
    //   xOffset : 0.3,
    //   zOffset : 0.5,
    //   yOffset : 0
    // }
    // this.legInfo = {
    //   animScale : 1,
    //   xOffset : 0.3,
    //   zOffset : 0.5,
    //   yOffset : -0.5
    // }
    // this.animSpeed = 2
    // this.fading = false

    

    // this.world.InputTable.a = null
    // this.world.InputTable.d = null

    

    this._animationListeners = []

    const mesh = character.mesh
    this.animations = {}
    this.animMixer = new AnimationMixer( mesh );
    for (let name in mesh.animations){
      this.animations[name] = this.animMixer.clipAction(mesh.animations[name])
    }
    // console.log(this.animations)
    this.updateAnimation({status: 'idle'})
    // this.CannonWorld = this.loader.CannonWorld
    // const self = this
    // this.loader.gameLoading.then(()=>{
    //   self.ThirdPerson = self.world.mechanics.ThirdPerson
    //   if(!self.ThirdPerson){
    //     self.mesh.visible = false
    //   }
    // })
    if(this.isCurrentCharacter){
      this.origDamping = [this.body.linearDamping,this.body.angularDamping]
      this.timeOnGround = 0
      this.timeOffGround = 0
      // console.log(character)
  
      // this.elapsedTime = 0
      // this.animate = true
      this.recoveryDelay = 1
      this.recoveryTime = 0.5
      this.cushionTime = 1

      this.floatPower = 0.1
    }
  }
  // updateQuads(){
  //   const armInfo = this.armInfo
  //   const legInfo = this.legInfo

  //   let angle = (this.elapsedTime*this.animSpeed*-1)%(Math.PI*2)
  //   let xAngle = Math.sin(angle)
  //   let zAngle = clamp(-1,0,Math.cos(angle))
  //   this.armJointL.endPosition = new Vector3(0,xAngle,zAngle).multiplyScalar(armInfo.animScale).add(new Vector3(armInfo.xOffset,armInfo.yOffset,armInfo.zOffset)) 
  //   xAngle = clamp(0,1,xAngle)
  //   zAngle = Math.cos(angle)
  //   this.legJointR.endPosition = new Vector3(0,xAngle,zAngle).multiplyScalar(legInfo.animScale).add(new Vector3(legInfo.xOffset*-1,legInfo.yOffset,legInfo.zOffset)) 
    
  //   angle = (this.elapsedTime*this.animSpeed*-1)%(Math.PI*2)+Math.PI
  //   xAngle = Math.sin(angle)
  //   zAngle = clamp(-1,0,Math.cos(angle))
  //   this.armJointR.endPosition = new Vector3(0,xAngle,zAngle).multiplyScalar(armInfo.animScale).add(new Vector3(armInfo.xOffset*-1,armInfo.yOffset,armInfo.zOffset))
  //   xAngle = clamp(0,1,xAngle)
  //   zAngle = Math.cos(angle)
  //   this.legJointL.endPosition = new Vector3(0,xAngle,zAngle).multiplyScalar(legInfo.animScale).add(new Vector3(legInfo.xOffset,legInfo.yOffset,legInfo.zOffset)) 

  //   // const offset = this.body.position.vsub(this.armJointL.chain[0].bone.getWorldPosition(new Vector3()))
  //   // this.body.shapeOffsets[2].copy(offset)
  //   // this.ray = new Ray(new Vector3(),new Vector3())
  //   // this.raycastResult = new RaycastResult()
  //   // this.rayOptions = {}
  //   // this.rayCasting = false
  // }
  updateTransforms(){
    // this.ray.to.copy(this.body.position)
    // this.ray.from.copy(this.body.position.vadd(new Vec3(0,-5,0)))

    // if(!this.rayCasting)this.ray.intersectWorld(this.world.loader.CannonWorld,this.rayOptions)
    // this.raycastResult.reset()
    // this.CannonWorld.removeBody(this.body)
    // this.CannonWorld.raycastClosest(this.ray.from,this.ray.to,this.rayOptions,this.raycastResult)
    // this.CannonWorld.removeBody(this.body)
    // console.log(this.body.velocity,this.body.)
    const result = this.body.floorHitResult
    // console.log(this.body.material)
    const cushioned = this.timeOffGround < this.cushionTime
    const recovered = this.timeOnGround > this.recoveryDelay

    // console.log(cushioned,this.timeOffGround > this.recoveryDelay)
    // console.log(this.timeOffGround,this.timeOnGround)
    this.body.linearFactor.set(1,1,1)
    if(result && result.hasHit && (recovered || cushioned )){
      // console.log("recovering")
      this.body.angularVelocity.normalize()
      this.body.linearDamping = 0
      this.body.angularDamping = 0.5
      let status;      
      if(!this.character.walking){
        this.body.velocity.set(0,this.body.velocity.y,0)
        status = 'idle'
      }else{
        status = 'walk'
        this.body.velocity.y += this.floatPower
        if(this.world.InputTable["shift"]){
          status = 'run'
        }
      }
      this.updateAnimation({status})
      if(!cushioned)this.timeOffGround = 0
      if(this.ragdoll)this.lastQuat = new CANNON.Quaternion().copy(this.body.quaternion)
      this.ragdoll = false
      // this.body.matrix.copy()
      // const quat = new Quaternion().setFromRotationMatrix(new Matrix4().lookAt(new Vector3(),result.hitNormalWorld,new Vector3(0,1,0)))
      // if(this.timeOnGround > this.recoveryDelay || cushioned){
      let rtime = (this.timeOnGround-this.recoveryDelay)/this.recoveryTime
      // if(cushioned)rtime = 1
      
      rtime = clamp(0,1,rtime)
      // console.log(rtime)  
      //CUSHIONED IS TRUE WHEN IT REALLY SHOUDNT BE
      // console.log(rtime,cushioned)
      this.lastQuat.slerp(new CANNON.Quaternion().setFromVectors(new CANNON.Vec3(0,0,-1),result.hitNormalWorld).mult(new CANNON.Quaternion().setFromEuler(0,0,Math.PI-this.world.camera.theta),this.body.quaternion),rtime,this.body.quaternion)
        // console.log(this.world.camera.rotation.z)
      // }
      // this.body.quaternion.copy(quat)
      // console.log(this.body.quaternion)
      // console.log(result.hitNormalWorld)
      
      this.updateAnimation({timeScale: 1})
      if (this.world.InputTable.s){
        this.updateAnimation({timeScale: -1})
      }
        // switch(this.animStatus){
        // case 'walking':
        //   if(this.currentAnimation.paused){
        //     this.currentAnimation.paused = false
        //   }
        //   this.currentAnimation.play()
        //   break;
        // case 'running':
        //   mixer.clipAction( this.animations[]).play()
        //   break;
        // case 'idle':
        //   character.currentAnimation.paused = true
        //   break;
        // case 'falling':
        //   break;
        // }
      // }
      
    }else if(!(result && result.hasHit)){
      // console.log("free physics")
      // this.lastQuat = new CANNON.Quaternion().copy(this.body.quaternion)
      this.ragdoll = true
      this.timeOnGround = 0
      this.body.linearDamping = this.origDamping[0]
      this.body.angularDamping = this.origDamping[1]
    }
    // console.log(this.raycastResult)

          /*body: Body {id: 12, index: 12, world: World, vlambda: Vec3, collisionFilterGroup: 1, …}
          distance: 0.582796440751778
          hasHit: true
          hitFaceIndex: 0
          hitNormalWorld: Vec3 {x: 0, y: 1, z: 0}
          hitPointWorld: Vec3 {x: -0.05737340803222876, y: 1, z: -16.877463319788692}
          rayFromWorld: Vec3 {x: -0.05737340803222876, y: 0.41720355924822194, z: -16.877463319788692}
          rayToWorld: Vec3 {x: -0.05737340803222876, y: 1.417203559248222, z: -16.877463319788692}
          shape: Box {id: 26, type: 4, boundingSphereRadius: 7.088723439378913, collisionResponse: true, collisionFilterGroup: 1, …}
          shouldStop: false*/
  }
  // onRayHit(thing){
  //   // this.rayCasting = false

  //   // console.log(thing)
  // }
  updateAnimation(update){
    this.previousAnimStatus = this.animStatus;
    this.previousTimeScale = (this.currentAnimation && this.currentAnimation.timeScale)
    if(update.status)this.animStatus = update.status;
    if(update.timeScale)this.currentAnimation.timeScale = update.timeScale;
    if(this.previousAnimStatus != this.animStatus /*&& !this.fading)*/){
      for (let name in this.animations){
        this.animations[name].stop()
      }
      this.currentAnimation = this.animations[this.animStatus]
      this.currentAnimation.play()
    }
    let changed = false;
    if(this.previousAnimStatus != this.animStatus)changed = true;
    if(this.previousTimeScale != (this.currentAnimation && this.currentAnimation.timeScale))changed = true;
    for(let i in this._animationListeners){
      this._animationListeners[i](update,this,changed)
    }
  }
  addAnimationListener(callback){
    this._animationListeners.push(callback)
  }
  step(ms){
    if(this.isCurrentCharacter){
      this.elapsedTime += ms
      this.timeOnGround += ms
      this.timeOffGround += ms
      // if(this.animate)this.updateQuads()
      this.updateTransforms()
    }
    
    // this.body.quaternion.mutliply(new Quaternion().setFromEuler(new Euler(Math.PI/2,0,0)))
    // const rotation = this
    this.animMixer.update(ms)
  }
}

function clamp(min,max,val){
  val = (val<min)?min:val
  val = (val>max)?max:val
  return val
}

export {RatMechanics}