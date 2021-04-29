import * as THREE from 'THREE';

function main(){
    const scene = new THREE.Scene();

    const fov = 75;
    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;
    const near = 0.1;
    const far = 1000;

    const camera = new THREE.PerspectiveCamera(fov, windowInnerWidth / windowInnerHeight, near, far);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    // renderer

    renderer.setSize(windowInnerWidth, windowInnerHeight);
    document.body.appendChild(renderer.domElement);


    const geometry = new THREE.BoxGeometry(.5, .5, .5);
    const material = new THREE.MeshBasicMaterial({color : 0x00FF00});
    const cube = new THREE.Mesh(geometry, material);
    // cube.position.x = 5;

    scene.add(cube);

    // wireframe
    let geo = new THREE.EdgesGeometry( cube.geometry );
    let mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 4 } );
    let wireframe = new THREE.LineSegments( geo, mat );
    wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
    cube.add( wireframe );

    camera.position.z = 5;




    const spotLight = new THREE.SpotLight(0x000000);
    spotLight.position.z = 5;

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = windowInnerWidth;
    spotLight.shadow.mapSize.height = windowInnerHeight;
    //
    spotLight.shadow.camera.near = near;
    spotLight.shadow.camera.far = far;
    spotLight.shadow.camera.fov = fov;
    scene.add(spotLight);


    function animate(){
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
}

main();