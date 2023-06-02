var TestGame = {
  flags: {
    debug: false
  },
  settings: {
    yLevel: -1
  },
  scene: {

  },
  imports: {
    models: {
      "pan":"Pan.glb",
      "easter-egg": "EasterEgg.glb"

    },
    images: {
      wall_color: 'wall_color.png',
      floor_color: 'floor-brown-tile_color.png',
    },
    videos: {
      // Rat_Trailer: 'RatatouilleTrailer.mp4'
    }
  },
  character: {
    // shader: 'bananaBake',
    texture: 'character',
    model: 'pan',
    mass: 1000,
    size: [1,1, 1],
    walkSpeed: 2,
    sprintSpeed: 4,
    jumpPower: 3.5
  },
  materials: {
    three: {
      floor: {
        type: 'MeshPhongMaterial',
        settings: {
          map: "floor_color",
          // bumpMap: "floor-scratch",
          bumpScale: 0.7
          // roughness: 0.8,
          // color: 0xffffff,
          // metalness: 0.2,
          // bumpScale: 0
        }
      },
      brown: {
        type: 'MeshPhongMaterial',
        settings: {
          color: 0x916d09,
          transparent: true
          // side: 2,
          // // color: 0xffffff,
          // bumpScale: 0.0005
        },
        // excludeHulls: true
      },
      wall: {
        type: 'MeshPhysicalMaterial',
        settings: {
          transparent: true,
          transmission: 0,
          thickness:1,
          depthWrite: false,
          map: "wall_color"
        },
        // excludeHulls: true
      }
    },
    cannon: {
      default: {
        type: 'Material',
        friction: 0.1
      },
      character: {
        type: 'Material',
        settings: {
          friction: 0,
          restitution: 0
        }
      }
    }
  },
  objects: {
    list:[
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          -0.02378714084625244,
          3.7293481826782227,
          0.19563990831375122
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.039"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          0.5632954835891724,
          3.756165027618408,
          0.49534332752227783
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.040"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          -0.3548516035079956,
          3.7260401248931885,
          0.8114709854125977
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.054"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          -0.6535747051239014,
          3.9089279174804688,
          -0.2843605875968933
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.055"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          -0.028881430625915527,
          3.8381261825561523,
          -0.8484420776367188
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.056"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          1.1070138216018677,
          3.7807068824768066,
          -0.03200596570968628
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.057"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          0.5604797601699829,
          3.7088351249694824,
          0.09258586168289185
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.058"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          1.0928698778152466,
          3.7816784381866455,
          0.45393216609954834
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.059"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          -0.0021795034408569336,
          3.718068838119507,
          0.7285565137863159
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.060"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          0.5644963979721069,
          3.670684814453125,
          -0.5302281379699707
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.062"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          1.0801864862442017,
          3.7925758361816406,
          -0.7063153386116028
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.063"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          -0.6264767646789551,
          3.8654160499572754,
          -0.8368961215019226
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.064"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          -0.6522376537322998,
          3.910156488418579,
          0.1765034794807434
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.065"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          0.30034148693084717,
          3.795769453048706,
          0.6748496294021606
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.066"
      }, 
      {
        "mass": 0,
        "position": [
          -10.0,
          4.900000095367432,
          -0.0
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "wall",
        "shape": "box",
        "size": [
          0.2000008076429367,
          10.0,
          20.0
        ],
        "texture": "default",
        "type": "sync-Default",
        "uuid": "Cube.004"
      },
      {
        "mass": 0,
        "position": [
          0.0,
          4.900000095367432,
          -10.0
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "wall",
        "shape": "box",
        "size": [
          20.0,
          10.000000953674316,
          0.20000092685222626
        ],
        "texture": "default",
        "type": "sync-default",
        "uuid": "Cube.005"
      },
      {
        "position": [
          10.0,
          4.900000095367432,
          -0.0
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "wall",
        "shape": "box",
        "size": [
          0.20000731945037842,
          10.0,
          20.0
        ],
        "type": "visual",
        "uuid": "Cube.006"
      },
      {
        "mass": 0,
        "position": [
          0.0,
          4.900000095367432,
          10.0
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "wall",
        "shape": "box",
        "size": [
          20.0,
          10.000001907348633,
          0.20000982284545898
        ],
        "texture": "default",
        "type": "sync-default",
        "uuid": "Cube.019"
      },
      {
        "position": [
          10.0,
          4.900000095367432,
          -3.5
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shape": "box",
        "size": [
          0.20000731945037842,
          10.0,
          13.0
        ],
        "texture": "default",
        "type": "border",
        "uuid": "Cube.048"
      },
      {
        "position": [
          10.0,
          4.900000095367432,
          7.0
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shape": "box",
        "size": [
          0.20000731945037842,
          10.0,
          6.0
        ],
        "texture": "default",
        "type": "border",
        "uuid": "Cube.049"
      },
      {
        "isconnected": 0,
        "mass": 0,
        "opaque": 0,
        "position": [
          0.0,
          0.0,
          -0.0
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "floor",
        "shape": "box",
        "size": [
          20.0,
          0.20000037550926208,
          20.0
        ],
        "syncdirection": 0,
        "texture": "default",
        "type": "sync-default",
        "uuid": "Cube.003"
      },
      {
        "isconnected": 0,
        "opaque": 0,
        "pointnumber": 0,
        "position": [
          0.0,
          4.460927963256836,
          -0.0
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "default",
        "size": [
          0.40000009536743164,
          0.40000009536743164,
          0.40000009536743164
        ],
        "texture": "default",
        "type": "checkpoint",
        "uuid": "Cube.016"
      },
      {
        "isconnected": 0,
        "mass": 100.0,
        "opaque": 0,
        "position": [
          0.0,
          3.2599868774414062,
          -0.0
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "default",
        "shape": "box",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-default",
        "uuid": "Cube.067"
      }
    ]
  }
};

export { TestGame };
