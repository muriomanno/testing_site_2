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

// =======================
//  MODELLO GLB
// =======================

// Variabile che conterrà il tuo modello
let model = null;

// Caricamento del modello GLB con GLTFLoader (vecchio stile)
const loader = new THREE.GLTFLoader();
loader.load(
  "model.glb", // il file è nella stessa cartella di index.html / main.js
  function (gltf) {
    model = gltf.scene;

    // Regola scala/posizione/rotazione iniziale a piacere
    model.scale.set(0.5, 0.5, 0.5);        // se è troppo grande/piccolo, prova 0.1 o 2
    model.position.set(0, 0, 0);     // centro
    model.rotation.set(0, 0, 0);     // nessuna rotazione iniziale

    scene.add(model);
  },
  function (xhr) {
    // opzionale: log di caricamento
    console.log((xhr.loaded / xhr.total) * 100 + "% caricato");
  },
  function (error) {
    console.error("Errore nel caricamento del modello:", error);
  }
);

// Se vuoi un cubo di test finché il modello non funziona, puoi usare questo:
// const geometry = new THREE.BoxGeometry(2.5, 1.5, 1.5);
// const material = new THREE.MeshStandardMaterial({
//   color: 0x888888,
//   metalness: 0.5,
//   roughness: 0.25
// });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// =======================
//  LUCI
// =======================
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

// =======================
//  SCROLL + FADE TESTO
// =======================
let scrollProgress = 0;

function onScroll() {
  const maxScroll = window.innerHeight; // range di scroll considerato (100vh)
  const y = Math.min(window.scrollY, maxScroll);

  scrollProgress = y / maxScroll; // da 0 (top) a 1 (dopo 100vh)

  // Fai svanire l'overlay più o meno velocemente
  const fadeFactor = 2.2; // aumenta per far sparire prima
  const opacity = Math.max(0, 1 - scrollProgress * fadeFactor);
  overlay.style.opacity = opacity.toString();
}

window.addEventListener("scroll", onScroll);

// =======================
//  ANIMAZIONE
// =======================
function animate() {
  requestAnimationFrame(animate);

  const fullTurns = 1 * Math.PI; // mezzo giro (2 * Math.PI per giro completo)

  // Ruota il modello se è stato caricato
  if (model) {
    model.rotation.y = scrollProgress * fullTurns;       // rotazione attorno a Y
    model.rotation.x = scrollProgress * (Math.PI / 2);   // mezzo giro attorno a X
  }

  // Se usi il cubo di test, decommenta queste due righe:
  // mesh.rotation.y = scrollProgress * fullTurns;
  // mesh.rotation.x = scrollProgress * (Math.PI / 2);

  renderer.render(scene, camera);
}

animate();

