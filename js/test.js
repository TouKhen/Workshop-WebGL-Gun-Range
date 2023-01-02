import * as THREE from "three";

const scene = new THREE.Scene();
scene.backgroundColor = new THREE.Color(0x70877f);

for (let i = 0; i < 200; i++) {
  let compteur = Math.floor(Math.random() * (5 - 1) + 1);
  console.log(compteur);
  if (compteur === 1) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  }
  if (compteur === 2) {
    const geometry = new THREE.CapsuleGeometry(1, 1, 4, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xee7224 });
    const capsule = new THREE.Mesh(geometry, material);
    scene.add(capsule);
  }
  if (compteur === 3) {
    const geometry = new THREE.RingGeometry(1, 5, 32);
    const material = new THREE.MeshBasicMaterial({
      color: "0c6291",
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }
  if (compteur === 4) {
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: "b5d6d6" });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
  }
}
//camera
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 1, 5000);
// scene.add(camera);
camera.position.setZ(30);

//render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function render() {
  //  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
