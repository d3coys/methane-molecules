import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';

// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000); // Set background color to black
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Simple lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
pointLight.castShadow = true;
scene.add(pointLight);

// Group to hold the molecules
const moleculeGroup = new THREE.Group();
moleculeGroup.position.y = 4; // Raise the whole group higher above the plane
scene.add(moleculeGroup);

// Create the carbon atom
const carbonGeometry = new THREE.SphereGeometry(1, 32, 32);
const carbonMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
const carbon = new THREE.Mesh(carbonGeometry, carbonMaterial);
carbon.castShadow = true;
moleculeGroup.add(carbon);

// Create the hydrogen atoms and bonds
const hydrogenGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const hydrogenMaterial = new THREE.MeshLambertMaterial({ color: 0x0000FF });
const hydrogenPositions = [
    [1.5, 1.5, 1.5],
    [-1.5, -1.5, 1.5],
    [1.5, -1.5, -1.5],
    [-1.5, 1.5, -1.5],
];

hydrogenPositions.forEach(pos => {
    const hydrogen = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
    hydrogen.position.set(...pos);
    hydrogen.castShadow = true;
    moleculeGroup.add(hydrogen);

    const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);
    const bondMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    const bond = new THREE.Mesh(bondGeometry, bondMaterial);
    
    bond.position.copy(carbon.position).add(new THREE.Vector3(...pos).multiplyScalar(0.5));
    bond.lookAt(carbon.position);
    bond.rotateX(Math.PI / 2);
    bond.castShadow = true;
    moleculeGroup.add(bond);
});

// Add a green circular plane
const planeGeometry = new THREE.CircleGeometry(10, 64);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = 0; // Keep the plane fixed at y = 0
plane.receiveShadow = true;
scene.add(plane);

// Position the camera closer to the molecules
camera.position.set(0, 5, 8); // Adjust the camera position closer to the molecules

// Custom controls to rotate the molecule group when the mouse moves
let isMouseDown = false;
let prevMouseX = 0;
let prevMouseY = 0;

function onMouseDown(event) {
    isMouseDown = true;
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
}

function onMouseMove(event) {
    if (isMouseDown) {
        const deltaX = event.clientX - prevMouseX;
        const deltaY = event.clientY - prevMouseY;

        moleculeGroup.rotation.y += deltaX * 0.01;
        moleculeGroup.rotation.x += deltaY * 0.01;

        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }
}

function onMouseUp() {
    isMouseDown = false;
}

document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('mouseup', onMouseUp, false);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
