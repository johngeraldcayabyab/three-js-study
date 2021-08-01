import * as THREE from 'three';
  import {
    createContainer,
    createControls,
    createPerspectiveCamera,
    createRenderer,
    createScene,
    createStats
  } from "../src/helpers.js";

main();

function main() {
  let container, renderer, scene, camera, controls, stats;

  let labelRenderer;
  let root;

  const MOLECULES = {
        "Ethanol": "ethanol.pdb",
        "Aspirin": "aspirin.pdb",
        "Caffeine": "caffeine.pdb",
        "Nicotine": "nicotine.pdb",
        "LSD": "lsd.pdb",
        "Cocaine": "cocaine.pdb",
        "Cholesterol": "cholesterol.pdb",
        "Lycopene": "lycopene.pdb",
        "Glucose": "glucose.pdb",
        "Aluminium oxide": "Al2O3.pdb",
        "Cubane": "cubane.pdb",
        "Copper": "cu.pdb",
        "Fluorite": "caf2.pdb",
        "Salt": "nacl.pdb",
        "YBCO superconductor": "ybco.pdb",
        "Buckyball": "buckyball.pdb",
        "Graphite": "graphite.pdb"
  };

  const loader = new PDBLoader();
  const offset = new THREE.Vector3();

  const menu = document.getElementById('menu');


  init();
  animate();



  function init(){
      container = createContainer(container);
      renderer = createRenderer(renderer, container);
      scene = createScene(scene);
      camera = createPerspectiveCamera(camera, {x: 10, y: 7, z: 10});
      controls = createControls(controls, camera, renderer);
      stats = createStats(stats, container);


      container.addEventListener('resize', onWindowResize);
  }

  function animate(){
      render();
      stats.update();
      requestAnimationFrame(animate);
  }

   function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

