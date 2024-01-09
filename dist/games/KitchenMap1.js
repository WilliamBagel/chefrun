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
      SantaRat: "RatSanta.glb",
      board: "BambooCuttingBoard.glb",
      sink: "Sink.glb",
      panel_vent: "panel_vent.glb",
      vent_panel: "vent_panel.glb",
      watermelon: "SquareWatermelon.glb",
      duo_triple: "CounterCabinet_duo-triple.glb",
      "solo_single-left": "CounterCabinet_solo-single-left.glb",
      "duo-sextuple": "CounterCabinet_duo-sextuple.glb",
      "top-duo_double": "TopCabinet_duo-double.glb",
      "solo-zero": "CounterCabinet_solo-zero.glb",
      "top-corner-single-left": "TopCabinet_corner-single-left.glb",
      "top-solo-single-left": "TopCabinet_solo-single-left.glb",
      "easter-egg": "EasterEgg.glb",
      "pan":"Pan.glb",
      "lantern": "NYLantern.glb"
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
    mass: 100,
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
      // wall_hole: {
      //   type: 'ShaderMaterial',
      //   settings: {
      //     transparent: true,
      //     depthWrite: false,
      //     uniforms: {
      //       diffuseTexture: {
      //         value: "wall_color"
      //       },
      //       excludeHulls: {
      //         value: []
      //       }
      //     },
      //     vertexShader: `
      //     #define LAMBERT
      //     varying vec3 vViewPosition;


      //                 varying vec3 pos;
      //                 varying vec2 v_uv;

      //                 void main( ) {


      //                     vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      //                     gl_Position = projectionMatrix * mvPosition;
      //                     v_uv = uv;
      //                     pos = (modelMatrix * vec4(position,1.0)).xyz;
      //                 } 
      //             `,
      //     fragmentShader: `
      //                 varying vec3 pos;
      //                 varying vec2 v_uv;
      //                 uniform sampler2D diffuseTexture;
      //                 uniform vec4 excludeHulls[/*<hullNumber>*/1/*</hullNumber>*/];

      //                 #define LAMBERT\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>

      //                 float insideBox3D(vec3 v, vec3 bottomLeft, vec3 topRight) {
      //                     vec3 s = step(bottomLeft, v) - step(topRight, v);
      //                     return abs(s.x) * abs(s.y) * abs(s.z); 
      //                 }

      //                 float insideSphere(vec3 point, vec4 info){
      //                   vec3 sphere = vec3(info.xyz);
      //                   float radius = info.w;
      //                   return (point.x - sphere.x) * (point.x - sphere.x) +(point.y - sphere.y) * (point.y - sphere.y) +(point.z - sphere.z) * (point.z - sphere.z);
      //                 }



      //                 void main( ) {
      //                     float alpha = 1.0;
      //                     for(int i = 0; i < /*<hullNumber>*/1/*</hullNumber>*/;i++)
      //                     {
      //                       vec4 vector = excludeHulls[i];
      //                       if(vector.w == 0.)
      //                       {
      //                         alpha-=insideBox3D(pos,vec3(vector),vec3(excludeHulls[i+1]));
      //                         i++;
      //                       }
      //                       else
      //                       {
      //                         alpha-=insideSphere(pos,vector);
      //                       }
      //                     }
      //                     float value = 0.0;
      //                     if(pos.x > -1. && pos.y > 0. && pos.z > -11. && pos.x < 1. && pos.y < 2. && pos.z < -9.){
      //                       value = 1.0;
      //                     }
      //                     vec4 color = texture2D(diffuseTexture,v_uv);
      //                     color.w = alpha;
      //                     gl_FragColor = color;
      //                 }
      //              `
      //   }
      // },
      // wall_holeO: {
      //   type: 'ShaderMaterial',
      //   settings: {
      //     transparent: true,
      //     depthWrite: false,
      //     uniforms: {
      //       diffuseTexture: {
      //         value: "wall_color"
      //       },
      //       excludeHulls: {
      //         value: []
      //       }
      //     },
      //     vertexShader: `
      //                 varying vec3 pos;
      //                 varying vec2 v_uv;

      //                 void main( ) {
      //                     vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      //                     gl_Position = projectionMatrix * mvPosition;
      //                     v_uv = uv;
      //                     pos = (modelMatrix * vec4(position,1.0)).xyz;
      //                 } 
      //             `,
      //     fragmentShader: `
      //                 varying vec3 pos;
      //                 varying vec2 v_uv;
      //                 uniform sampler2D diffuseTexture;
      //                 uniform vec4 excludeHulls[/*<hullNumber>*/1/*</hullNumber>*/];


      //                 float insideBox3D(vec3 v, vec3 bottomLeft, vec3 topRight) {
      //                     vec3 s = step(bottomLeft, v) - step(topRight, v);
      //                     return abs(s.x) * abs(s.y) * abs(s.z); 
      //                 }

      //                 float insideSphere(vec3 point, vec4 info){
      //                   vec3 sphere = vec3(info.xyz);
      //                   float radius = info.w;
      //                   return (point.x - sphere.x) * (point.x - sphere.x) +(point.y - sphere.y) * (point.y - sphere.y) +(point.z - sphere.z) * (point.z - sphere.z);
      //                 }



      //                 void main( ) {
      //                     float alpha = 1.0;
      //                     for(int i = 0; i < /*<hullNumber>*/1/*</hullNumber>*/;i++)
      //                     {
      //                       vec4 vector = excludeHulls[i];
      //                       if(vector.w == 0.)
      //                       {
      //                         alpha-=insideBox3D(pos,vec3(vector),vec3(excludeHulls[i+1]));
      //                         i++;
      //                       }
      //                       else
      //                       {
      //                         alpha-=insideSphere(pos,vector);
      //                       }
      //                     }
      //                     float value = 0.0;
      //                     if(pos.x > -1. && pos.y > 0. && pos.z > -11. && pos.x < 1. && pos.y < 2. && pos.z < -9.){
      //                       value = 1.0;
      //                     }
      //                     vec4 color = texture2D(diffuseTexture,v_uv);
      //                     color.w = alpha;
      //                     gl_FragColor = color;
      //                 }
      //              `
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
        type: 'MeshLambertMaterial',
        settings: {
          color: 0xAAAA00,
          wireframe:true
          // transparent: true,
          // opacity: 0.4,
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
      board: {
        type: "modify",
        excludeHulls: true,
        settings: {
          transparent: true
        }
      },
      'solo_single-left': {
        type: "modify",
        excludeHulls: true,
        settings: {
          transparent: true,
          // roughnessMap: true
        }
      },
      'pan':{
        type:'modify',
        settings: {
          metallness: 0.9,
          roughness: 0.7
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
          transparent: true
          // side: 2,
          // // color: 0xffffff,
          // bumpScale: 0.0005
        },
        excludeHulls: true
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
        excludeHulls: true
      },
      backrooms: {
        type: 'MeshPhongMaterial',
        settings: {
          map: "backroom"
        }
      },
      string:{
        type: 'MeshBasicMaterial',
        settings:{
          color: 0xf757af
        }
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
        "mass": 0,
        "model": "top-duo_double",
        "position": [
          -1.1999998092651367,
          6.0,
          -9.0
        ],
        "rotation": [
          -0.0,
          -90.00000250447816,
          -0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube"
      },
      {
        "mass": 0,
        "model": "duo_triple",
        "position": [
          -9.0,
          0.0,
          -0.0
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.001"
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
        "model": "duo-sextuple",
        "position": [
          -6.25,
          -0.0010000000474974513,
          -9.0
        ],
        "rotation": [
          -0.0,
          -90.00000250447816,
          -0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "texture": "default",
        "type": "sync-Import",
        "uuid": "Cube.008"
      },
      {
        "mass": 0,
        "model": "solo_single-left",
        "position": [
          -9.0,
          0.0,
          -6.989999771118164
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "texture": "default",
        "type": "sync-Import",
        "uuid": "Cube.009"
      },
      {
        "mass": 0,
        "model": "top-duo_double",
        "position": [
          -9.0,
          6.0,
          -3.240000009536743
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.010"
      },
      {
        "mass": 0,
        "model": "top-duo_double",
        "position": [
          -5.199999809265137,
          6.0,
          -9.520000457763672
        ],
        "rotation": [
          -0.0,
          -90.00000250447816,
          -0.0
        ],
        "shader": "default",
        "size": [
          0.9599999785423279,
          2.0,
          2.0
        ],
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.011"
      },
      {
        "pointnumber": 1,
        "position": [
          -8.985669136047363,
          3.299999952316284,
          1.7846007347106934
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "default",
        "size": [
          0.20000004768371582,
          0.20000004768371582,
          0.20000004768371582
        ],
        "texture": "default",
        "type": "checkpoint",
        "uuid": "Cube.013"
      },
      {
        "mass": 0,
        "model": "stove",
        "position": [
          -3.2700002193450928,
          0.0,
          -9.018022537231445
        ],
        "rotation": [
          -0.0,
          -90.00000250447816,
          -0.0
        ],
        "shader": "default",
        "size": [
          2.799999952316284,
          3.200000047683716,
          2.799999952316284
        ],
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.014"
      },
      {
        "mass": 0,
        "model": "board",
        "position": [
          -8.899999618530273,
          3.154726505279541,
          -0.800000011920929
        ],
        "rotation": [
          -0.0,
          90.00000250447816,
          -0.0
        ],
        "shader": "default",
        "size": [
          1.0,
          1.0,
          1.0
        ],
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.015"
      },
      {
        "mass": 0,
        "model": "board",
        "position": [
          -4.903310775756836,
          3.0464658737182617,
          -4.131101608276367
        ],
        "rotation": [
          178.00604056379782,
          33.92613017353278,
          -176.8859851625641
        ],
        "shader": "default",
        "size": [
          4.699427127838135,
          2.0,
          1.1765127182006836
        ],
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.017"
      },
      {
        "mass": 0,
        "model": "board",
        "position": [
          2.0220251083374023,
          1.6662651300430298,
          -5.642040729522705
        ],
        "rotation": [
          -27.544071422511863,
          90.00000250447816,
          -0.0
        ],
        "shader": "default",
        "size": [
          3.8137972354888916,
          0.9999997615814209,
          2.3773138523101807
        ],
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.018"
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
        "mass": 0,
        "model": "sink",
        "position": [
          -9.001099586486816,
          0.0,
          -4.010618686676025
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
        "texture": "default",
        "type": "sync-Import",
        "uuid": "Cube.007"
      },
      {
        "mass": 0,
        "model": "solo-zero",
        "position": [
          -8.995000839233398,
          0.0,
          -8.99000072479248
        ],
        "rotation": [
          -0.0,
          90.00000250447816,
          -0.0
        ],
        "shader": "default",
        "shape": "box",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "texture": "default",
        "type": "sync-Import",
        "uuid": "Cube.002"
      },
      {
        "mass": 0,
        "model": "top-corner-single-left",
        "position": [
          -8.600000381469727,
          6.0,
          -8.600000381469727
        ],
        "rotation": [
          5.008956538086331e-06,
          -90.00000250447816,
          -0.0
        ],
        "shader": "default",
        "shape": "box",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "texture": "default",
        "type": "sync-Import",
        "uuid": "Cube.021"
      },
      {
        "mass": 0,
        "model": "top-solo-single-left",
        "position": [
          -9.399999618530273,
          6.0,
          -6.240000247955322
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "default",
        "shape": "box",
        "size": [
          1.2000000476837158,
          2.0,
          2.0
        ],
        "texture": "default",
        "type": "sync-Import",
        "uuid": "Cube.022"
      },
      {
        "mass": 0,
        "model": "duo_triple",
        "position": [
          1.430511474609375e-06,
          0.0,
          2.0
        ],
        "rotation": [
          -0.0,
          -90.00000250447816,
          -0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.2208104133605957
        ],
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.023"
      },
      {
        "mass": 0,
        "model": "duo_triple",
        "position": [
          -1.0,
          0.0,
          -1.0
        ],
        "rotation": [
          180.00000500895632,
          -1.866933528522283e-05,
          -180.00000500895632
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.024"
      },
      {
        "mass": 0,
        "model": "duo-sextuple",
        "position": [
          0.9999999403953552,
          -0.0009999275207519531,
          -0.9999994039535522
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "default",
        "size": [
          2.0,
          2.0,
          2.2857141494750977
        ],
        "texture": "default",
        "type": "sync-Import",
        "uuid": "Cube.025"
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
        "shape": "box",
        "size": [
          2.0000011920928955,
          3.6000001430511475,
          2.40000057220459
        ],
        "type": "excludehull",
        "uuid": "Cube.026"
      },
      {
        "position": [
          2.125960350036621,
          1.8727703094482422,
          -7.753249645233154
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shape": "box",
        "size": [
          2.0000011920928955,
          0.8314580321311951,
          7.321034908294678
        ],
        "type": "excludehull",
        "uuid": "Cube.027"
      },
      {
        "mass": 0,
        "model": "board",
        "position": [
          7.038611888885498,
          -0.2324269413948059,
          -4.143345832824707
        ],
        "rotation": [
          174.1330500968338,
          2.8000584618049413,
          -161.01106824832374
        ],
        "shader": "default",
        "size": [
          1.3465325832366943,
          10.13980484008789,
          1.12069833278656
        ],
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.028"
      },
      {
        "position": [
          6.520054817199707,
          0.5271568298339844,
          -3.800124168395996
        ],
        "rotation": [
          57.77715075521731,
          -34.84840378697044,
          13.821374436499164
        ],
        "shape": "box",
        "size": [
          0.40812963247299194,
          0.5171838998794556,
          3.638484477996826
        ],
        "type": "excludehull",
        "uuid": "Cube.029"
      },
      {
        "position": [
          0.29794955253601074,
          3.7681403160095215,
          9.93570327758789
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shape": "box",
        "size": [
          3.9879937171936035,
          0.5686312913894653,
          1.2835150957107544
        ],
        "type": "excludehull",
        "uuid": "Cube.030"
      },
      {
        "position": [
          -3.243835210800171,
          4.490860939025879,
          9.93570327758789
        ],
        "rotation": [
          0.9405264402208646,
          6.194741239920146,
          -18.840974372642624
        ],
        "shape": "box",
        "size": [
          3.9879932403564453,
          0.5686312317848206,
          1.2835150957107544
        ],
        "type": "excludehull",
        "uuid": "Cube.031"
      },
      {
        "position": [
          3.8889739513397217,
          4.252504825592041,
          9.93570327758789
        ],
        "rotation": [
          -1.1661243868552122,
          6.483264652160763,
          18.859122185267346
        ],
        "shape": "box",
        "size": [
          3.9879937171936035,
          0.5686312317848206,
          1.2835150957107544
        ],
        "type": "excludehull",
        "uuid": "Cube.032"
      },
      {
        "position": [
          -2.0778748989105225,
          7.119647979736328,
          10.069376945495605
        ],
        "rotation": [
          0.9417158536317989,
          6.829040844458542,
          18.627501932775754
        ],
        "shape": "box",
        "size": [
          1.9897100925445557,
          1.995640754699707,
          1.9937841892242432
        ],
        "type": "excludehull",
        "uuid": "Cube.034"
      },
      {
        "position": [
          2.3054893016815186,
          7.098668575286865,
          10.311054229736328
        ],
        "rotation": [
          0.9417158536317989,
          6.829040844458542,
          18.627501932775754
        ],
        "shape": "box",
        "size": [
          1.9897100925445557,
          1.995640754699707,
          1.9937841892242432
        ],
        "type": "excludehull",
        "uuid": "Cube.035"
      },
      {
        "position": [
          -8.071410179138184,
          0.32874196767807007,
          -6.468672752380371
        ],
        "rotation": [
          0.0,
          -0.0,
          -180.00000500895632
        ],
        "shape": "box",
        "size": [
          1.453710675239563,
          0.5537728071212769,
          0.3456480801105499
        ],
        "type": "excludehull",
        "uuid": "Cube.033"
      },
      {
        "mass": 0.0,
        "position": [
          2.2613296508789062,
          4.880832672119141,
          7.5805535316467285
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "string",
        "shape": "box",
        "size": [
          1.0,
          1.0000001192092896,
          1.0
        ],
        "syncdirection": 0,
        "texture": "default",
        "type": "sync-default",
        "uuid": "Cube.041"
      },
      {
        "mass": 10.0,
        "position": [
          5.0,
          8.800000190734863,
          7.5
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "string",
        "shape": "box",
        "size": [
          0.050000011920928955,
          1.0,
          0.050000011920928955
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-default",
        "uuid": "Cube.042"
      },
      {
        "bodyA": "Cube.041",
        "bodyB": "Cube.042",
        "pivotA": [
          -4.76837158203125e-07,
          -0.4999990463256836,
          4.76837158203125e-07
        ],
        "pivotB": [
          0.0,
          0.40000057220458984,
          4.76837158203125e-07
        ],
        "type": "constraint",
        "uuid": "Empty.003"
      },
      {
        "mass": 10.0,
        "position": [
          5.0,
          7.610000133514404,
          7.5
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "string",
        "shape": "box",
        "size": [
          0.050000011920928955,
          1.0,
          0.050000011920928955
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-default",
        "uuid": "Cube.043"
      },
      {
        "bodyA": "Cube.042",
        "bodyB": "Cube.043",
        "pivotA": [
          0.0,
          -0.5,
          4.76837158203125e-07
        ],
        "pivotB": [
          0.0,
          0.40000009536743164,
          4.76837158203125e-07
        ],
        "type": "constraint",
        "uuid": "Empty.009"
      },
      {
        "mass": 10.0,
        "position": [
          5.0,
          6.5,
          7.5
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "string",
        "shape": "box",
        "size": [
          0.050000011920928955,
          1.0,
          0.050000011920928955
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-default",
        "uuid": "Cube.044"
      },
      {
        "bodyA": "Cube.043",
        "bodyB": "Cube.044",
        "pivotA": [
          0.0,
          -0.5,
          4.76837158203125e-07
        ],
        "pivotB": [
          0.0,
          0.40000057220458984,
          4.76837158203125e-07
        ],
        "type": "constraint",
        "uuid": "Empty.014"
      },
      {
        "bodyA": "Cube.044",
        "bodyB": "Cube.054",
        "pivotA": [
          0.0,
          -0.5,
          4.76837158203125e-07
        ],
        "pivotB": [
          -0.023826122283935547,
          0.5137453079223633,
          -0.017727375030517578
        ],
        "type": "constraint",
        "uuid": "Empty.016"
      },
      {
        "mass": 0,
        "model": "panel_vent",
        "position": [
          10.700000762939453,
          0.35000133514404297,
          3.5
        ],
        "rotation": [
          -0.0,
          -90.00000250447816,
          -0.0
        ],
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncdirection": 0,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.046"
      },
      {
        "position": [
          10.020000457763672,
          0.3500001132488251,
          3.5
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shape": "box",
        "size": [
          1.0,
          0.6993000507354736,
          1.0
        ],
        "type": "excludehull",
        "uuid": "Cube.047"
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
        "position": [
          10.0,
          5.350000381469727,
          3.499999523162842
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shape": "box",
        "size": [
          0.20000731945037842,
          9.100000381469727,
          0.9999999403953552
        ],
        "texture": "default",
        "type": "border",
        "uuid": "Cube.050"
      },
      {
        "model": "vent_panel",
        "parent": "Cube.053",
        "position": [
          9.720001220703125,
          0.3500001132488251,
          3.5
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "type": "import",
        "uuid": "Cube.051"
      },
      {
        "parent": "",
        "position": [
          9.72557544708252,
          0.6928213834762573,
          3.5003135204315186
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shape": "box",
        "size": [
          0.19667471945285797,
          0.13753463327884674,
          1.0
        ],
        "texture": "default",
        "type": "border",
        "uuid": "Cube.052"
      },
      {
        "mass": 100.0,
        "parent": "",
        "position": [
          9.72557544708252,
          0.3524007499217987,
          3.5003135204315186
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shape": "box",
        "size": [
          0.09833735972642899,
          0.4951246380805969,
          0.7114551067352295
        ],
        "texture": "default",
        "type": "hidden",
        "uuid": "Cube.053"
      },
      {
        "bodyA": "Cube.052",
        "bodyB": "Cube.053",
        "pivotA": [
          0.0,
          -0.06580096483230591,
          -0.2999997138977051
        ],
        "pivotB": [
          -1.9073486328125e-06,
          0.24677696824073792,
          -0.2999999523162842
        ],
        "type": "constraint",
        "uuid": "Empty.018"
      },
      {
        "bodyA": "Cube.052",
        "bodyB": "Cube.053",
        "pivotA": [
          0.0,
          -0.06580096483230591,
          0.3000004291534424
        ],
        "pivotB": [
          -1.9073486328125e-06,
          0.24677696824073792,
          0.2999999523162842
        ],
        "type": "constraint",
        "uuid": "Empty.019"
      },
      {
        "isconnected": 1,
        "mass": 15.0,
        "model": "easter-egg",
        "opaque": 1,
        "position": [
          -9.001099586486816,
          0.0,
          -4.010618686676025
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          2.0,
          2.0,
          2.0
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
          -9.001099586486816,
          0.0,
          -4.010618686676025
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          2.0,
          2.0,
          2.0
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
          -9.001099586486816,
          0.0,
          -4.010618686676025
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          2.0,
          2.0,
          2.0
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
          -9.001099586486816,
          0.0,
          -4.010618686676025
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          2.0,
          2.0,
          2.0
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
          -9.001099586486816,
          0.0,
          -4.010618686676025
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          2.0,
          2.0,
          2.0
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
          -9.001099586486816,
          0.0,
          -4.010618686676025
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.066"
      },
      {
        "isconnected": 0,
        "mass": 0,
        "opaque": 0,
        "position": [
          0.0,
          -0.10000002384185791,
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
          0.40000075101852417,
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
        "mass": 0,
        "model": "pan",
        "opaque": 0,
        "position": [
          0.0,
          3.414231300354004,
          -0.0
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          4.0,
          4.0,
          4.0
        ],
        "syncdirection": 0,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.061"
      },
      {
        "isconnected": false,
        "mass": 50.0,
        "model": "lantern",
        "opaque": false,
        "position": [
          -4.060217380523682,
          1.3739502429962158,
          1.2534832954406738
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncdirection": true,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.067"
      },
      {
        "mass": 10.0,
        "position": [
          -2.4130077362060547,
          7.894242763519287,
          3.627469301223755
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "string",
        "shape": "box",
        "size": [
          0.020000003278255463,
          2.684891939163208,
          0.020000003278255463
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-default",
        "uuid": "Cube.069"
      },
      {
        "bodyA": "Cube.069",
        "bodyB": "Cube.067",
        "pivotA": [
          0.0,
          -1.3431286811828613,
          -0.0
        ],
        "pivotB": [
          -0.0003476142883300781,
          1.3526453971862793,
          0.004250526428222656
        ],
        "type": "constraint",
        "uuid": "Empty.027"
      },
      {
        "bodyA": "Cube.068",
        "bodyB": "Cube.069",
        "pivotA": [
          -1.7248274087905884,
          -0.4984760284423828,
          1.257734775543213
        ],
        "pivotB": [
          0.0,
          1.3401951789855957,
          2.384185791015625e-07
        ],
        "type": "constraint",
        "uuid": "Empty.025"
      },
      {
        "isconnected": 0,
        "mass": 0,
        "opaque": 0,
        "position": [
          0.0,
          9.90000057220459,
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
        "uuid": "Cube.068"
      },
      {
        "mass": 10.0,
        "position": [
          0.0692605972290039,
          8.710892677307129,
          0.7540435791015625
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "shader": "string",
        "shape": "box",
        "size": [
          0.020000003278255463,
          1.2302093505859375,
          0.020000003278255463
        ],
        "syncdirection": 1,
        "texture": "default",
        "type": "sync-default",
        "uuid": "Cube.070"
      },
      {
        "bodyA": "Cube.071",
        "bodyB": "Cube.070",
        "pivotA": [
          -0.00034737586975097656,
          1.3526453971862793,
          0.004250526428222656
        ],
        "pivotB": [
          0.0,
          -0.6162748336791992,
          2.384185791015625e-07
        ],
        "type": "constraint",
        "uuid": "Empty.030"
      },
      {
        "isconnected": false,
        "mass": 50.0,
        "model": "lantern",
        "opaque": false,
        "position": [
          -0.15641045570373535,
          6.457298755645752,
          1.2534832954406738
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          2.0,
          2.0,
          2.0
        ],
        "syncdirection": true,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.071"
      },
      {
        "bodyA": "Cube.068",
        "bodyB": "Cube.070",
        "pivotA": [
          0.0692605972290039,
          -0.4984760284423828,
          0.7540445327758789
        ],
        "pivotB": [
          0.0,
          0.615849494934082,
          2.384185791015625e-07
        ],
        "type": "constraint",
        "uuid": "Empty.035"
      },
      {
        "isconnected": false,
        "mass": 50.0,
        "model": "lantern",
        "opaque": false,
        "position": [
          5.0238261222839355,
          5.33625602722168,
          7.517727375030518
        ],
        "rotation": [
          0.0,
          -0.0,
          -0.0
        ],
        "size": [
          1.0,
          1.0,
          1.0
        ],
        "syncdirection": true,
        "texture": "default",
        "type": "sync-import",
        "uuid": "Cube.054"
      }
    ]
  }
};

export { TestGame };
