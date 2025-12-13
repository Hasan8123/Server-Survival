import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stats } from '@react-three/drei';
import { useGame } from '../state/GameContext';
import { CONFIG, TRAFFIC_TYPES } from '../config';
import { Service } from '../entities/Service';
import { Request } from '../entities/Request';
import { SoundService } from '../services/SoundService';

// Define global refs for Three.js groups
const serviceGroup = new THREE.Group();
const connectionGroup = new THREE.Group();
const requestGroup = new THREE.Group();

// Declare global access for Service and Request classes to the groups
declare module '../entities/Service' {
  interface Service {
    serviceGroup: THREE.Group;
    connectionGroup: THREE.Group;
  }
}

declare module '../entities/Request' {
  interface Request {
    requestGroup: THREE.Group;
  }
}

// Attach groups to the classes (replaces direct global access from old game.js)
// This will be better managed later, but for now, this allows the classes to function
(Service.prototype as any).serviceGroup = serviceGroup;
(Service.prototype as any).connectionGroup = connectionGroup;
(Request.prototype as any).requestGroup = requestGroup;


// This component will contain the main game logic and 3D scene
const GameContent: React.FC = () => {
  const { state, dispatch } = useGame();
  const { scene, camera, gl } = useThree();

  const [soundService, setSoundService] = useState<SoundService | null>(null);

  // Internet Node refs for local management
  const internetMeshRef = useRef<THREE.Mesh>();
  const internetRingRef = useRef<THREE.Mesh>();

  // --- Utility functions (moved from old game.js) ---

  const getTrafficType = useCallback(() => {
    const dist = state.trafficDistribution;
    const types = Object.keys(dist);
    const total = types.reduce((sum, type) => sum + (dist[type] || 0), 0);
    if (total === 0) return TRAFFIC_TYPES.STATIC;

    const r = Math.random() * total;
    let cumulative = 0;

    for (const type of types) {
      cumulative += dist[type] || 0;
      if (r < cumulative) {
        return TRAFFIC_TYPES[type as keyof typeof TRAFFIC_TYPES];
      }
    }
    return TRAFFIC_TYPES.STATIC;
  }, [state.trafficDistribution]);

  const snapToGrid = useCallback((vec: THREE.Vector3) => {
    const s = CONFIG.tileSize;
    return new THREE.Vector3(
      Math.round(vec.x / s) * s,
      0,
      Math.round(vec.z / s) * s
    );
  }, []);

  const getIntersect = useCallback((clientX: number, clientY: number) => {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Ground plane

    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(serviceGroup.children, true);
    if (intersects.length > 0) {
      let obj: THREE.Object3D = intersects[0].object;
      while (obj.parent && obj.parent !== serviceGroup) obj = obj.parent;
      return { type: "service", id: obj.userData.id, obj: obj };
    }

    if (internetMeshRef.current) {
      const intInter = raycaster.intersectObject(internetMeshRef.current);
      if (intInter.length > 0)
        return { type: "internet", id: "internet", obj: internetMeshRef.current };
    }


    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, target);
    return { type: "ground", pos: target };
  }, [camera]);


  // Placeholder for functions that interact with global state or effects
  const playSound = useCallback((effect: string) => {
    if (soundService) {
      // Need to map effect strings to SoundService methods
      // For now, simple direct calls
      if (effect === 'place') soundService.playPlace();
      if (effect === 'connect') soundService.playConnect();
      if (effect === 'delete') soundService.playDelete();
      if (effect === 'success') soundService.playSuccess();
      if (effect === 'fail') soundService.playFail();
      if (effect === 'fraudBlocked') soundService.playFraudBlocked();
    }
  }, [soundService]);

  const flashMoney = useCallback(() => {
    // This needs to be done via React state/dispatch for UI updates
    console.log("Flash money (placeholder)");
  }, []);

  const addInterventionWarning = useCallback((message: string, type: string, duration: number) => {
    // This needs to be done via React state/dispatch for UI updates
    console.log(`Add warning (placeholder): ${message} (${type})`);
  }, []);

  const updateScoreUI = useCallback(() => {
    // This needs to be done via React state/dispatch for UI updates
    console.log("Update score UI (placeholder)");
  }, []);

  // --- End Utility functions ---

  // Initial Three.js setup
  useEffect(() => {
    // Initialize SoundService
    if (!soundService) {
      const newSoundService = new SoundService();
      newSoundService.init();
      setSoundService(newSoundService);
      dispatch({ type: 'SET_SOUND_SERVICE', payload: newSoundService });
    }

    // Add groups to the scene
    scene.add(serviceGroup);
    scene.add(connectionGroup);
    scene.add(requestGroup);

    // Initial Three.js setup from old game.js
    scene.background = new THREE.Color(CONFIG.colors.bg);
    scene.fog = new THREE.FogExp2(CONFIG.colors.bg, 0.008);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 50, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const gridHelper = new THREE.GridHelper(
      CONFIG.gridSize * CONFIG.tileSize,
      CONFIG.gridSize,
      CONFIG.colors.grid,
      CONFIG.colors.grid
    );
    scene.add(gridHelper);

    // Internet Node setup
    const internetGeo = new THREE.BoxGeometry(6, 1, 10);
    const internetMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: 0x00ffff,
      emissiveIntensity: 0.7,
      roughness: 0.2,
    });
    const internetMesh = new THREE.Mesh(internetGeo, internetMat);
    internetMesh.position.copy(state.internetNode.position);
    internetMesh.castShadow = true;
    internetMesh.receiveShadow = true;
    scene.add(internetMesh);
    internetMeshRef.current = internetMesh; // Store mesh in ref

    const intRingGeo = new THREE.RingGeometry(7, 7.2, 32);
    const intRingMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const internetRing = new THREE.Mesh(intRingGeo, intRingMat);
    internetRing.rotation.x = -Math.PI / 2;
    internetRing.position.set(
      internetMesh.position.x,
      -internetMesh.position.y + 0.1,
      internetMesh.position.z
    );
    scene.add(internetRing);
    internetRingRef.current = internetRing; // Store ring in ref


    // Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    const d = 50;
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.top = d;
    camera.bottom = -d;
    camera.near = 1;
    camera.far = 1000;
    camera.position.set(50, 50, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();

    // Resize listener for camera aspect ratio
    const handleResize = () => {
      const newAspect = window.innerWidth / window.innerHeight;
      if (camera instanceof THREE.OrthographicCamera) {
        camera.left = -d * newAspect;
        camera.right = d * newAspect;
        camera.top = d;
        camera.bottom = -d;
      } else if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = newAspect;
      }
      camera.updateProjectionMatrix();
      gl.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [scene, camera, gl, soundService, dispatch]); // Dependencies for useEffect


  const lastTimeRef = useRef(performance.now());
  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  // Main game loop (animate function from game.js)
  useFrame(() => {
    const time = performance.now();
    const dt = Math.min(0.05, (time - lastTimeRef.current) / 1000) * state.timeScale;
    lastTimeRef.current = time;

    if (!state.isRunning || state.timeScale === 0) return;

    // --- Game Logic Updates ---

    // Update requests
    state.requests.forEach((req: Request) => req.update(dt));
    // Remove completed requests (will need to filter state.requests via dispatch)

    // Update services
    state.services.forEach((svc: Service) => svc.update(dt, state, dispatch, state.services)); // Pass state and dispatch

    // Update score UI (triggered by dispatch)
    // updateScoreUI();

    // --- End Game Logic Updates ---

    gl.render(scene, camera); // Explicitly render since we took over the loop
  });


  // Event Listeners (moved from old game.js)
  const isPanning = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const panSpeed = 0.1;
  const currentZoom = useRef(1);
  const minZoom = 0.5;
  const maxZoom = 3.0;
  const zoomSpeed = 0.001;

  // Mouse Down
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!state.isRunning) return;

    if (e.button === 2 || e.button === 1) { // Right-click or middle-click for panning
      isPanning.current = true;
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
      gl.domElement.style.cursor = "grabbing";
      e.preventDefault();
      return;
    }

    // Handle game interaction clicks (service selection, placement, etc.)
    const intersectResult = getIntersect(e.clientX, e.clientY);
    console.log("Intersect result:", intersectResult); // Debugging intersect
    // TODO: Implement actual game interaction logic based on activeTool
  }, [state.isRunning, getIntersect, gl.domElement]);

  // Mouse Move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning.current) {
      const dx = e.clientX - lastMouseX.current;
      const dy = e.clientY - lastMouseY.current;

      const panX = ((-dx * (camera as THREE.OrthographicCamera).right - (camera as THREE.OrthographicCamera).left) / window.innerWidth) * panSpeed;
      const panY = ((dy * (camera as THREE.OrthographicCamera).top - (camera as THREE.OrthographicCamera).bottom) / window.innerHeight) * panSpeed;

      // Assuming orthographic camera and isometric view
      camera.position.x += panX;
      camera.position.z += panY; // Original game had Z for Y pan
      (camera as THREE.OrthographicCamera).lookAt(new THREE.Vector3(0,0,0)); // Look at center or specific target
      camera.updateProjectionMatrix();

      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
      // document.getElementById("tooltip")!.style.display = "none"; // Tooltip logic needs refactoring
      return;
    }

    // TODO: Implement hover logic for services, connections, etc.
  }, [camera, gl.domElement]);

  // Mouse Up
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (e.button === 2 || e.button === 1) {
      isPanning.current = false;
      gl.domElement.style.cursor = "default";
    }
    // TODO: Implement release logic for dragging, etc.
  }, [gl.domElement]);

  // Mouse Wheel for Zoom
  const handleMouseWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -zoomSpeed;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom.current + zoomDelta));

    if (newZoom !== currentZoom.current) {
      currentZoom.current = newZoom;
      (camera as THREE.OrthographicCamera).zoom = currentZoom.current;
      camera.updateProjectionMatrix();
    }
  }, [camera]);


  // Attach event listeners to the canvas
  useEffect(() => {
    const canvas = gl.domElement; // Get the raw DOM element of the canvas
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('wheel', handleMouseWheel, { passive: false });
      canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent context menu on right click
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('wheel', handleMouseWheel);
        canvas.removeEventListener('contextmenu', (e) => e.preventDefault());
      }
    };
  }, [gl.domElement, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseWheel]);


  // Keyboard navigation (from old game.js)
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      // TODO: Implement specific key actions (R for reset view, H for HUD toggle)
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      {/* OrbitControls for camera interaction in dev mode */}
      <OrbitControls makeDefault />
      {/* Stats component for performance monitoring */}
      <Stats />
      {/* Three.js content will be added here via declarative components later */}
    </>
  );
};

// Main GameScene component with Canvas
export const GameScene: React.FC = () => {
  return (
    <div id="canvas-container" className="absolute inset-0">
      <Canvas
        // Setup initial camera with orthographic type
        orthographic
        camera={{
          position: [50, 50, 50], // Initial camera position
          zoom: 1, // Initial zoom level
          left: -50 * (window.innerWidth / window.innerHeight), // Initial frustum
          right: 50 * (window.innerWidth / window.innerHeight),
          top: 50,
          bottom: -50,
          near: 1,
          far: 1000,
        }}
        // Apply shadows from the renderer
        shadows
      >
        <GameContent />
      </Canvas>
    </div>
  );
};