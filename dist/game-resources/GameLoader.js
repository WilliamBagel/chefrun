import * as THREE from "three";//"https://threejs.org/build/three.module.js"; 
import * as CANNON from 'https://pmndrs.github.io/cannon-es/dist/cannon-es.js';
import * as SkeletonUtils from "https://threejs.org/examples/jsm/utils/SkeletonUtils.js";
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { ConvexGeometry } from 'https://unpkg.com/three@0.122.0/examples/jsm/geometries/ConvexGeometry.js';
import { SimplifyModifier } from 'https://threejs.org/examples/jsm/modifiers/SimplifyModifier.js';
import { RatMechanics } from './RatMechanics.js'
import * as OLDTHREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
const modelLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const StringTypes = { number: true, string: true, boolean: true, };
var ThirdPerson = true;
var Game;
class GameLoader {
  constructor(game, world) {
    this.jsonData = game;
    this.world = world;
    this.settings = {};
    this.materials = {
      three: {},
      cannon: {}
    };
    this.imports = { models: {}, images: {}, videos: {} };
    this.checkPoints = {};
    this._onrender = [];
    // this.objects = []

    this.initCore();
    Game = this;
    this.debug = game.flags && game.flags.debug
    //Game is not yet defined
    this.gameLoading = this.asyncLoad(game,world)
  }
  asyncLoad(game,world){
    return new Promise(async (res) => {//but now it is//PROMISE THIS, ADD LOADED TO THIS
      await this.loadImports(game.imports);
      this.loadFolder(game, GamEnum);
      this.initCharacter(game.character)
      world.addSystem(myMeshes);
      this.isLoaded = true
      res()
    });
  }
  set onrender(foo) {
    this.world._callOnRender.push(foo);
  }
  initCharacter(folder){
    // const CannonWorld = this.CannonWorld
    folder.position = new THREE.Vector3(0,0,0)
    folder.size = new THREE.Vector3(folder.size[0], folder.size[1], folder.size[2]);
    let mesh, body;
    if (folder.model) {
      // const group = this.imports.models[folder.model];
      // if (!group) return console.warn(folder.model + " is not a loaded model");
      // const ref = group.scene.getObjectByName('mesh');
      // // console.log(group)
      // mesh = SkeletonUtils.clone(ref);
      // // console.log(mesh)
      // if (folder.shader) mesh.material = this.materials.three[folder.shader];
      // mesh.material.map.encoding = THREE.LinearEncoding;
      // mesh.material.needsUpdate = true;
      // let hull = mesh;
      // if (group.scene.getObjectByName('hull')) {
      //   group.simplifyAmount = 0;
      //   hull = SkeletonUtils.clone(group.scene.getObjectByName('hull'));
      // }
      // const res = rigToConvexHull(hull, false, group.simplifyAmount);
      // shape = res.shape;
      // const offset = res.offset
      // const pos = mesh.children.length == 0? mesh.geometry.attributes.position:mesh.children[1].geometry.attributes.position
      // for(let i = 0; i < pos.count;i++){
      //     pos.array[i*3 + 1] += offset
      // }
      // if (mesh.geometry) {
      //   for (let i in ref.geometry.attributes) {
      //     if (mesh.geometry.attributes[i]) continue;
      //     mesh.geometry.setAttribute(i, ref.geometry.attributes[i].clone());
      //   }
      // }
      // console.log(mesh)
      const res = this.loadModel(folder,true);
      mesh = res.mesh;
      body = res.body;
      // mesh.material.map.encoding = THREE.LinearEncoding;
      // mesh.material.needsUpdate = true;
    } else {
      mesh = new THREE.Mesh(new THREE.SphereGeometry(), loader.materials.three[folder.shader]);
      body = new CANNON.Body({
        shape: new CANNON.Sphere(2)
      });
    }

    
    // if (folder.size) (typeof (folder.size) == 'array' && mesh.scale.set(folder.size[0], folder.size[1], folder[2])) || (typeof (folder.size) == 'number' && mesh.scale.set(folder.size, folder.size, folder.size));
    // mesh.scale.multiplyScalar(2)
    // this.scene.add(mesh);

    // body.mass = folder.mass
    // body.updateMassProperties()
    
    body.position = new CANNON.Vec3(0, 0, 0),
    body.material = this.materials.cannon[folder.material],
    // body.type = CANNON.Body.DYNAMIC
    // body.collisionFilterMask = 1 | 2 | 4,
      // fixedRotation: false
    body.angularDamping = 0.5;
    body.linearDamping = 0.5;
    const character = this.character
    body.addEventListener('collide', (e) => {
      character.colliding = true;
    });

    // this.CannonWorld.addBody(body);
    new SyncedMesh(mesh, body);
    
    character.mesh = mesh;
    character.body = body;

    if(folder.model == "Rat"){
      //INIT RAT BOTS!!!
      const ratMechs = new RatMechanics(this,this.scene,folder,this.character)
      this.world.addSystem(ratMechs)
      this.character.ratMechanics = ratMechs
    }
  }
  loadFolder(folder, reference) {
    for (let i in reference) {
      if (folder[i] == null && i != 'properties') return console.warn(i + " does not exist in game data");
      const file = folder[i];
      if (typeof (folder[i]) != reference[i] && StringTypes[reference[i]]) return console.warn(i + "is not the correct type");
      console.log('"loading" ' + i);
      switch (i) {
        case 'objects':
          this.loadObjects(folder[i].list);
          break;
        case 'materials':
          this.loadMaterials(folder[i]);
          break;
        case 'settings':
          this.loadSettings(folder[i]);
          break;
      }
    }
  }
  loadSettings(settings) {
    const props = GamEnum.settings;
    for (let prop in props) {
      if (settings[prop] != null) {
        this.settings[prop] = settings[prop];
        continue;
      }
      return console.warn("property " + prop + " of settings should be type " + props[prop] + " but is " + typeof (settings[prop]));
    }
  }
  async loadImports(imports) {
    //models & images & movies
    const reference = GamEnum.imports;
    for (let i in reference) {
      switch (i) {
        case 'models': {
          for (let name in imports[i]) {
            let path = imports[i][name];
            let simp = 0.9;
            if (typeof (path) != 'string' && path.constructor != Array) return console.warn("import " + name + " should be a string or array, not " + typeof (path));
            if (path.constructor == Array) simp = path[1], path = path[0];
            const gltf = await importModel(path);
            gltf.simplifyAmount = simp;
            this.imports.models[name] = gltf;
          }
        } break;
        case 'images': {
          for (let name in imports[i]) {
            const path = imports[i][name];
            if (typeof (path) != 'string') return console.warn("import " + name + " should be a string, not " + typeof (path));
            const image = await importImageTexture(path);
            this.imports.images[name] = image;
          }
        } break;
        case 'videos':
          for (let name in imports[i]) {
            const path = "./assets/" + imports[i][name];
            if (typeof (path) != 'string') return console.warn("import " + name + " should be a string, not " + typeof (path));
            const video = document.createElement('video');
            // video.playbackRate = 0.1
            const src = document.createElement('source');
            // video.playbackRate = 5
            video.appendChild(src);
            src.type = 'video/mp4';
            src.src = path;
            video.play();
            this.imports.videos[name] = new THREE.VideoTexture(video);
          }
          break;
      }
    }
  }
  loadMaterials(materials) {
    const reference = GamEnum.materials;
    for (let i in reference) {
      if (materials[i] == null) return console.warn("materials must include " + i);
      switch (i) {
        case 'three':
          for (let name in materials[i]) {
            const mat = materials[i][name];
            let info = mat.settings;

            if (info == null) info = {};
            if (THREE[mat.type] == null) return console.warn(mat.type + " is not a valid material type");
            
            ["map","alphaMap","aoMap","bumpMap","displacementMap","emissiveMap","envMap",
            "lightMap","normalMap","specularMap",].filter(map => info[map] != null).forEach(map=>info[map] = this.imports.images[info[map]] || this.imports.videos[info[map]])
            // if (info.map) {
            //   
              // why did i write have this ?
              // if (info.texture) {
              //   const tex = info.texture;
              //   for (let i in tex) {
              //     if (typeof (tex[i] == 'string')) {
              //       tex[i] = THREE[i];
              //     }
              //     info.map[i] = tex[i];
              //   }
              //   info.texture = undefined;
              // }
            // }
            let material = new THREE[mat.type](info);

            if (this.materials.three[name] != undefined) return console.warn("three material " + name + " has already been defined");
            this.materials.three[name] = material;
          }
          break;
        case 'cannon':
          for (let name in materials[i]) {
            const info = materials[i][name];
            switch (info.type) {
              case 'Material':
                const material = new CANNON.Material(info.settings);
                if (this.materials.cannon[name] != undefined) return console.warn("cannon ContactMaterial/ContactMaterial " + name + " has already been defined");
                this.materials.cannon[name] = material;
                break;
              case 'ContactMaterial':
                if (!info.m1 || !info.m2 || this.materials.cannon[info.m1] == undefined && this.materials.cannon[info.m2] == undefined) return console.warn("ContactMaterial materials are not defined in ContactMaterial " + name);
                const contactmaterial = new CANNON.ContactMaterial(info.m1, info.m2, info.settings);
                if (this.materials.cannon[name] != undefined) return console.warn("cannon ContactMaterial/ContactMaterial " + name + " has already been defined");
                this.materials.cannon[name] = contactmaterial;
                this.CannonWorld.addContactMaterial(material);
                break;
              default:
                console.warn(info.type + " is not a valid cannon material");
                break;
            }

          }
          break;
      }
    }
  }
  loadObjects(objects) {
    const props = GamEnum.objects.properties;
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      for (let prop in props) {
        if (obj[prop] != null) continue;
        if (prop == 'mass' || (prop == 'shader' && obj.type == 'border')) continue;
        return console.warn("property " + prop + " of " + JSON.stringify(obj) + " should be type " + props[prop] + " but is " + typeof (obj[prop]));
      }
      obj.position = new THREE.Vector3(obj.position[0], obj.position[1], -obj.position[2]);
      obj.size = new THREE.Vector3(obj.size[0], obj.size[1], obj.size[2]);
      switch (obj.type) {
        case 'sync-Import': {
          this.loadModel(obj, true);
        } break;
        case 'sync-Default':
          if (obj.shape == 'box') {
            const geo = new THREE.BoxGeometry();
            const mat = this.materials.three[obj.shader];
            const mesh = new THREE.Mesh(geo, mat);
            mesh.scale.set(obj.size.x, obj.size.y, obj.size.z);
            mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
            obj.rotation = obj.rotation ? obj.rotation : [0, 0, 0];
            mesh.quaternion.copy(new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(obj.rotation[0]), THREE.MathUtils.degToRad(obj.rotation[1]), THREE.MathUtils.degToRad(obj.rotation[2]),'XYZ')));
            mesh.receiveShadow = true
            mesh.castShadow = true
            this.scene.add(mesh); 
            const body = new CANNON.Body({
              mass: obj.mass,
              shape: new CANNON.Box(new CANNON.Vec3(obj.size.x / 2, obj.size.y / 2, obj.size.z / 2)),
              type: CANNON.Body.STATIC,
              position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
              quaternion: new CANNON.Quaternion().copy(mesh.quaternion)
            });
            this.CannonWorld.addBody(body);

            new SyncedMesh(mesh, body, true, obj.syncDir);
          } else {
            console.warn(obj.shape + " is not a valid object shape");
          }
          break;
          case 'visual': {
            if (obj.shape == 'box') {
              const geo = new THREE.BoxGeometry();
              const mat = this.materials.three[obj.shader];
              const mesh = new THREE.Mesh(geo, mat);
              mesh.scale.set(obj.size.x, obj.size.y, obj.size.z);
              mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
              obj.rotation = obj.rotation ? obj.rotation : [0, 0, 0];
              mesh.quaternion.copy(new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(obj.rotation[0]), THREE.MathUtils.degToRad(obj.rotation[1]), THREE.MathUtils.degToRad(obj.rotation[2]),'XYZ')));
              mesh.receiveShadow = true
              mesh.castShadow = true
              this.scene.add(mesh);
            } else {
              console.warn(obj.shape + " is not a valid object shape");
            }
            break; }
          case 'sync-Poly': {
          const geo = new THREE.BufferGeometry();
          // let verts = new Float32Array(obj.verts)
          // let indices = obj.indices
          // let verts, indices;
          let trimesh;
          let tverts = [], cverts = [], uvs;
          if (obj.shape == 'tri') {
            tverts = new Float32Array(obj.verts);
            // cverts = obj.verts
            // indices = [0,1,2]
            cverts = obj.verts;

            for (let i = 0; i < obj.verts.length; i++) {
              obj.verts[i] *= 2;
            }
            trimesh = new CANNON.Trimesh(obj.verts, obj.indices);
          } else if (obj.shape == 'quad') {
            for (let i = 0; i < obj.verts.length; i++) {
              tverts.push(obj.verts[i].toFixed(5));
            }
            uvs = [];
            obj.verts.forEach((v, i) => (i % 3 != 1 && uvs.push(v)));
            const min = Math.min.apply(null, uvs);
            uvs = uvs.map(v => v - min);
            const max = Math.max.apply(null, uvs);
            uvs = uvs.map(v => v / max);
            uvs = new Float32Array(uvs);
            tverts = new Float32Array(tverts);
            for (let i = 0; i < obj.verts.length; i++) {
              obj.verts[i] *= 2;
            }
            trimesh = new CANNON.Trimesh(obj.verts, obj.indices);
          } else if (obj.shape == 'torus') {
            trimesh = CANNON.Trimesh.createTorus(10, 3.5, 5, 5);
          }

          geo.setAttribute('position', new THREE.BufferAttribute(tverts, 3));
          geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
          geo.setIndex(obj.indices);
          const mat = this.materials.three[obj.shader];
          mat.side = THREE.DoubleSide;
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
          obj.rotation = obj.rotation ? obj.rotation : [0, 0, 0];
          mesh.quaternion.copy(new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(obj.rotation[0]), THREE.MathUtils.degToRad(obj.rotation[1]), THREE.MathUtils.degToRad(obj.rotation[2]))));

          this.scene.add(mesh);


          trimesh.setScale(new CANNON.Vec3(obj.size.x / 2, obj.size.y / 2, obj.size.z / 2));
          const body = TrimeshToPolyhedron(trimesh, new CANNON.Vec3(0, 1, 0));
          body.type = CANNON.Body.KINEMATIC;
          body.mass = 10;
          body.position.copy(obj.position);
          body.quaternion.copy(mesh.quaternion);
          this.CannonWorld.addBody(body);
          new SyncedMesh(mesh, body);

          // console.log(body,mesh)
        } break;
        case "checkPoint": {
          const geo = new THREE.BoxGeometry();
          const mat = this.materials.three[obj.shader];
          const mesh = new THREE.Mesh(geo, mat);
          mesh.scale.set(obj.size.x, obj.size.y, obj.size.z);
          mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
          this.scene.add(mesh);

          const body = new CANNON.Body({
            mass: obj.mass,
            shape: new CANNON.Box(new CANNON.Vec3(obj.size.x / 2, obj.size.y / 2, obj.size.z / 2)),
            type: CANNON.Body.STATIC,
            // isTrigger: true,
            position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
            quaternion: new CANNON.Quaternion().copy(mesh.quaternion)
          });
          this.CannonWorld.addBody(body);

          body.addEventListener("collide", function (e) {
            Game.character.checkPoint = obj.pointNumber;
          });

          new SyncedMesh(mesh, body);

          this.checkPoints[obj.pointNumber] = mesh;
        } break;
        case 'border':
          const border = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(obj.size.x / 2, obj.size.y / 2, obj.size.z / 2)),
            type: CANNON.Body.STATIC,
            position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
            quaternion: new CANNON.Quaternion().copy(new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(obj.rotation[0]), THREE.MathUtils.degToRad(obj.rotation[1]), THREE.MathUtils.degToRad(obj.rotation[2]),'XYZ')))
          });
          this.CannonWorld.addBody(border);
          break;
        case 'obstacle':
          switch (obj.subType) {
            case 'spinner':
              //position, size, mass, type, motor, speed
              new SpinnerObstacle(obj.position, obj.size, obj.mass, obj.subsubType, obj.motorEnabled, obj.speed);
              break;
            case 'moving':
              new MovingObstacle(obj.subsubType, obj.position, obj.mass, obj.options);
              break;
            case 'obstacle':
              new Obstacle(obj.subsubType, obj.position, obj.size, obj.mass.obj.geometry, obj.body);
              break;
            default:
              console.warn(obj.type + " is not a valid object subtype");
          }
          break;
        default: {
          console.warn(obj.type + " is not a valid object type");
        }
      }
    }
  }
  loadModel(obj, attachPhysics = false) {
    const name = obj.model;
    if (this.imports.models[name] == undefined) return console.warn("Model " + name + " has not been imported");
    let pos = obj.position//new THREE.Vector3().fromArray(obj.position || [0,0,0])
    let rot = obj.rotation || [0, 0, 0];
    let size = obj.size.clone().multiplyScalar(0.5)//new THREE.Vector3().fromArray(obj.size || [1,1,1])
    // obj.size.x /= 2, obj.size.y /= 2,obj.size.z /= 2
    // if (!size || !size.isVector3) size = size && size.constructor == Array ? new THREE.Vector3().fromArray(obj.size) : new THREE.Vector3(1, 1, 1);
    // console.log(obj)
    const group = Game.imports.models[name];
    // console.log(group);

    const mesh = SkeletonUtils.clone(group.scene.getObjectByName('mesh'));
    // if(obj.model == "board"){
    //   let data = {}
    //   for(let i in mesh.material){
    //     if(typeof(mesh.material[i]) != "object")data[i] = mesh.material[i]
    //   }
    //   // console.log(data)
    // }
    mesh.scale.set(size.x, size.y, size.z);
    // console.log(mesh.scale)
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.quaternion.setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(rot[0]), THREE.MathUtils.degToRad(rot[1]), THREE.MathUtils.degToRad(rot[2])));
    mesh.receiveShadow = true
    mesh.castShadow = true
    // mesh.geometry.applyQuaternion(new THREE.Quaternion().setFromEuler())
    let hull = mesh;
    if (group.scene.getObjectByName('hull')) {
      group.simplifyAmount = 0;
      // hull = SkeletonUtils.clone(group.scene.getObjectByName('hull'));
      hull = group.scene.getObjectByName('hull');
    }
    // console.log(hull,obj.model)
    // const { shape } = rigToConvexHull(hull, false, group.simplifyAmount);
    //PRVENTS ABSOLUTE DIE __below__ , ya i Really don't know why, but it works. So it Works.
    function iter(bone){
      for (let i in bone.children){
        const kid = bone.children[i]
        if (kid.isBone){
          kid.getWorldPosition(new THREE.Vector3())
          iter(kid)
        }
      }
    }
    iter(mesh)
    mesh.animations = {}
    for(let i in group.animations){
      let animation = group.animations[i]
      mesh.animations[animation.name.toLowerCase()] = animation
    }
    if (attachPhysics) {
      // const body = new CANNON.Body({
      //   mass: obj.mass,
      //   shape: shape,
      //   position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
      //   quaternion: new CANNON.Quaternion().copy(mesh.quaternion)
      // });
      // console.log(size,obj)
      const body = getCompoundHull(hull,this.debug,size);//,mesh);
      body.mass = obj.mass
      body.updateMassProperties()
      body.type = CANNON.Body.DYNAMIC
      body.material = this.materials.cannon[obj.material],
      body.position = new CANNON.Vec3(pos.x, pos.y, pos.z),
      body.quaternion = new CANNON.Quaternion().copy(mesh.quaternion)

      this.CannonWorld.addBody(body);
      this.scene.add(mesh);

      new SyncedMesh(mesh, body);

      return { mesh, body };
    }
    return { mesh };
  }
  initCore() {
    this.UniversalClock = new THREE.Clock();
    this.CannonWorld = new CANNON.World();
    this.CannonWorld.gravity.set(0, -20, 0);
    this.camera = this.world.camera;
    this.scene = this.world.scene;

    

    this.character = {};

    // renderer.outputEncoding = THREE.sRGBEncoding;
    



    // load scene stuff
    const tmpCubeTexture = new THREE.CubeTexture([
      new THREE.DataTexture(new Uint8Array([255, 0, 0, 255]), 1, 1),
      new THREE.DataTexture(new Uint8Array([0, 255, 0, 255]), 1, 1),
      new THREE.DataTexture(new Uint8Array([0, 0, 255, 255]), 1, 1),
      new THREE.DataTexture(new Uint8Array([255, 0, 255, 255]), 1, 1),
      new THREE.DataTexture(new Uint8Array([255, 255, 0, 255]), 1, 1),
      new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1)
    ]);
    this.world.renderer.shadowMap.enabled = true;
    this.world.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // this.world.renderer.physicallyCorrectLights = true
    let light
    light = new THREE.AmbientLight(0x404040);
    light.intensity = 0.1;
    this.scene.add(light);
    light = new THREE.PointLight( 0xffffff, 1 );
    // light.bais = 0.1
    // console.log(light)
    light.position.set( 0, 10, 0 ); //default; light shining from top
    light.castShadow = true; // default false
    this.world.renderer.toneMapping = THREE.ReinhardToneMapping;
    light.shadow.camera.near    =   1;
    light.shadow.camera.far     =   40;
    light.shadow.camera.right   =   -20;
    light.shadow.camera.left    =  -20;
    light.shadow.camera.top     =   20;
    light.shadow.camera.bottom  =  -20;
    light.shadow.mapSize.width  = 1080;
    light.shadow.mapSize.height = 1080;
    this.scene.add(light)
    // light = new THREE.PointLight( 0xffffff, 1 );
    // light.shadow.camera.near    =   10;
    // light.shadow.camera.far     =   20000;
    // light.shadow.camera.right   =   350;
    // light.shadow.camera.left    =  -350;
    // light.shadow.camera.top     =   350;
    // light.shadow.camera.bottom  =  -350;
    // light.shadow.mapSize.width  = 1024;
    // light.shadow.mapSize.height = 1024;
    // light.position.set(0, 8, 20 ); //default; light shining from top
    // light.castShadow = true; // default false
    // this.scene.add(light)
    // light.shadow.mapSize.width = 512; // default
    // light.shadow.mapSize.height = 512; // default
    // light.shadow.camera.near = 0.5; // default
    // light.shadow.camera.far = 500; // default
    // const helper = new THREE.CameraHelper( light.shadow.camera );
    // this.scene.add( helper );
    
    // this.scene.add( light );
    tmpCubeTexture.needsUpdate = true;
    // this.scene.background = tmpCubeTexture;
    //end load scene stuff


  }
}


var GamEnum = {
  settings: {
    yLevel: 'number'

  },
  scene: 'object',
  imports: {
    models: 'object',
    images: 'object',
    videos: 'object'
  },
  character: 'object',
  materials: {
    three: 'object',
    cannon: 'object'
  },
  objects: {
    list: 'array',
    properties: {
      type: 'string',
      position: 'array',
      size: 'array',
      mass: 'number',
      shader: 'string',
      texture: 'string'
    }
  }
};

class MeshSyncSet extends Set {
  step(delta) {
    // print(this.entries())
    if (this.Paused) return;
    const iter = this.values();
    for (const entry of iter) {
      // print(entry)
      // console.log(i.value)
      entry.sync(entry.direction, delta);
    }
  }
  get toggle() {
    this.Paused = !this.Paused;
  }
  Paused = false;
}
var myMeshes = new MeshSyncSet();
class SyncedMesh {
  constructor(Mesh, CObj, enabled = true, direction = true, foo, quat = true) {

    this.ThreeMesh = Mesh;
    this.CannonMesh = CObj;
    this.enabled = (enabled != null && enabled);
    this.direction = (direction != null && direction);//Streaming Direction, true defaults to: CObj-->Mesh
    this.onSync = (foo != null && foo);
    this.quaternionSync = quat;
    myMeshes.add(this);
    // this.ThreeMesh.syncMesh = this.sync
    // this.CannonMesh.syncMesh = this.sync
    // console.log(myMeshes)
  }
  sync(direction, deltatime) {
    if (direction === undefined) direction = this.direction;
    if (this.onSync) {
      this.onSync(this.ThreeMesh, this.CannonMesh, deltatime);
    } else {
      if (direction) {
        // console.log(this.CannonMesh.position.y)
        // if(this.CannonMesh.position == undefined)console.log(this)
        this.ThreeMesh.position.copy(this.CannonMesh.position);
        if (this.quaternionSync) this.ThreeMesh.quaternion.copy(this.CannonMesh.quaternion);
      } else {
        this.CannonMesh.position.copy(this.ThreeMesh.position);
        if (this.quaternionSync) this.CannonMesh.quaternion.copy(this.ThreeMesh.quaternion);
      }
    }
  }
}


class Obstacle {
  constructor(type, position, size, mass, geometry, body) {
    switch (type) {
      case "custom":
        this.cannonShape = body;
        this.threeGeometry = geometry;
        break;
      case "rect":
        this.cannonShape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
        this.threeGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        break;
      case "sphere":
        this.cannonShape = new CANNON.Sphere(size);
        this.threeGeometry = new THREE.SphereGeometry(size);
        break;
      case "cylinder":
        this.cannonShape = new CANNON.Cylinder(size.x, size.z, size.y, 10);
        this.threeGeometry = new THREE.CylinderGeometry(size.x, size.z, size.y, 10);
        break;
      default:
        this.cannonShape = new CANNON.Box(size.x, size.y, size.z);
        this.threeGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        break;
    }
    this.cannonMaterial = Game.materials.cannon.default;
    this.threeMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
    this.cannonBody = new CANNON.Body({
      mass: mass,
      type: CANNON.Body.STATIC,
      shape: this.cannonShape,
      position,
      material: this.cannonMaterial
    });
    this.threeMesh = new THREE.Mesh(this.threeGeometry, this.threeMaterial);

    Game.CannonWorld.addBody(this.cannonBody);
    Game.scene.add(this.threeMesh);
    new SyncedMesh(this.threeMesh, this.cannonBody);
  }
}

class MovingObstacle extends Obstacle {
  constructor(type, position, size, mass, options) {
    type = type || 'rect';
    super(type, position, size, mass);
    // this.cannonBody.material = CollisionMaterials.ground;
    this.cannonBody.type = CANNON.Body.STATIC;
    if (options) {
      Object.setPrototypeOf(options, {
        type: 'linear',
        interpolation: 'linear',
        offset: new CANNON.Vec3(0, 1, 0),
        totaltime: 1
      });
      this.centerPosition = position;
      this.type = options.type;
      this.interpolation = options.interpolation;
      this.offset = options.offset;
      this.speed = options.speed;
      this.totalTime = options.totaltime;
      this.startTime = UniversalClock.getElapsedTime();
      renderFoos.push((dt) => {
        let dfraction = (UniversalClock.getElapsedTime() - this.startTime) % this.totalTime / this.totalTime;
        // const deltaoffset = new CANNON.Vec3()
        let offset;
        let rads;
        switch (this.type) {
          case 'linear':
            offset = new THREE.Vector3().copy(this.offset).multiply(dfraction);
            this.position.copy(offset.add(this.centerPosition));
            break;
          case 'radial':
            rads = dfraction * Math.PI * 2;
            const x = Math.cos(rads);
            const z = Math.sin(rads);
            const newPos = new CANNON.Vec3(x, 0, z);
            newPos.x *= this.offset.x;
            newPos.y *= this.offset.y;
            newPos.z *= this.offset.z;
            this.cannonBody.position.copy(newPos.add(this.centerPosition));
            break;
          case 'rotational':
            rads = dfraction * Math.PI * 2;
            const angle = new CANNON.Vec3().set(rads * this.offset.x, rads * this.offset.y, rads * this.offset.z, 'XYZ');
            this.cannonBody.quaternion.setFromEuler(angle.x, angle.y, angle.z);
            break;
          case 'absolute':
            dfraction = Math.abs(dfraction - 0.5);
            offset = new THREE.Vector3().copy(this.offset).multiplyScalar(dfraction);
            this.cannonBody.position.copy(offset.add(this.centerPosition));
            break;
        }
        this.cannonBody.velocity.set(0, 0, 0);
      });
    }
  }

}

class SpinnerObstacle extends Obstacle {
  constructor(position, size, mass, type, motor, speed) {
    type = type || "rect";
    super(type, position, size, mass);
    this.cannonBody.type = CANNON.Body.DYNAMIC;
    const pivotMesh = new Obstacle("cylinder", position, new THREE.Vector3(1, size.y, 1), 5000);
    this.cannonBody.collisionFilterGroup = 4;
    // this.cannonBody.collisionFilterMask = 1
    pivotMesh.cannonBody.collisionFilterGroup = 2;
    // pivotMesh.cannonBody.collisionFilterMask = 1
    // pivotMesh.cannonBody.shapes[0].transformAllPoints(new CANNON.Vec3(0,0,0),new CANNON.Quaternion().copy(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2,0,0))))
    new SyncedMesh(pivotMesh.cannonBody, pivotMesh.threeMesh);
    pivotMesh.threeMaterial.color.g = 0.9;
    const hinge = new CANNON.HingeConstraint(pivotMesh.cannonBody, this.cannonBody, {
      pivotA: new CANNON.Vec3(0, 0, 0),
      axisA: new CANNON.Vec3(0, 1, 0),
      pivotB: new CANNON.Vec3(0, 0, 0),
      axisB: new CANNON.Vec3(0, 1, 0)
    });
    var stiffness = 1e50;
    var relaxation = 0;
    var timeStep = 1 / 60;
    hinge.rotationalEquation1.setSpookParams(stiffness, relaxation, timeStep);
    hinge.rotationalEquation2.setSpookParams(stiffness, relaxation, timeStep);
    hinge.equationY.setSpookParams(stiffness, relaxation, timeStep);


    //disable equations?
    // this.vlambda = 0
    // this.wlambda = 0
    // hinge.rotationalEquation1.b = 0
    // hinge.rotationalEquation2.b = 0
    // hinge.rotationalEquation1.eps = 0
    // hinge.rotationalEquation2.eps = 0
    // hinge.rotationalEquation1.restitution = -1
    // hinge.rotationalEquation2.restitution = -1
    // hinge.rotationalEquation1.a = 100
    // hinge.rotationalEquation2.a = 100
    if (motor) {
      // hinge.motorEquation.setSpookParams(1e16,1e16,1)
      // hinge.setMotorMaxForce(1e16)
      hinge.enableMotor();
      hinge.setMotorSpeed(speed);
      // hinge.enable()
      // hinge.update()
    }

    // hinge.enable()


    Game.CannonWorld.addConstraint(hinge);
  }
}


function importImageTexture(path) {
  path = "./" + "assets/" + path;
  return new Promise((res, rej) => {
    textureLoader.load(path, function (texture) {
      res(texture);
    }, undefined, function (error) {
      rej(error);
    });
  });
}
function importModel(path) {
  path = "./" + "assets/" + path;
  return new Promise((res, rej) => {
    modelLoader.load(path, function (gltf) {
      res(gltf);
    }, undefined, function (error) {
      rej(error);
    });
  });

}

function rigToConvexHull(mesh, correctPos, simplifyAmount = 0.875) {
  let simplified = mesh.clone();
  if (mesh.children.length > 0) simplified = mesh.children[1].clone();

  const modifier = new SimplifyModifier();
  let count = Math.floor(simplified.geometry.attributes.position.count * simplifyAmount);
  if (simplified.geometry.attributes.position.count - count < 130 && simplifyAmount != 0) count = simplified.geometry.attributes.position.count - 130;
  //improve this bc it okay
  // console.log(count,simplified.geometry.attributes.position.count)
  if (simplifyAmount != 0) simplified.geometry = modifier.modify(simplified.geometry, count);
  const points = new OLDTHREE.Geometry().fromBufferGeometry(simplified.geometry).vertices;

  const hullGeometry = new ConvexGeometry(points);


  const vertices = hullGeometry.vertices.map((v) => new CANNON.Vec3().copy(v));
  const faces = hullGeometry.faces.map((f) => [f.a, f.b, f.c]);
  const normals = hullGeometry.faces.map((f) => new CANNON.Vec3().copy(f.normal));

  const shape = new CANNON.ConvexPolyhedron({ vertices, faces, normals });

  shape.updateBoundingSphereRadius();
  if (correctPos) {
    const offset = -shape.boundingSphereRadius / 2;
    shape.transformAllPoints(new CANNON.Vec3(0, offset, 0));

    return { shape, offset };
  }
  return { shape };

}

function getCompoundHull(hull,linkto,scale = new THREE.Vector3(1,1,1)) {
  const data = hull.userData;
  const body = new CANNON.Body();
  let dims, type, shape;

  for (let name in data) {
    type = (name.search('sphere') > -1 && 'sphere') || (name.search('cube') > -1 && 'cube');
    if(!type)continue;
    // console.log(data[name],data[name][0])
    for(let i in data[name]){
      if(isNaN(data[name][i])){
        console.error("import has corrupted values: " + i + " of " + name)
        console.warn(hull)
      }
    }
    dims = [...data[name]];
    for(let i in dims){
      if(i == 3 || i == 4 || i == 5)continue;
      dims[i] = dims[i]*scale.toArray()[i%3]
    }
    shape = type == 'sphere'? new CANNON.Sphere(dims[6]) : new CANNON.Box(new CANNON.Vec3(dims[6],dims[7],dims[8]))
    body.addShape(shape,new CANNON.Vec3(dims[0],dims[1],dims[2]),new THREE.Quaternion().setFromEuler(new THREE.Euler(dims[3],dims[4],dims[5],'XYZ')))
    if(linkto){
      const geo = type == 'sphere'? new THREE.SphereGeometry(dims[6]) : new THREE.BoxGeometry(dims[6]*2,dims[7]*2,dims[8]*2)
      const mesh = new THREE.Mesh(geo,Game.materials.three.default)
      // mesh.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(dims[0],dims[1],dims[2]),new THREE.Quaternion().setFromEuler(new THREE.Euler(dims[3],dims[4],dims[5])),new THREE.Vector3(1,1,1)));
      const pos = mesh.geometry.attributes.position
      for(let i = 0; i < pos.count;i++){
        pos.array[i*3] += dims[0]
        pos.array[i*3+1] += dims[1]
        pos.array[i*3+2] += dims[2]
      }
      Game.scene.add(mesh)
      new SyncedMesh(mesh,body)
    }
  }
  return body
}


function TrimeshToPolyhedron(trimesh, upvector) {
  let p1 = new CANNON.Vec3(), p2 = new CANNON.Vec3(), p3 = new CANNON.Vec3(), p4 = new CANNON.Vec3(), mp = new CANNON.Vec3(), tmp = new CANNON.Vec3(), e1 = new CANNON.Vec3(), e2 = new CANNON.Vec3();
  const body = new CANNON.Body({
    mass: 1,
    type: CANNON.Body.DYNAMIC
  });
  for (let i = 0; i < trimesh.indices.length / 3; i++) {
    mp.set(0, 0, 0);
    trimesh.getTriangleVertices(i, p1, p2, p3);
    trimesh.getNormal(i, p4);
    if (upvector && p4.dot(upvector) < 0) p4.scale(-1, p4);
    p4.normalize();
    mp = mp.vadd(p1).vadd(p2).vadd(p3).scale(1 / 3);
    const vertices = [new CANNON.Vec3().copy(p1), new CANNON.Vec3().copy(p2), new CANNON.Vec3().copy(p3), mp.vadd(p4.scale(-1 / 2))];
    const faces = [[0, 1, 2], [0, 3, 1], [1, 3, 2], [2, 3, 0]];
    const normals = [new CANNON.Vec3().copy(p4)];
    for (let j = 0; j < 3; j++) {
      vertices[j].vsub(vertices[(j + 1) % 3], e1);
      vertices[(j + 1) % 3].vsub(p4, e2);
      tmp.set(0, 0, 0);
      const points = faces[j + 1];
      for (let p = 0; p < points.length; p++) {
        tmp.vadd(vertices[points[p]], tmp);
      }
      tmp.scale(1 / points.length, tmp);
      const normal = e1.cross(e2);
      normal.normalize();
      normal.scale(-1, normal);
      const angle = normal.dot(tmp);

      if (angle < 0) normal.scale(-1, normal);
      normals.push(normal);
    }
    const polyhedron = new CANNON.ConvexPolyhedron({ vertices, faces, normals });
    body.addShape(polyhedron);
  }
  return body;
}


export { GameLoader };