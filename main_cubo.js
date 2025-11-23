// Seleziona il contenitore hero e l'overlay del testo
const hero = document.getElementById("hero");
const overlay = document.querySelector(".hero-overlay");

// SCENA THREE.JS DI BASE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // nero

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 4;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Aggiunge il canvas dentro l'hero
hero.appendChild(renderer.domElement);

// Geometria di test: un cubo (qui metterai il tuo modello)
const geometry = new THREE.BoxGeometry(2.5, 1.5, 1.5);
const material = new THREE.MeshStandardMaterial({
  color: 0x888888,
  metalness: 0.5,
  roughness: 0.25
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Luci
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(3, 3, 5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Gestione resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// VARIABILE CHE TERRÀ TRACCIA DELLO SCROLL
let scrollProgress = 0;

// Funzione che aggiorna scrollProgress e l'opacity del testo
function onScroll() {
  // Quanto vogliamo che incida lo scroll?
  // Qui prendiamo come "range" un'altezza di viewport (100vh)
  const maxScroll = window.innerHeight;

  // Limitiamo il valore al massimo
  const y = Math.min(window.scrollY, maxScroll);

  scrollProgress = y / maxScroll; // da 0 (top) a 1 (dopo 100vh)

  // Fai svanire l'overlay
  const fadeFactor = 2.2; // >1 per farlo sparire prima di arrivare al maxScroll
  const opacity = Math.max(0, 1 - scrollProgress * fadeFactor);
  overlay.style.opacity = opacity.toString();
}

window.addEventListener("scroll", onScroll);

// ANIMAZIONE
function animate() {
  requestAnimationFrame(animate);

  // Rotazione "tipo CAD":
  // - attorno all'asse Y (ruota lateralmente)
  // - un po' anche attorno all'asse X (ruota in su/giù)
  const fullTurns = 1 * Math.PI; // un giro completo
  mesh.rotation.y = scrollProgress * fullTurns;       // orbit attorno a Y
  mesh.rotation.x = scrollProgress * (Math.PI / 2);   // mezzo giro attorno a X

  renderer.render(scene, camera);
}

animate();
