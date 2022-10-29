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
      duo_triple: "CounterCabinet_duo-triple.glb",
      "solo_single-left": "CounterCabinet_solo-single-left.glb",
      "duo-sextuple": "CounterCabinet_duo-sextuple.glb",
      "top-duo_double": "TopCabinet_duo-double.glb",
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
    model: 'Rat',
    mass: 50,
    size: [0.6, 0.6, 0.6],
    walkSpeed: 4,
    sprintSpeed: 6,
    jumpPower: 5
  },
  materials: {
    three: {
      default: {
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
                          
                          gl_FragColor = vec4( floor(position.x*10.0)/10.0, floor(position.x*10.0)/5.0, floor(position.y*10.0)/5.0, position.y*10.0 ); // is identical
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
      floor: {
        type: 'MeshPhongMaterial',
        settings: {
          map: "floor_color",
          bumpMap: "floor-scratch",
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
          -9.0,
          6.0,
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
        "type": "sync-Import"
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
        "type": "sync-Import"
      },
      {
        "mass": 0,
        "model": "board",
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
        "type": "sync-Default"
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
        "type": "sync-Default"
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
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          20.0,
          4.900000095367432,
          -10.0
        ],
        "rotation": [
          -90.00000250447816,
          89.999995674289,
          2.8004002927834246e-05
        ],
        "shader": "backrooms",
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
        "model": "duo-sextuple",
        "position": [
          -9.0,
          0.0,
          3.75
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
        "model": "solo_single-left",
        "position": [
          -9.0,
          0.0,
          6.5
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
          4.0
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
          8.0
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
        "model": "board",
        "position": [
          0.0,
          1.5,
          0.10000000149011612
        ],
        "rotation": [
          -0.0,
          -0.0,
          0.0
        ],
        "shader": "brown",
        "shape": "box",
        "size": [
          6.0,
          3.0,
          6.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
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
          -9.100000381469727,
          0.0,
          -3.4119768142700195
        ],
        "rotation": [
          -0.0,
          -0.0,
          0.0
        ],
        "shader": "default",
        "size": [
          2.5598042011260986,
          3.1997549533843994,
          3.1997549533843994
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Import"
      },
      {
        "mass": 0,
        "model": "board",
        "position": [
          -8.899999618530273,
          3.1164803504943848,
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
        "type": "sync-Import"
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
        "type": "sync-Import"
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
        "syncDirection": 1,
        "texture": "default",
        "type": "sync-Import"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
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
        "type": "visual"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          0.0,
          -0.09999990463256836,
          -20.0
        ],
        "rotation": [
          2.5044809152646603e-06,
          89.999995674289,
          3.733867057044566e-05
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          20.0,
          0.20000004768371582,
          20.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -20.0,
          -0.09999990463256836,
          -20.0
        ],
        "rotation": [
          2.5044809152646603e-06,
          89.999995674289,
          3.733867057044566e-05
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          20.0,
          0.20000004768371582,
          20.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          20.0,
          -0.09999990463256836,
          -20.0
        ],
        "rotation": [
          2.5044809152646603e-06,
          89.999995674289,
          3.733867057044566e-05
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          20.0,
          0.20000004768371582,
          20.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          20.0,
          -0.09999990463256836,
          -40.0
        ],
        "rotation": [
          2.5044809152646603e-06,
          89.999995674289,
          3.733867057044566e-05
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          20.0,
          0.20000004768371582,
          20.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          0.0,
          -0.09999990463256836,
          -40.0
        ],
        "rotation": [
          2.5044809152646603e-06,
          89.999995674289,
          3.733867057044566e-05
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          20.0,
          0.20000004768371582,
          20.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -20.0,
          -0.09999990463256836,
          -40.0
        ],
        "rotation": [
          2.5044809152646603e-06,
          89.999995674289,
          3.733867057044566e-05
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          20.0,
          0.20000004768371582,
          20.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          30.0,
          4.900000095367432,
          -20.0
        ],
        "rotation": [
          -0.0,
          0.0,
          89.99996152334315
        ],
        "shader": "backrooms",
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
        "model": "board",
        "pointNumber": 0,
        "position": [
          30.0,
          4.900000095367432,
          -40.0
        ],
        "rotation": [
          -0.0,
          0.0,
          89.99996152334315
        ],
        "shader": "backrooms",
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
        "model": "board",
        "pointNumber": 0,
        "position": [
          -20.0,
          4.900000095367432,
          -10.0
        ],
        "rotation": [
          90.00000250447816,
          -89.999995674289,
          -4.667334146994507e-05
        ],
        "shader": "backrooms",
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
        "model": "board",
        "pointNumber": 0,
        "position": [
          -30.0,
          4.900000095367432,
          -20.0
        ],
        "rotation": [
          -0.0,
          180.00000500895632,
          -89.99994103277564
        ],
        "shader": "backrooms",
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
        "model": "board",
        "pointNumber": 0,
        "position": [
          -30.0,
          4.900000095367432,
          -40.0
        ],
        "rotation": [
          -0.0,
          180.00000500895632,
          -89.99994103277564
        ],
        "shader": "backrooms",
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
        "model": "board",
        "pointNumber": 0,
        "position": [
          -20.0,
          4.900000095367432,
          -50.0
        ],
        "rotation": [
          -90.00000250447816,
          89.999995674289,
          9.266342692144292e-05
        ],
        "shader": "backrooms",
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
        "model": "board",
        "pointNumber": 0,
        "position": [
          0.0,
          4.900000095367432,
          -50.0
        ],
        "rotation": [
          -90.00000250447816,
          89.999995674289,
          9.266342692144292e-05
        ],
        "shader": "backrooms",
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
        "model": "board",
        "pointNumber": 0,
        "position": [
          20.0,
          4.900000095367432,
          -70.0
        ],
        "rotation": [
          -90.00000250447816,
          89.999995674289,
          9.266342692144292e-05
        ],
        "shader": "backrooms",
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
        "model": "board",
        "pointNumber": 0,
        "position": [
          10.0,
          4.900000095367432,
          -60.0
        ],
        "rotation": [
          88.08417542342461,
          -88.08417542342461,
          89.99987273088394
        ],
        "shader": "backrooms",
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
          30.0,
          4.900000095367432,
          -60.0
        ],
        "rotation": [
          88.08417542342461,
          -88.08417542342461,
          89.99987273088394
        ],
        "shader": "backrooms",
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
        "model": "board",
        "pointNumber": 0,
        "position": [
          20.0,
          -0.09999990463256836,
          -60.0
        ],
        "rotation": [
          2.5044809152646603e-06,
          89.999995674289,
          3.733867057044566e-05
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          20.0,
          0.20000004768371582,
          20.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -9.0,
          4.900000095367432,
          -15.0
        ],
        "rotation": [
          88.08417542342461,
          88.08417542342461,
          89.99987273088394
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          0.20000004768371582,
          10.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -16.0,
          4.900000095367432,
          -20.0
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597428208054376
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          0.20000004768371582,
          10.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -22.0,
          4.900000095367432,
          -15.0
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597428208054376
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          4.414881706237793,
          4.414880752563477
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -2.602327585220337,
          4.900000095367432,
          -29.675872802734375
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597428208054376
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          4.414881706237793,
          4.414880752563477
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          20.368602752685547,
          4.900000095367432,
          -20.104650497436523
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597428208054376
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          4.414881706237793,
          4.414880752563477
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          19.6029052734375,
          4.900000095367432,
          -40.14040756225586
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597428208054376
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          4.414881706237793,
          4.414880752563477
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -19.064823150634766,
          4.900000095367432,
          -42.947967529296875
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597428208054376
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          4.414881706237793,
          4.414880752563477
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          19.092445373535156,
          4.900000095367432,
          -58.26192092895508
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597428208054376
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          4.414881706237793,
          4.414880752563477
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -4.244787216186523,
          4.900000095367432,
          -41.05440139770508
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597428208054376
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          4.414881706237793,
          4.414880752563477
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -27.0,
          4.900000095367432,
          -24.0
        ],
        "rotation": [
          -91.67428677572339,
          -88.32571140304377,
          -89.99985224031643
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          0.20000004768371582,
          10.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -18.30739974975586,
          4.900000095367432,
          -28.834308624267578
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597428208054376
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          0.20000004768371582,
          10.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -14.0239839553833,
          4.900000095367432,
          -35.309303283691406
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597426905299177
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          7.827620029449463,
          7.82761812210083
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          8.06387996673584,
          4.900000095367432,
          -37.854148864746094
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597428208054376
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          8.907261848449707,
          8.907259941101074
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          10.464070320129395,
          4.900000095367432,
          -24.622333526611328
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597428208054376
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          12.131885528564453,
          12.13188362121582
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -5.044849395751953,
          4.900000095367432,
          -23.39146614074707
        ],
        "rotation": [
          90.00000250447816,
          89.999995674289,
          -0.00016597428208054376
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          3.7129440307617188,
          12.13188362121582
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          24.052841186523438,
          4.900000095367432,
          -30.185850143432617
        ],
        "rotation": [
          -91.67428677572339,
          -88.32571823323295,
          -89.99985224031643
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          3.7129440307617188,
          12.13188362121582
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          20.0,
          5.900000095367432,
          -50.0
        ],
        "rotation": [
          -90.00000250447816,
          89.999995674289,
          9.266342692144292e-05
        ],
        "shader": "backrooms",
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
        "model": "board",
        "pointNumber": 0,
        "position": [
          25.490989685058594,
          4.900000095367432,
          -49.9889030456543
        ],
        "rotation": [
          -90.00000250447816,
          89.999995674289,
          9.266342692144292e-05
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          0.20000004768371582,
          9.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          4.490989685058594,
          5.900000095367432,
          -49.9889030456543
        ],
        "rotation": [
          -90.00000250447816,
          89.999995674289,
          9.266342692144292e-05
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          0.20000004768371582,
          9.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          13.490989685058594,
          4.900000095367432,
          -49.9889030456543
        ],
        "rotation": [
          -90.00000250447816,
          89.999995674289,
          9.266342692144292e-05
        ],
        "shader": "backrooms",
        "shape": "box",
        "size": [
          10.0,
          0.20000004768371582,
          9.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "sync-Default"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          -5.5,
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
          9.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "border"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          5.5,
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
          9.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "border"
      },
      {
        "mass": 0,
        "model": "board",
        "pointNumber": 0,
        "position": [
          2.5,
          6.900000095367432,
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
          9.0
        ],
        "syncDirection": 0,
        "texture": "default",
        "type": "border"
      }
    ]
  }
};

export { TestGame };
