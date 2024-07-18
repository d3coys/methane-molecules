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
pointLight.position.set(0, 8, 0); // Position the light at the center top of the methane molecules
pointLight.castShadow = true;

// Adjust shadow camera settings
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 50;
pointLight.shadow.camera.left = -10;
pointLight.shadow.camera.right = 10;
pointLight.shadow.camera.top = 10;
pointLight.shadow.camera.bottom = -10;

scene.add(pointLight);

// Group to hold the molecules
const moleculeGroup = new THREE.Group();
moleculeGroup.position.y = 4.5; // Raise the whole group higher above the plane
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

// Position the camera closer to the molecules and a bit lower
camera.position.set(0, 3, 7); // Adjust the camera position closer to the molecules and lower
camera.lookAt(0, 3, 0); // Ensure the camera looks at the molecule group

// Custom controls to rotate the molecule group when the mouse or touch moves
let isInteracting = false;
let prevX = 0;
let prevY = 0;

function onPointerDown(event) {
    isInteracting = true;
    prevX = event.clientX || event.touches[0].clientX;
    prevY = event.clientY || event.touches[0].clientY;
}

function onPointerMove(event) {
    if (isInteracting) {
        const currentX = event.clientX || event.touches[0].clientX;
        const currentY = event.clientY || event.touches[0].clientY;
        const deltaX = currentX - prevX;
        const deltaY = currentY - prevY;

        moleculeGroup.rotation.y += deltaX * 0.01;
        moleculeGroup.rotation.x += deltaY * 0.01;

        prevX = currentX;
        prevY = currentY;
    }
}

function onPointerUp() {
    isInteracting = false;
}

document.addEventListener('mousedown', onPointerDown, false);
document.addEventListener('mousemove', onPointerMove, false);
document.addEventListener('mouseup', onPointerUp, false);
document.addEventListener('touchstart', onPointerDown, false);
document.addEventListener('touchmove', onPointerMove, false);
document.addEventListener('touchend', onPointerUp, false);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
