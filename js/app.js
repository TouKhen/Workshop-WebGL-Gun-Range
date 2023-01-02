import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let cube, controls, raycaster;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const pointer = new THREE.Vector2();

const blocker = document.getElementById("blocker");
const instructions = document.getElementById("instructions");

// Camera
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 1, 5000);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1020);

controls = new PointerLockControls(camera, document.body);

instructions.addEventListener("click", function () {
  controls.lock();
});

controls.addEventListener("lock", function () {
  instructions.style.display = "none";
  blocker.style.display = "none";
});

controls.addEventListener("unlock", function () {
  blocker.style.display = "block";
  instructions.style.display = "";
});

scene.add(controls.getObject());

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.PointLight(0xffffff, 2, 500);
light.position.set(-5, 15, 0);
scene.add(light);

// Ambient light
const ambient = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambient);

// red : 0xff0000
// purple : 0x7353ba;

// Texture

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  "./assets/pdpnew.png",
  (texture) => {
    buildMesh(texture);
  },
  undefined,
  (error) => {
    console.log(error);
  }
);

// TorusKnot

function buildMesh(texture) {
  const geometry = new THREE.BoxBufferGeometry();
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: texture,
  });
}

// Map

const gltfLoader = new GLTFLoader();

gltfLoader.load(
  // resource URL
  "../assets/models/map.glb",
  // called when the resource is loaded
  function (gltf) {
    gltf.scene.scale.set(3.5, 3.5, 3.5);
    scene.add(gltf.scene);
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

// Gun

gltfLoader.load(
  // resource URL
  "../assets/models/gun.glb",
  // called when the resource is loaded
  function (gltf) {
    gltf.scene.scale.set(10, 10, 10);
    gltf.scene.name = "gun";
    scene.add(gltf.scene);
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

// Controls
scene.add(controls.getObject());

const onKeyDown = function (event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveForward = true;
      break;

    case "ArrowLeft":
    case "KeyA":
      moveLeft = true;
      break;

    case "ArrowDown":
    case "KeyS":
      moveBackward = true;
      break;

    case "ArrowRight":
    case "KeyD":
      moveRight = true;
      break;

    case "Space":
      if (canJump === true) velocity.y += 175;
      canJump = false;
      break;
  }
};

const onKeyUp = function (event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveForward = false;
      break;

    case "ArrowLeft":
    case "KeyA":
      moveLeft = false;
      break;

    case "ArrowDown":
    case "KeyS":
      moveBackward = false;
      break;

    case "ArrowRight":
    case "KeyD":
      moveRight = false;
      break;
  }
};

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

raycaster = new THREE.Raycaster(
  new THREE.Vector3(),
  new THREE.Vector3(0, -1, 0),
  0,
  10
);

camera.position.setY(2);

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

const objects = scene.children;

function render() {
  //   if (cube) cube.rotation.y += 0.005;

  const time = performance.now();

  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;
    }
  }

  for (const object of scene.children) {
    if (object.name === "gun") {
      object.position.x = camera.position.x;
      object.position.y = camera.position.y - 1.5;
      object.position.z = camera.position.z + 2;

      object.rotateY(camera.rotation.y);
    }
  }

  prevTime = time;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
