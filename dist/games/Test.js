var TestGame = {
  settings: {
    yLevel: -50
  },
  scene: {

  },
  imports: {
    models: {
      RoundCharacter: "TripGuyCharacter_Basic_Round.glb",
      Banana: ["Banana.glb", 0.9],
      Potato: ["Potato.glb", 0.9],
      Strawberry: ["Strawberry.glb", 0],
      Stove: ["Stove.glb", 0],
      Rat: "Rat.glb"
    },
    images: {
      duck: 'duck.jpg',
      banana: 'BananaBake.png'
    },
    videos: {
      Rat_Trailer: 'RatatouilleTrailer.mp4'
    }
  },
  character: {
    // shader: 'bananaBake',
    texture: 'character',
    model: 'Rat',
    mass: 20,
    size: [3, 3, 3]
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
      video: {
        type: 'MeshBasicMaterial',
        settings: {
          map: 'Rat_Trailer'
        }
      },
      duck: {
        type: 'MeshBasicMaterial',
        settings: {
          map: 'duck'
        }
      },
      character: {
        type: 'MeshBasicMaterial',
        settings: {
          color: 0xFF0000,
          transparent: true,
          opacity: 0.6,
          side: 2
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
        type: 'sync-Poly',
        shape: 'quad',
        verts: [
          -10, 0, 0,
          30, 0, 0,
          0, 0, 20,
          20, 0, 20
          // -2.0,  2.0,  2.0,
        ],
        indices: [0, 1, 2, 1, 3, 2],
        mass: 10,
        size: [1, 1, 1],
        position: [40, -5, 40],
        shader: 'default',
        texture: 'default',
      },
      {
        type: 'sync-Import',
        texture: 'default',
        model: 'Rat', 
        shader: true,
        position: [10, 9, 10],
        size: [2, 2, 2],
        mass: 1,
      },
      // {
      //     type: 'border',
      //     texture: 'default',
      //     shape: 'box',
      //     position: [-10,5,0], 
      //     size: [1,10,40],
      //     mass: undefined,
      // },
      {
        type: 'sync-Default',
        shader: 'duck',
        texture: 'default',
        shape: 'box',
        position: [200, 20, 0],
        size: [1, 128, 200],
        rotation: [0, 0, -50],
        mass: undefined,
        syncDir: false
      },
      {
        type: 'sync-Default',
        shader: 'default',
        texture: 'default',
        shape: 'box',
        position: [0, -5, 0],
        size: [30, 10, 100],
        rotation: [-10, 0, 0],
        mass: undefined,
        syncDir: false
      },
      {
        type: 'sync-Default',
        shader: 'default',
        texture: 'default',
        shape: 'box',
        position: [100, -10, 0],
        size: [200, 1, 200],
        rotation: [0, 0, 0],
        mass: undefined,
        syncDir: false
      },
      {
        type: 'sync-Default',
        shader: 'default',
        texture: 'default',
        shape: 'box',
        position: [25, -5, 0],
        size: [20, 10, 20],
        mass: undefined,
        syncDir: true
      },
      {
        type: 'sync-Default',
        shader: 'default',
        texture: 'default',
        shape: 'box',
        position: [50, -5, 0],
        size: [20, 10, 20],
        mass: undefined,
        syncDir: true
      },
      {
        type: 'sync-Default',
        shader: 'video',
        texture: 'default',
        shape: 'box',
        position: [-100, 15, 0],
        size: [0.01, 52, 100],
        mass: undefined,
        syncDir: true
      },
      {
        type: 'obstacle',
        subType: 'spinner',
        position: [25, 6, 0],
        size: [12, 10, 1],
        mass: 1e4,
        subsubType: false,
        motorEnabled: true,
        speed: 300,
        shader: 'default',
        texture: 'default',
      },
      {
        type: 'obstacle',
        subType: 'spinner',
        position: [0, 8, 0],
        size: [12, 10, 1],
        mass: 1000,
        subsubType: false,
        motorEnabled: false,
        speed: false,
        shader: 'default',
        texture: 'default',
      },
      {
        type: 'checkPoint',
        pointNumber: 0,
        position: [0, 0.5, -15],
        size: [10, 1, 10],
        mass: undefined,
        shader: 'ring',
        texture: 'default',
      },
      {
        type: 'checkPoint',
        pointNumber: 1,
        position: [25, 0.5, 15],
        size: [10, 1, 10],
        mass: undefined,
        shader: 'ring',
        texture: 'default',
      },
      {
        type: 'checkPoint',
        pointNumber: 2,
        position: [50, 0.5, -15],
        size: [10, 1, 10],
        mass: undefined,
        shader: 'ring',
        texture: 'default',
      },
    ]

  }
};

export { TestGame };