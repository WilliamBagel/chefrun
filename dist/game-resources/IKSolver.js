import { Matrix4, Matrix3, Vector3, Quaternion, Euler, Bone } from "https://unpkg.com/three@0.141.0/build/three.module.js";
import {CCDIKSolver, CCDIKHelper} from "https://unpkg.com/three@0.141.0/examples/jsm/animation/CCDIKSolver.js"

class IKSolver{
  constructor(object){
    this.mesh = object.getObjectByProperty("isSkinnedMesh",true)
    this.rig = this.mesh.skeleton
    this._joints = {}
    this._rigScale = new Vector3().setFromMatrixScale(this.mesh.matrixWorld)
  }
  addJoint(name,chain){
    for (let i in chain){
      if(typeof(chain[i]) == 'object'){
        chain[i].bone = this.rig.getBoneByName(chain[i].bone) || (console.error(chain[i].bone + " is not a valid bone of " + this.rig))
      }else{
        chain[i] = this.rig.getBoneByName(chain[i]) || (console.error(chain[i] + " is not a valid bone of " + this.rig))
      }
    }
    // console.log(chain)
    return this._joints[name] = new IKJoint(this.mesh,this.rig,chain,this._rigScale)
  }
  step(ms){
    for (let i in this._joints){
      /*if(this._joints[i].needsUpdate)*/
      this._joints[i].update()
    }
  }
}

class IKJoint{
  constructor(mesh,rig,chain){
    this.mesh = mesh
    this.rig = rig
    this.chain = chain

    // this.start = start
    // this.middle = middle
    // this.end = end
    this.target = this.chain[this.chain.length-1]

    // this.sMax =
    // this.sQuat = this.chain[0].quaternion.clone()

    
    const links = []
    for (let i = 0; i < this.chain.length-2;i++){
      let info
      let bone = this.chain[i]
      if(bone.bone){
        bone = bone.bone
        info = {index: rig.bones.indexOf(bone)}
        delete this.chain[i].bone
        for(let j in this.chain[i]){
          info[j] = this.chain[i][j]
        }
        this.chain[i].bone = bone
      }else{
        info = {index: rig.bones.indexOf(this.chain[i])}
      }
      links.push(info)
    }
    console.log(links)
    this.iks = [
      {
        target: rig.bones.indexOf(this.target),
        effector: rig.bones.indexOf(this.chain[this.chain.length-2]),
        links: links//{ index: rig.bones.indexOf(middle) }, { index: rig.bones.indexOf(start)} 
      }
    ]
    this.solver = new CCDIKSolver(mesh,this.iks)
    this.helper = new CCDIKHelper(mesh,this.iks)

    // console.log(this.helper)
    for (let i in this.helper.children){
      this.helper.children[i].scale.set(0.1,0.1,0.1)
    }
  }
  set endPosition(position){
    this.target.position.copy(position)

    this.needsUpdate = true
  }
  set angle(angle){
    // const slightAngle = (0)*(Math.PI/180)
    // this.start.rotation.y = angle
    // this.start.rotation.x = slightAngle
    const axisVector = new Vector3(0.5,1,0).normalize()
    const dirQuat = this.sQuat.clone().multiply(new Quaternion().setFromAxisAngle(axisVector,angle))
    // console.log(this.sMax)
    // const offset = new Vector3(0,this.sMax,0).applyQuaternion(dirQuat)
    // console.log(offset)
    // this.middle.position.copy(offset)
    this.chain[0].quaternion.copy(dirQuat)
  }
  update(){
    // console.log(this.target)
    this.solver.update()
    // console.log(this.mesh,this.start,this.middle,this.end)
    this.needsUpdate = false
  }
}

// class IKJoint{
//   constructor(start,middle,end,scale,angle = 0){
//     this.start = start
//     this.end = end
//     this.middle = middle
//     this._boneScale = scale

//     // this.tMatrix = start.matrixWorld.invert().multiply(end.matrixWorld)
//     const worldEndPos = new Vector3().setFromMatrixPosition(end.matrixWorld)
//     const worldStartPos = new Vector3().setFromMatrixPosition(start.matrixWorld)
//     this.tOffset = new Vector3().subVectors(worldEndPos,worldStartPos).divide(this._boneScale)
//     // this.tMatrix.decompose(this.tOffset,new Quaternion(), new Vector3())
//     this.tMax = this.tOffset.length()
//     this.sMax = this.middle.position.length()
//     this.eMax = this.end.position.length()
//     this.target = angle
//   }
//   set endPosition(position){
//     // const worldEndMatrix = this.start.matrixWorld.multiply(new Matrix4().compose(position,new Quaternion(),new Vector3()))
//     // const middleMatrix = this.middle.matrixWorld
//     // const offset = worldEndMatrix.invert().multiply(middleMatrix)
//     // const tmpVec = new Vector3().setFromMatrixPosition(offset)
//     // const tmpQuat = new Quaternion()
//     // offset.decompose(tmpVec,tmpQuat,new Vector3())
//     // this.end.position.copy(tmpVec)
//     // console.log(this.end.position,this.end.matrix,this.end.matrix.toArray(),new Vector3().setFromMatrixPosition(this.end.matrix))
//     // this.end.rotation.setFromRotationMatrix(new Matrix3().setFromMatrix4(offset))
//     // console.log(tmpVec,offset,new Vector3().setFromMatrixPosition(offset))
//     // position.sub()
//     // this.end.matrix.
//     //USE LOCAL TRANSFORMS TO SET THE END BASED ON THE START !?!??! USE MATRICES
//     // const endPosWorld = new Vector3().setFromMatrixPosition(this.end.matrixWorld)
//     // const midPosWorld = new Vector3().setFromMatrixPosition(this.middle.matrixWorld)
//     // const startPosWorld = new Vector3().setFromMatrixPosition(this.start.matrixWorld)
//     // const nextEndPosWorld = new Vector3().addVectors(position,startPosWorld)
//     // const endOffset = new Vector3().subVectors(nextEndPosWorld,midPosWorld)
//     // console.log(this.end.position,endOffset)
//     // this.end.position.copy(endOffset)
//     // console.log(endPos,startPos,nextEndPos)
//     position = position.divide(this._boneScale)
//     this.tDistance = position.length()
//     const direction = new Matrix4().lookAt(new Vector3(),position,new Vector3(0,1,0))
    
//     this.tDirection = direction

//     this.needsUpdate = true
//   }
//   set target(angle){
//     this.angle = angle%Math.PI*2

//     this.needsUpdate = true
//   }
//   computeJoint(){
//     // this.tMatrix = this.start.matrixWorld.invert().multiply(this.end.matrixWorld)
//     // this.tMatrix.decompose(this.tOffset,new Quaternion(), new Vector3())
//     // this.tDistance = this.tOffset.length()
//     if(this.tDistance > this.tMax)this.tDistance = this.tMax
//     const t_sAngle = Math.acos((this.tDistance ** 2 + this.sMax ** 2 - this.eMax **2)/(2 * this.tDistance * this.sMax))
//     const e_tAngle = Math.acos((this.eMax ** 2 + this.tDistance ** 2 - this.sMax **2)/(2 * this.eMax * this.tDistance))
//     const s_eAngle = Math.PI - (t_sAngle + e_tAngle)
//     // console.log(t_sAngle,e_tAngle,s_eAngle)
//     // console.log(this.rig)
//     // this.start.rotation.setFromRotationMatrix()
//     // this.start.rotation.x += Math.cos(t_sAngle)
//     // this.start.rotation.y += Math.sin(t_sAngle)

//     // MAYBE works?
//     // const startMatrix = this.tDirection.multiply(new Matrix4().makeRotationFromEuler(new Euler(Math.cos(t_sAngle)*0,Math.sin(t_sAngle)*0,0)))
//     const startMatrix = new Matrix4().makeRotationFromEuler(new Euler(Math.cos(t_sAngle),0,Math.sin(t_sAngle)))
//     this.start.quaternion.setFromRotationMatrix(startMatrix)
//     // this.start.rotation.set(0,0,1)

//     const middleMatrix = new Matrix4().makeRotationFromEuler(new Euler(Math.cos(s_eAngle),0,Math.sin(s_eAngle)))
//     this.middle.quaternion.setFromRotationMatrix(middleMatrix) 


//     // const startMatrix = this.tDirection.multiply(new Matrix4().makeRotationFromEuler(new Euler(Math.cos(t_sAngle),Math.sin(t_sAngle),0)))
//     // this.middle.position.copy(new Vector3(this.sMax,0)).applyMatrix4(startMatrix)

//     // const middleMatrix = new Matrix4().makeRotationFromEuler(new Euler(Math.cos(s_eAngle),Math.sin(s_eAngle),0))
//     // this.end.position.copy(new Vector3(0,this.eMax,0)).applyMatrix4(middleMatrix)



//     this.needsUpdate = false
//   }
// }

export {IKSolver}