import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';

// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaa);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Simple lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
pointLight.castShadow = true;
scene.add(pointLight);

// Create the carbon atom
const carbonGeometry = new THREE.SphereGeometry(1, 32, 32);
const carbonMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
const carbon = new THREE.Mesh(carbonGeometry, carbonMaterial);
carbon.castShadow = true;
carbon.position.y = 2; // Raise carbon atom higher above the plane
scene.add(carbon);

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
    hydrogen.position.y += 2; // Raise hydrogen atoms higher above the plane
    hydrogen.castShadow = true;
    scene.add(hydrogen);

    const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);
    const bondMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    const bond = new THREE.Mesh(bondGeometry, bondMaterial);
    
    bond.position.copy(carbon.position).add(new THREE.Vector3(...pos).multiplyScalar(0.5));
    bond.lookAt(carbon.position);
    bond.rotateX(Math.PI / 2);
    bond.castShadow = true;
    scene.add(bond);
});

// Add a green plane
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1; // Lower the plane to ensure molecules float above it
plane.receiveShadow = true;
scene.add(plane);

// Position the camera
camera.position.set(0, 5, 10); // Adjust the camera position for a better view

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
