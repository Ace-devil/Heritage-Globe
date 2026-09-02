import * as THREE from 'three';
import { useEffect, useRef } from 'react';

import { WebGPURenderer } from 'three/webgpu';

import {
  MeshStandardNodeMaterial,
  MeshBasicNodeMaterial
} from 'three/webgpu';

import {
  texture,
  uv,
  positionWorld,
  normalWorld,
  cameraPosition,
  normalize,
  mix,
  vec3,
  vec4,
  color,
  uniform
} from 'three/tsl';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import './App.css';


function App() {

  const containerRef = useRef(null);

  useEffect(() => {

    const container = containerRef.current;

    let renderer = null;
    let controls = null;

    // =====================================================
    // SCENE
    // =====================================================

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x000000);


    // =====================================================
    // CAMERA
    // =====================================================

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    // Keep Earth centered
    camera.position.set(0, 0, 3.2);


    // =====================================================
    // SUN
    // =====================================================

    const sun = new THREE.DirectionalLight(
      0xffffff,
      2.5
    );

    sun.position.set(5, 3, 5);

    scene.add(sun);


    // =====================================================
    // TEXTURES
    // =====================================================

    const textureLoader = new THREE.TextureLoader();

    const dayTexture = textureLoader.load(
      '/textures/planets/earth_day_4096.jpg'
    );

    dayTexture.colorSpace = THREE.SRGBColorSpace;
    dayTexture.anisotropy = 8;


    const nightTexture = textureLoader.load(
      '/textures/planets/earth_night_4096.jpg'
    );

    nightTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.anisotropy = 8;


    const bumpTexture = textureLoader.load(
      '/textures/planets/earth_bump_roughness_clouds_4096.jpg'
    );

    bumpTexture.anisotropy = 8;


    // =====================================================
    // ATMOSPHERE COLORS
    // =====================================================

    const atmosphereDayColor = uniform(
      color('#4db2ff')
    );

    const atmosphereTwilightColor = uniform(
      color('#bc490b')
    );


    // =====================================================
    // DIRECTIONS
    // =====================================================

    const viewDirection = normalize(
      positionWorld.sub(cameraPosition)
    );

    const fresnel =
      viewDirection
        .dot(normalWorld)
        .abs()
        .oneMinus();


    const sunDirection = normalize(
      sun.position
    );

    const sunOrientation =
      normalWorld.dot(sunDirection);


    const atmosphereColor = mix(
      atmosphereTwilightColor,
      atmosphereDayColor,
      sunOrientation.smoothstep(
        -0.25,
        0.75
      )
    );


    // =====================================================
    // EARTH MATERIAL
    // =====================================================

    const earthMaterial =
      new MeshStandardNodeMaterial();


    // -----------------------------------------------------
    // CLOUDS
    // -----------------------------------------------------

    const cloudsStrength =
      texture(
        bumpTexture,
        uv()
      )
        .b
        .smoothstep(0.2, 1.0);


    // -----------------------------------------------------
    // DAY
    // -----------------------------------------------------

    const dayColor =
      texture(
        dayTexture,
        uv()
      );


    // -----------------------------------------------------
    // NIGHT
    // -----------------------------------------------------

    const nightColor =
      texture(
        nightTexture,
        uv()
      );


    // -----------------------------------------------------
    // DAY / NIGHT TRANSITION
    // -----------------------------------------------------

    const dayStrength =
      sunOrientation.smoothstep(
        -0.25,
        0.5
      );


    let finalColor =
      mix(
        nightColor.rgb,
        dayColor.rgb,
        dayStrength
      );


    // =====================================================
    // ATMOSPHERE ON EARTH
    // =====================================================

    const atmosphereMix =
      sunOrientation
        .smoothstep(-0.5, 1.0)
        .mul(fresnel.pow(2))
        .clamp(0, 1);


    finalColor =
      mix(
        finalColor,
        atmosphereColor,
        atmosphereMix
      );


    // =====================================================
    // CLOUDS
    // =====================================================

    finalColor =
      mix(
        finalColor,
        vec3(1),
        cloudsStrength.mul(0.35)
      );


    earthMaterial.colorNode =
      finalColor;

    earthMaterial.roughnessNode =
      0.35;


    // =====================================================
    // EARTH GEOMETRY
    // =====================================================

    const earthGeometry =
      new THREE.SphereGeometry(
        1,
        128,
        128
      );


    // =====================================================
    // EARTH + ATMOSPHERE GROUP
    // =====================================================

    const earthGroup =
      new THREE.Group();

    scene.add(earthGroup);


    // =====================================================
    // EARTH
    // =====================================================

    const earth =
      new THREE.Mesh(
        earthGeometry,
        earthMaterial
      );

    earthGroup.add(earth);


    // =====================================================
    // INDIA STARTING POSITION
    // =====================================================

    // IMPORTANT:
    // 78 degrees is the orientation that matches
    // your Earth texture and puts India toward
    // the center of the screen.

    // =====================================================
// 🇮🇳 FORCE INDIA TO FACE THE CAMERA
// =====================================================

// Approximate center of India
const INDIA_LAT = 22.5;
const INDIA_LON = 78.9;

// Convert latitude / longitude to a 3D point
const lat = THREE.MathUtils.degToRad(INDIA_LAT);
const lon = THREE.MathUtils.degToRad(INDIA_LON);

const indiaPosition = new THREE.Vector3(
  Math.cos(lat) * Math.sin(lon),
  Math.sin(lat),
  Math.cos(lat) * Math.cos(lon)
);

// Camera is looking toward +Z,
// so India must point toward +Z.
const targetDirection = new THREE.Vector3(0, 0, 1);

// Calculate rotation needed to bring India to the front
const indiaQuaternion =
  new THREE.Quaternion().setFromUnitVectors(
    indiaPosition.normalize(),
    targetDirection
);

// Apply the calculated rotation
earthGroup.quaternion.copy(indiaQuaternion);


    // =====================================================
    // ATMOSPHERE
    // =====================================================

    const atmosphereMaterial =
      new MeshBasicNodeMaterial({
        side: THREE.BackSide,
        transparent: true
      });


    let atmosphereAlpha =
      fresnel
        .smoothstep(0.73, 1)
        .pow(3);


    atmosphereAlpha =
      atmosphereAlpha.mul(
        sunOrientation.smoothstep(
          -0.5,
          1
        )
      );


    atmosphereMaterial.colorNode =
      vec4(
        atmosphereColor,
        atmosphereAlpha
      );


    const atmosphere =
      new THREE.Mesh(
        earthGeometry,
        atmosphereMaterial
      );


    atmosphere.scale.setScalar(
      1.045
    );


    // Atmosphere stays attached to Earth
    earthGroup.add(atmosphere);


    // =====================================================
    // RENDERER
    // =====================================================

    async function init() {

      try {

        renderer =
          new WebGPURenderer({
            antialias: true
          });


        // Initialize WebGPU
        await renderer.init();


        renderer.setPixelRatio(
          Math.min(
            window.devicePixelRatio,
            2
          )
        );


        renderer.setSize(
          window.innerWidth,
          window.innerHeight
        );


        renderer.domElement.style.position =
          'absolute';

        renderer.domElement.style.left =
          '0';

        renderer.domElement.style.top =
          '0';

        renderer.domElement.style.width =
          '100%';

        renderer.domElement.style.height =
          '100%';


        container.appendChild(
          renderer.domElement
        );


        // =================================================
        // ORBIT CONTROLS
        // =================================================

        controls =
          new OrbitControls(
            camera,
            renderer.domElement
          );


        controls.enableDamping =
          true;

        controls.enablePan =
          false;

        controls.enableZoom =
          true;


        controls.minDistance =
          1.5;

        controls.maxDistance =
          8;


        // Always orbit around Earth center
        controls.target.set(
          0,
          0,
          0
        );


        // =================================================
        // RESET INITIAL CAMERA
        // =================================================

        camera.position.set(
          0,
          0,
          3.2
        );

        camera.lookAt(
          0,
          0,
          0
        );

        controls.update();


        // =================================================
        // ANIMATION
        // =================================================

        function animate() {

          controls.update();

          renderer.render(
            scene,
            camera
          );

        }


        renderer.setAnimationLoop(
          animate
        );


      } catch (error) {

        console.error(
          'WebGPU initialization failed:',
          error
        );

      }

    }


    init();


    // =====================================================
    // RESIZE
    // =====================================================

    function resize() {

      const width =
        window.innerWidth;

      const height =
        window.innerHeight;


      camera.aspect =
        width / height;

      camera.updateProjectionMatrix();


      if (renderer) {

        renderer.setSize(
          width,
          height
        );

      }

    }


    window.addEventListener(
      'resize',
      resize
    );


    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {

      window.removeEventListener(
        'resize',
        resize
      );


      if (renderer) {

        renderer.setAnimationLoop(
          null
        );

        renderer.dispose();

      }


      if (controls) {

        controls.dispose();

      }


      earthGeometry.dispose();

    };

  }, []);


  // =======================================================
  // REACT
  // =======================================================

  return (

    <div
      ref={containerRef}
      className="globe-container"
    />

  );

}

export default App;