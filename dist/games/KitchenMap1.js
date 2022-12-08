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
      Banana: ["Banana.glb", 0.9],
      Potato: ["Potato.glb", 0.9],
      Strawberry: ["Strawberry.glb", 0],
      stove: ["Stove.glb", 0],
      Rat: "Rat.glb",
      board: "BambooCuttingBoard.glb",
      sink: "Sink.glb",
      watermelon: "SquareWatermelon.glb",
      duo_triple: "CounterCabinet_duo-triple.glb",
      "solo_single-left": "CounterCabinet_solo-single-left.glb",
      "duo-sextuple": "CounterCabinet_duo-sextuple.glb",
      "top-duo_double": "TopCabinet_duo-double.glb",
      "solo-zero": "CounterCabinet_solo-zero.glb",
      "top-corner-single-left": "TopCabinet_corner-single-left.glb",
      "top-solo-single-left": "TopCabinet_solo-single-left.glb"
    },
    images: {
      duck: 'duck.jpg',
      banana: 'BananaBake.png',
      wall_color: 'wall_color.png',
      floor_color: 'floor-brown-tile_color.png',
      tiny_brown: "small.png",
      backroom: 'backrooms.png',
      "floor-scratch": "floor-brown-tile_scratch.png"
    },
    videos: {
      // Rat_Trailer: 'RatatouilleTrailer.mp4'
    }
  },
  character: {
    // shader: 'bananaBake',
    texture: 'character',
    model: 'Potato',
    mass: 50,
    size: [0.2, 0.2, 0.2],
    walkSpeed: 2,
    sprintSpeed: 4,
    jumpPower: 3.5
  },
  materials: {
    three: {
      deflt: {
        type: 'ShaderMaterial',
        settings: {
          uniforms: {
            v_Uv: { value: { x: 0, y: 0 } }
          },
          vertexShader: `
                      varying vec2 v_Uv;
                      
                      void main( ) {
              
                          v_Uv = uv;
                          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                          gl_Position = projectionMatrix * mvPosition;
                          
                      } 
                  `,
          fragmentShader: `
                      varying vec2 v_Uv;
                  
                      void main( ) {
                      
                          vec2 position = v_Uv;
                          
                          vec3 color = vec3( position.x, position );
                          
                          // gl_FragColor = vec4( color, position.y ); // color, transparency
                          
                          gl_FragColor = vec4( floor(position.x*10.0)/10.0, floor(position.x*10.0)/5.0, floor(position.y*10.0)/5.0, 1 ); // is identical
                      }
                   `
        }
      },
      ring: {
        type: 'ShaderMaterial',
        settings: {
          uniforms: {
            v_Uv: { value: { x: 0, y: 0 } }
          },
          vertexShader: `
                      varying vec2 v_Uv;
                      
                      void main( ) {
              
                          v_Uv = uv;
                          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                          gl_Position = projectionMatrix * mvPosition;
                          
                      } 
                  `,
          fragmentShader: `
                      varying vec2 v_Uv;
                  
                      void main( ) {
                      
                          vec2 position = v_Uv;
                          
                          float inBounds = 0.0;
                          float dis = distance(position,vec2(0.5,0.5));
                          float min = 0.25;
                          float max = 0.3;
                          if(dis > max || dis < min){
                              inBounds = 1.0;
                          }
                          
                          gl_FragColor = vec4( inBounds, inBounds, inBounds, 1.0 );
                      }
                   `
        }
      },
      // video: {
      //   type: 'MeshBasicMaterial',
      //   settings: {
      //     map: 'Rat_Trailer'
      //   }
      // },
      duck: {
        type: 'MeshBasicMaterial',
        settings: {
          map: 'duck'
        }
      },
      character: {
        type: 'MeshPhongMaterial',
        settings: {
          color: 0xFF0000,
          transparent: true,
          opacity: 0.6,
          // side: 2
        }
      },
      default: {
        type: 'MeshPhongMaterial',
        settings: {
          color: 0xAAAA00,
          transparent: true,
          opacity: 0.4,
          // side: 2
        }
      },
      water: {
        type: 'MeshPhongMaterial',
        settings: {
          color: 0x0000AA,
          // side: 2
        }
      },
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
          // side: 2,
					// // color: 0xffffff,
					// bumpScale: 0.0005
        }
      },
      wall: {
        type: 'MeshPhongMaterial',
        settings: {
          map: "wall_color"
        }
      },
      backrooms: {
        type: 'MeshPhongMaterial',
        settings: {
          map: "backroom"
        }
      }
    },
    cannon: {
      default: {
        type: 'Material',
        friction: 1
      },
      character: {
        type: 'Material',
        settings: {
          friction: 1,
          restitution: 0
        }
      }
    }
  },
  objects: {
    list: [
      {
        "mass": 0,
        "model": "top-duo_double",
        "position": [
          -1.1999998092651367,
          6.0,
          9.0
        ],
        "rotation": [
          -0.0,
          -90.00000250447816,
          0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-import"
      },
      {
        "mass": 0,
        "model": "duo_triple",
        "position": [
          -9.0,
          0.0,
          0.0
        ],
        "rotation": [
          -0.0,
          -0.0,
          0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-import"
      },
      {
        "mass": 0,
        "position": [
          0.0,
          -0.10000000149011612,
          0.0
        ],
        "rotation": [
          -0.0,
          -0.0,
          0.0
        ],
        "shader": "floor",
        "shape": "box",
        "size": [
          20.0,
          0.20000004768371582,
          20.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-default"
      },
      {
        "mass": 0,
        "position": [
          -10.0,
          4.900000095367432,
          0.0
        ],
        "rotation": [
          -0.0,
          0.0,
          89.999995674289
        ],
        "shader": "wall",
        "shape": "box",
        "size": [
          10.0,
          0.20000004768371582,
          20.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "position": [
          0.0,
          4.900000095367432,
          10.0
        ],
        "rotation": [
          90.00000250447816,
          -90.00000250447816,
          -2.5044782690431654e-06
        ],
        "shader": "wall",
        "shape": "box",
        "size": [
          10.0,
          0.20000004768371582,
          20.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-default"
      },
      {
        "mass": 0,
        "position": [
          10.0,
          4.900000095367432,
          0.0
        ],
        "rotation": [
          -0.0,
          180.00000500895632,
          -89.99998201391065
        ],
        "shader": "wall",
        "shape": "box",
        "size": [
          10.0,
          0.20000004768371582,
          20.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-default"
      },
      {
        "mass": 0,
        "model": "duo-sextuple",
        "position": [
          -6.25,
          -0.0010000000474974513,
          9.0
        ],
        "rotation": [
          -0.0,
          -90.00000250447816,
          0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Import"
      },
      {
        "mass": 0,
        "model": "solo_single-left",
        "position": [
          -9.0,
          0.0,
          6.989999771118164
        ],
        "rotation": [
          -0.0,
          -0.0,
          0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Import"
      },
      {
        "mass": 0,
        "model": "top-duo_double",
        "position": [
          -9.0,
          6.0,
          3.240000009536743
        ],
        "rotation": [
          -0.0,
          -0.0,
          0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-import"
      },
      {
        "mass": 0,
        "model": "top-duo_double",
        "position": [
          -5.199999809265137,
          6.0,
          9.520000457763672
        ],
        "rotation": [
          -0.0,
          -90.00000250447816,
          0.0
        ],
        "shader": "default",
        "size": [
          0.9599999785423279,
          2.0,
          2.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-import"
      },
      {
        "pointNumber": 0,
        "position": [
          -8.985669136047363,
          3.299999952316284,
          -1.7846007347106934
        ],
        "rotation": [
          -0.0,
          -0.0,
          0.0
        ],
        "shader": "default",
        "size": [
          0.20000004768371582,
          0.20000004768371582,
          0.20000004768371582
        ],
        "texture": "default",
        "type": "checkPoint"
      },
      {
        "mass": 0,
        "model": "stove",
        "position": [
          -3.2700002193450928,
          0.0,
          9.018022537231445
        ],
        "rotation": [
          -0.0,
          -90.00000250447816,
          0.0
        ],
        "shader": "default",
        "size": [
          2.799999952316284,
          3.200000047683716,
          2.799999952316284
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-import"
      },
      {
        "mass": 0,
        "model": "board",
        "position": [
          -8.899999618530273,
          3.154726505279541,
          0.800000011920929
        ],
        "rotation": [
          -0.0,
          90.00000250447816,
          0.0
        ],
        "shader": "default",
        "size": [
          1.0,
          1.0,
          1.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-import"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -0.2948188781738281,
          3.299999952316284,
          -0.04796314239501953
        ],
        "rotation": [
          -0.0,
          -0.0,
          0.0
        ],
        "shader": "ring",
        "size": [
          0.20000004768371582,
          0.20000004768371582,
          0.20000004768371582
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "checkPoint"
      },
      {
        "mass": 0,
        "model": "board",
        "position": [
          -4.903310775756836,
          3.0464658737182617,
          4.131101608276367
        ],
        "rotation": [
          5.1855909832096526e-08,
          146.2822297560548,
          2.9803065136713434
        ],
        "shader": "default",
        "size": [
          4.699426651000977,
          2.0,
          0.5882564187049866
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-import"
      },
      {
        "mass": 0,
        "model": "board",
        "position": [
          2.0220251083374023,
          1.6662651300430298,
          5.642040729522705
        ],
        "rotation": [
          -27.544071422511863,
          90.00000250447816,
          1.3003777965141562e-07
        ],
        "shader": "default",
        "size": [
          3.8137972354888916,
          0.9999997615814209,
          2.3773138523101807
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-import"
      },
      {
        "mass": 0,
        "position": [
          0.0,
          4.900000095367432,
          -10.0
        ],
        "rotation": [
          -90.00000250447816,
          89.999995674289,
          2.8004002927834246e-05
        ],
        "shader": "wall",
        "shape": "box",
        "size": [
          10.0,
          0.20000004768371582,
          20.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-default"
      },
      {
        "mass": 0,
        "model": "sink",
        "pointNumber": 0,
        "position": [
          -9.001099586486816,
          0.0,
          4.010618686676025
        ],
        "rotation": [
          -0.0,
          -0.0,
          0.0
        ],
        "shader": "default",
        "shape": "box",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Import"
      },
      {
        "mass": 0,
        "position": [
          -9.001099586486816,
          1.8,
          4.010618686676025
        ],
        "rotation": [
          -0.0,
          -0.0,
          0.0
        ],
        "shader": "water",
        "shape": "box",
        "size": [
          1.8,
          1,
          2.5
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "obstacle",
        "subType": 'moving',
        "subsubType": 'rect',
        "options": {
          offset:[0,0.8,0],
          totaltime: 10,
          interpolation: 'absolute'
        }
      },
      {
        "mass": 0,
        "model": "solo-zero",
        "pointNumber": 0,
        "position": [
          -8.995000839233398,
          0.0,
          8.99000072479248
        ],
        "rotation": [
          -0.0,
          90.00000250447816,
          0.0
        ],
        "shader": "default",
        "shape": "box",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Import"
      },
      {
        "mass": 0,
        "model": "top-corner-single-left",
        "pointNumber": 0,
        "position": [
          -8.600000381469727,
          6.0,
          8.600000381469727
        ],
        "rotation": [
          -0.0,
          -90.00000250447816,
          0.0
        ],
        "shader": "default",
        "shape": "box",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Import"
      },
      {
        "mass": 0,
        "model": "top-solo-single-left",
        "pointNumber": 0,
        "position": [
          -9.399999618530273,
          6.0,
          6.240000247955322
        ],
        "rotation": [
          -0.0,
          -0.0,
          0.0
        ],
        "shader": "default",
        "shape": "box",
        "size": [
          1.2000000476837158,
          2.0,
          2.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Import"
      },
      {
        "mass": 0,
        "model": "duo_triple",
        "position": [
          1.430511474609375e-06,
          0.0,
          -2.0
        ],
        "rotation": [
          -0.0,
          -90.00000250447816,
          0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.2208104133605957
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-import"
      },
      {
        "mass": 0,
        "model": "duo_triple",
        "position": [
          -1.0,
          0.0,
          1.0
        ],
        "rotation": [
          -0.0,
          -179.99997768819966,
          0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-import"
      },
      {
        "mass": 0,
        "model": "duo-sextuple",
        "position": [
          0.9999999403953552,
          -0.0009999275207519531,
          0.9999994039535522
        ],
        "rotation": [
          -0.0,
          -0.0,
          0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.2857141494750977
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Import"
      }
    ]
  }
};

export { TestGame };
