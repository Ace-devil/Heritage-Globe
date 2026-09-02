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

// Targeted regions with exact geographical coordinates
const REGION_LOCATIONS = [
  { key: 'coorg', name: 'Coorg', lat: 12.3375, lng: 75.8069 },
  { key: 'ziro', name: 'Ziro Valley', lat: 27.5389, lng: 93.8378 },
  { key: 'rajasthan', name: 'Rajasthan', lat: 27.0238, lng: 74.2179 },
  { key: 'kerala', name: 'Kerala', lat: 10.8505, lng: 76.2711 },
  { key: 'varanasi', name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { key: 'hampi', name: 'Hampi', lat: 15.3350, lng: 76.4600 }
];

// Helper: Convert Lat/Lng into 3D Vector coordinates on a sphere
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export default function GlobeView({ onSelectRegion }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer = null;
    let controls = null;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 3.2);

    // SUN
    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    // TEXTURES
    const textureLoader = new THREE.TextureLoader();
    const dayTexture = textureLoader.load('/textures/planets/earth_day_4096.jpg');
    dayTexture.colorSpace = THREE.SRGBColorSpace;
    dayTexture.anisotropy = 8;

    const nightTexture = textureLoader.load('/textures/planets/earth_night_4096.jpg');
    nightTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.anisotropy = 8;

    const bumpTexture = textureLoader.load('/textures/planets/earth_bump_roughness_clouds_4096.jpg');
    bumpTexture.anisotropy = 8;

    // ATMOSPHERE (TSL)
    const atmosphereDayColor = uniform(color('#4db2ff'));
    const atmosphereTwilightColor = uniform(color('#bc490b'));

    const viewDirection = normalize(positionWorld.sub(cameraPosition));
    const fresnel = viewDirection.dot(normalWorld).abs().oneMinus();
    const sunDirection = normalize(sun.position);
    const sunOrientation = normalWorld.dot(sunDirection);

    const atmosphereColor = mix(
      atmosphereTwilightColor,
      atmosphereDayColor,
      sunOrientation.smoothstep(-0.25, 0.75)
    );

    // EARTH MATERIAL (TSL)
    const earthMaterial = new MeshStandardNodeMaterial();
    const cloudsStrength = texture(bumpTexture, uv()).b.smoothstep(0.2, 1.0);
    const dayColor = texture(dayTexture, uv());
    const nightColor = texture(nightTexture, uv());
    const dayStrength = sunOrientation.smoothstep(-0.25, 0.5);

    let finalColor = mix(nightColor.rgb, dayColor.rgb, dayStrength);
    const atmosphereMix = sunOrientation
      .smoothstep(-0.5, 1.0)
      .mul(fresnel.pow(2))
      .clamp(0, 1);

    finalColor = mix(finalColor, atmosphereColor, atmosphereMix);
    finalColor = mix(finalColor, vec3(1), cloudsStrength.mul(0.35));

    earthMaterial.colorNode = finalColor;
    earthMaterial.roughnessNode = 0.35;

    // GEOMETRY & GROUP
    const earthGeometry = new THREE.SphereGeometry(1, 128, 128);
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);

    // 📍 ADD 3D REGION PINS INSIDE EARTH GROUP
    const pinsList = [];
    REGION_LOCATIONS.forEach((loc) => {
      const pinGeo = new THREE.SphereGeometry(0.025, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xff9933 });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);

      const pos = latLngToVector3(loc.lat, loc.lng, 1.015);
      pinMesh.position.copy(pos);

      pinMesh.userData = { regionKey: loc.key, name: loc.name };

      earthGroup.add(pinMesh);
      pinsList.push(pinMesh);
    });

    // 🇮🇳 FORCE INDIA UPRIGHT & FACING CAMERA
    const INDIA_LAT = 22.5;
    const INDIA_LON = 78.9;

    earthGroup.rotation.set(0, 0, 0);
    earthGroup.rotation.y = THREE.MathUtils.degToRad(-INDIA_LON - 90);
    earthGroup.rotation.x = THREE.MathUtils.degToRad(INDIA_LAT);

    // ATMOSPHERE MESH
    const atmosphereMaterial = new MeshBasicNodeMaterial({
      side: THREE.BackSide,
      transparent: true
    });
    let atmosphereAlpha = fresnel.smoothstep(0.73, 1).pow(3);
    atmosphereAlpha = atmosphereAlpha.mul(sunOrientation.smoothstep(-0.5, 1));
    atmosphereMaterial.colorNode = vec4(atmosphereColor, atmosphereAlpha);

    const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial);
    atmosphere.scale.setScalar(1.045);
    earthGroup.add(atmosphere);

    // CLICK DETECTION FOR PINS ONLY
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (event) => {
      pointerDownPos = { x: event.clientX, y: event.clientY };
    };

    const handlePointerUp = (event) => {
      const deltaX = Math.abs(event.clientX - pointerDownPos.x);
      const deltaY = Math.abs(event.clientY - pointerDownPos.y);
      if (deltaX > 5 || deltaY > 5) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const pinIntersects = raycaster.intersectObjects(pinsList);
      if (pinIntersects.length > 0) {
        const clickedPin = pinIntersects[0].object;
        if (onSelectRegion) {
          onSelectRegion(clickedPin.userData.regionKey);
        }
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // RENDERER & CONTROLS
    async function init() {
      try {
        renderer = new WebGPURenderer({ antialias: true });
        await renderer.init();

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.zIndex = '1';

        container.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.rotateSpeed = 0.35;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.enableZoom = true;
        controls.minDistance = 1.5;
        controls.maxDistance = 8;
        controls.target.set(0, 0, 0);

        camera.position.set(0, 0, 3.2);
        camera.lookAt(0, 0, 0);
        controls.update();

        function animate() {
          controls.update();
          renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate);
      } catch (error) {
        console.error('WebGPU initialization failed:', error);
      }
    }

    init();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (renderer) {
        renderer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);

      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
      }
      if (controls) {
        controls.dispose();
      }
      earthGeometry.dispose();
    };
  }, [onSelectRegion]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
}