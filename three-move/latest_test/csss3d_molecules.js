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

