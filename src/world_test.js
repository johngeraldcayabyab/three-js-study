import * as THREE from 'three';
import {createRenderer} from "../utils/scaffold.js";
import {createStats} from "../utils/scaffold.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GUI} from "three/examples/jsm/libs/dat.gui.module.js";
import {GPUComputationRenderer} from "three/examples/jsm/misc/GPUComputationRenderer.js";
import {ImprovedNoise} from "three/examples/jsm/math/ImprovedNoise.js";
import {Sky} from "three/examples/jsm/objects/Sky.js";
import {Water} from "three/examples/jsm/objects/Water.js";

main();

function main() {


    const WIDTH = 32;
    const BIRDS = WIDTH * WIDTH;

    class BirdGeometry extends THREE.BufferGeometry {
        constructor() {
            super();

            const trianglesPerBird = 3;
            const triangles = BIRDS * trianglesPerBird;
            const points = triangles * 3;

            const vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
            const birdColors = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
            const references = new THREE.BufferAttribute(new Float32Array(points * 2), 2);
            const birdVertex = new THREE.BufferAttribute(new Float32Array(points), 1);

            this.setAttribute('position', vertices);
            this.setAttribute('birdColor', birdColors);
            this.setAttribute('reference', references);
            this.setAttribute('birdVertex', birdVertex);

            let v = 0;

            function verts_push() {
                for (let i = 0; i < arguments.length; i++) {
                    vertices.array[v++] = arguments[i];
                }
            }

            const wingsSpan = 20;
            for (let f = 0; f < BIRDS; f++) {
                verts_push(
                    0, -0, -20,
                    0, 4, -20,
                    0, 0, 30
                );
                verts_push(
                    0, 0, -15,
                    wingsSpan, 0, 0,
                    0, 0, -15,
                );
                verts_push(
                    0, 0, 15,
                    wingsSpan, 0, 0,
                    0, 0, -15
                );
            }

            for (let v = 0; v < triangles * 3; v++) {
                const triangleIndex = ~~(v / 3);
                const birdIndex = ~~(triangleIndex / trianglesPerBird);
                const x = (birdIndex % WIDTH) / WIDTH;
                const y = ~~(birdIndex / WIDTH) / WIDTH;

                const c = new THREE.Color(
                    0x444444 +
                    ~~(v / 9) / BIRDS * 0x666666
                );

                birdColors.array[v * 3 + 0] = c.r;
                birdColors.array[v * 3 + 1] = c.g;
                birdColors.array[v * 3 + 2] = c.b;

                references.array[v * 2] = x;
                references.array[v * 2 + 1] = y;

                birdVertex.array[v] = v % 9;
            }

            this.scale(0.2, 0.2, 0.2);
        }
    }


    let renderer, camera, scene, controls, stats;

    let terrainMesh, terrainTexture, waterMesh, sunMesh;

    const worldWidth = 256, worldDepth = 256, worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

    const mapWidthHeight = 7500;

    let helper;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();


    // BIRD
    let mouseX = 0, mouseY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2;

    let last = performance.now();

    let gpuCompute;
    let velocityVariable;
    let positionVariable;
    let positionUniforms;
    let velocityUniforms;
    let birdUniforms;

    init();
    animate();

    function init() {
        
        renderer = createRenderer(renderer);
        stats = createStats(stats);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xbfd1e5);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 20000);
        controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 1000;
        controls.maxDistance = 10000;
        controls.maxPolarAngle = Math.PI / 2;
        camera.position.y = 4000;
        camera.position.x = 2000;
        camera.position.z = 2000;

        controls.update();

        initComputeRenderer();

        terrainMesh = createTerrain();
        scene.add(terrainMesh);

        helper = createGeometryHelper();
        scene.add(helper);

        waterMesh = createWater();
        scene.add(waterMesh);

        sunMesh = new THREE.Vector3();

        scene.add(waterMesh);

        const skyMesh = new Sky();
        skyMesh.scale.setScalar(mapWidthHeight);
        scene.add(skyMesh);

        const skyUniforms = skyMesh.material.uniforms;

        skyUniforms['turbidity'].value = 10;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.8;

        const parameters = {
            elevation: 2,
            azimuth: 180
        };

        const pmremGenerator = new THREE.PMREMGenerator(renderer);

        function updateSun() {
            const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
            const theta = THREE.MathUtils.degToRad(parameters.azimuth);
            sunMesh.setFromSphericalCoords(1, phi, theta);
            skyMesh.material.uniforms['sunPosition'].value.copy(sunMesh);
            waterMesh.material.uniforms['sunDirection'].value.copy(sunMesh).normalize();
            scene.environment = pmremGenerator.fromScene(skyMesh).texture;
        }

        updateSun();


        const gui = new GUI();

        const folderSky = gui.addFolder('Sky');
        folderSky.add(parameters, 'elevation', 0, 90, 0.1).onChange(updateSun);
        folderSky.add(parameters, 'azimuth', -180, 180, 0.1).onChange(updateSun);
        folderSky.open();

        const waterUniforms = waterMesh.material.uniforms;

        const folderWater = gui.addFolder('Water');
        folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
        folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
        folderWater.open();


        const effectController = {
            separation: 20.0,
            alignment: 20.0,
            cohesion: 20.0,
            freedom: 0.75
        };

        const valuesChanger = function () {
            velocityUniforms['separationDistance'].value = effectController.separation;
            velocityUniforms['alignmentDistance'].value = effectController.alignment;
            velocityUniforms['cohesionDistance'].value = effectController.cohesion;
            velocityUniforms['freedomFactor'].value = effectController.freedom;
        };

        valuesChanger();

        const birdsFolder = gui.addFolder('Birds');

        birdsFolder.add(effectController, 'separation', 0.0, 100.0, 1.0).onChange(valuesChanger);
        birdsFolder.add(effectController, 'alignment', 0.0, 100, 0.001).onChange(valuesChanger);
        birdsFolder.add(effectController, 'cohesion', 0.0, 100.0, 0.025).onChange(valuesChanger);
        birdsFolder.open();


        initBirds();

        renderer.domElement.addEventListener('pointermove', onPointerMove);
        window.addEventListener('resize', onWindowResize);
    }

    function createTerrain() {
        const data = generateTerrainHeight(worldWidth, worldDepth);
        const terrainGeometry = new THREE.PlaneGeometry(mapWidthHeight, mapWidthHeight, worldWidth - 1, worldDepth - 1);
        terrainGeometry.rotateX(-Math.PI / 2);

        const vertices = terrainGeometry.attributes.position.array;

        for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = data[i] * 10;
        }

        terrainGeometry.computeFaceNormals(); // needed for helper

        terrainTexture = new THREE.CanvasTexture(generateTerrainTexture(data, worldWidth, worldDepth));
        terrainTexture.wrapS = THREE.ClampToEdgeWrapping;
        terrainTexture.wrapT = THREE.ClampToEdgeWrapping;

        return new THREE.Mesh(terrainGeometry, new THREE.MeshBasicMaterial({map: terrainTexture}));
    }

    function createGeometryHelper() {
        const geometryHelper = new THREE.ConeGeometry(20, 100, 3);
        geometryHelper.translate(0, 50, 0);
        geometryHelper.rotateX(Math.PI / 2);
        return new THREE.Mesh(geometryHelper, new THREE.MeshNormalMaterial());
    }

    function createWater() {
        const waterGeometry = new THREE.PlaneGeometry(mapWidthHeight, mapWidthHeight);

        let water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('../src/textures/waternormals.jpg', function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
        );

        water.rotation.x = -Math.PI / 2;
        water.position.y = 250;

        return water;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function generateTerrainHeight(width, height) {
        const size = width * height, data = new Uint8Array(size), perlin = new ImprovedNoise(),
            z = Math.random() * 100;
        let quality = 1;

        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < size; i++) {
                const x = i % width, y = ~~(i / width);
                data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
            }
            quality *= 5;
        }

        return data;
    }

    function generateTerrainTexture(data, width, height) {
        let context, image, imageData, shade;

        const vector3 = new THREE.Vector3(0, 0, 0);

        const sun = new THREE.Vector3(1, 1, 1);
        sun.normalize();

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext('2d');
        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);

        image = context.getImageData(0, 0, canvas.width, canvas.height);
        imageData = image.data;

        for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
            vector3.x = data[j - 2] - data[j + 2];
            vector3.y = 2;
            vector3.z = data[j - width * 2] - data[j + width * 2];
            vector3.normalize();
            shade = vector3.dot(sun);
            imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
            imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
            imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);
        }

        context.putImageData(image, 0, 0);

        const canvasScaled = document.createElement('canvas');
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;

        context = canvasScaled.getContext('2d');
        context.scale(4, 4);
        context.drawImage(canvas, 0, 0);

        image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
        imageData = image.data;

        for (let i = 0, l = imageData.length; i < l; i += 4) {
            const v = ~~(Math.random() * 5);

            imageData[i] += v;
            imageData[i + 1] += v;
            imageData[i + 2] += v;

        }
        context.putImageData(image, 0, 0);
        return canvasScaled;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function render() {


        // Bird
        const now = performance.now();
        let delta = (now - last) / 1000;

        if (delta > 1) delta = 1;
        last = now;

        positionUniforms['time'].value = now;
        positionUniforms['delta'].value = delta;
        velocityUniforms['time'].value = now;
        velocityUniforms['delta'].value = delta;
        birdUniforms['time'].value = now
        birdUniforms['delta'].valuje = delta;

        velocityUniforms['predator'].value.set(0.5 * mouseX / windowHalfX, -0.5 * mouseY / windowHalfY, 0);

        mouseX = 10000;
        mouseY = 10000;

        gpuCompute.compute();

        birdUniforms['texturePosition'].value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
        birdUniforms['textureVelocity'].value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture;

        // Water
        waterMesh.material.uniforms['time'].value += 1.0 / 60.0;
        renderer.render(scene, camera);
    }

    function onPointerMove(event) {
        pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObject(terrainMesh);

        if (intersects.length > 0) {
            helper.position.set(0, 0, 0);
            helper.lookAt(intersects[0].face.normal);
            helper.position.copy(intersects[0].point);
        }

        if (event.isPrimary !== false) {
            mouseX = event.clientX - windowHalfX;
            mouseY = event.clientY - windowHalfY;
        }
    }

    function initBirds() {
        const geometry = new BirdGeometry();

        birdUniforms = {
            'color': {value: new THREE.Color(0xff2200)},
            'texturePosition': {value: null},
            'textureVelocity': {value: null},
            'time': {value: 1.0},
            'delta': {value: 0.0}
        };

        const material = new THREE.ShaderMaterial({
            uniforms: birdUniforms,
            vertexShader: birdVS(),
            fragmentShader: birdFS(),
            side: THREE.DoubleSide
        });

        const birdMesh = new THREE.Mesh(geometry, material);
        birdMesh.rotation.y = Math.PI / 2;
        birdMesh.matrixAutoUpdate = false;
        birdMesh.updateMatrix();

        birdMesh.geometry.scale(5, 5, 5);

        scene.add(birdMesh);
    }


    function initComputeRenderer() {
        gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);
        if (isSafari()) {
            gpuCompute.setDataType(THREE.HalfFloatType);
        }

        const dtPosition = gpuCompute.createTexture();
        const dtVelocity = gpuCompute.createTexture();
        fillPositionTexture(dtPosition);
        fillPositionTexture(dtVelocity);

        velocityVariable = gpuCompute.addVariable('textureVelocity', birdFragmentShaderVelocity(), dtVelocity);
        positionVariable = gpuCompute.addVariable('texturePosition', birdFragmentShaderPosition(), dtPosition);

        gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);
        gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);

        positionUniforms = positionVariable.material.uniforms;
        velocityUniforms = velocityVariable.material.uniforms;

        positionUniforms['time'] = {value: 0.0};
        positionUniforms['delta'] = {value: 0.0};
        velocityUniforms['time'] = {value: 1.0};
        velocityUniforms['delta'] = {value: 0.0};
        velocityUniforms['testing'] = {value: 1.0};
        velocityUniforms['separationDistance'] = {value: 1.0};
        velocityUniforms['alignmentDistance'] = {value: 1.0};
        velocityUniforms['cohesionDistance'] = {value: 1.0};
        velocityUniforms['freedomFactor'] = {value: 1.0};
        velocityUniforms['predator'] = {value: new THREE.Vector3()};
        velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed(2);

        velocityVariable.wrapS = THREE.RepeatWrapping;
        velocityVariable.wrapT = THREE.RepeatWrapping;
        positionVariable.wrapS = THREE.RepeatWrapping;
        positionVariable.wrapT = THREE.RepeatWrapping;

        const error = gpuCompute.init();

        if (error !== null) {
            console.log(error);
        }
    }

    function fillPositionTexture(texture) {
        const theArray = texture.image.data;

        for (let k = 0, kl = theArray.length; k < kl; k += 4) {
            const x = Math.random() * BOUNDS - BOUNDS_HALF;
            const y = Math.random() * BOUNDS - BOUNDS_HALF;
            const z = Math.random() * BOUNDS - BOUNDS_HALF;

            theArray[k + 0] = x;
            theArray[k + 1] = y;
            theArray[k + 2] = z;
            theArray[k + 3] = 1;
        }
    }

    function isSafari() {
        return !!navigator.userAgent.match(/Safari/i) && !navigator.userAgent.match(/Chrome/i);
    }


    function birdFragmentShaderPosition() {
        return `
            uniform float time;
        uniform float delta;

        void main(){

            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec4 tmpPos = texture2D( texturePosition, uv );
            vec3 position = tmpPos.xyz;
            vec3 velocity = texture2D( textureVelocity, uv ).xyz;

            float phase = tmpPos.w;

            phase = mod( ( phase + delta +
                length( velocity.xz ) * delta * 3. +
                max( velocity.y, 0.0 ) * delta * 6. ), 62.83 );

            gl_FragColor = vec4( position + velocity * delta * 15. , phase );

        }
            `;
    }

    function birdFragmentShaderVelocity() {
        return `
            uniform float time;
        uniform float testing;
        uniform float delta; // about 0.016
        uniform float separationDistance; // 20
        uniform float alignmentDistance; // 40
        uniform float cohesionDistance; //
        uniform float freedomFactor;
        uniform vec3 predator;

        const float width = resolution.x;
        const float height = resolution.y;

        const float PI = 3.141592653589793;
        const float PI_2 = PI * 2.0;
        // const float VISION = PI * 0.55;

        float zoneRadius = 40.0;
        float zoneRadiusSquared = 1600.0;

        float separationThresh = 0.45;
        float alignmentThresh = 0.65;

        const float UPPER_BOUNDS = BOUNDS;
        const float LOWER_BOUNDS = -UPPER_BOUNDS;

        const float SPEED_LIMIT = 9.0;

        float rand( vec2 co ){
            return fract( sin( dot( co.xy, vec2(12.9898,78.233) ) ) * 43758.5453 );
        }

        void main() {

            zoneRadius = separationDistance + alignmentDistance + cohesionDistance;
            separationThresh = separationDistance / zoneRadius;
            alignmentThresh = ( separationDistance + alignmentDistance ) / zoneRadius;
            zoneRadiusSquared = zoneRadius * zoneRadius;


            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec3 birdPosition, birdVelocity;

            vec3 selfPosition = texture2D( texturePosition, uv ).xyz;
            vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;

            float dist;
            vec3 dir; // direction
            float distSquared;

            float separationSquared = separationDistance * separationDistance;
            float cohesionSquared = cohesionDistance * cohesionDistance;

            float f;
            float percent;

            vec3 velocity = selfVelocity;

            float limit = SPEED_LIMIT;

            dir = predator * UPPER_BOUNDS - selfPosition;
            dir.z = 0.;
            // dir.z *= 0.6;
            dist = length( dir );
            distSquared = dist * dist;

            float preyRadius = 150.0;
            float preyRadiusSq = preyRadius * preyRadius;


            // move birds away from predator
            if ( dist < preyRadius ) {

                f = ( distSquared / preyRadiusSq - 1.0 ) * delta * 100.;
                velocity += normalize( dir ) * f;
                limit += 5.0;
            }


            // if (testing == 0.0) {}
            // if ( rand( uv + time ) < freedomFactor ) {}


            // Attract flocks to the center
            vec3 central = vec3( 0., 1500., 0. );
            dir = selfPosition - central;
            dist = length( dir );

            dir.y *= 2.5;
            velocity -= normalize( dir ) * delta * 5.;

            for ( float y = 0.0; y < height; y++ ) {
                for ( float x = 0.0; x < width; x++ ) {

                    vec2 ref = vec2( x + 0.5, y + 0.5 ) / resolution.xy;
                    birdPosition = texture2D( texturePosition, ref ).xyz;

                    dir = birdPosition - selfPosition;
                    dist = length( dir );

                    if ( dist < 0.0001 ) continue;

                    distSquared = dist * dist;

                    if ( distSquared > zoneRadiusSquared ) continue;

                    percent = distSquared / zoneRadiusSquared;

                    if ( percent < separationThresh ) { // low

                        // Separation - Move apart for comfort
                        f = ( separationThresh / percent - 1.0 ) * delta;
                        velocity -= normalize( dir ) * f;

                    } else if ( percent < alignmentThresh ) { // high

                        // Alignment - fly the same direction
                        float threshDelta = alignmentThresh - separationThresh;
                        float adjustedPercent = ( percent - separationThresh ) / threshDelta;

                        birdVelocity = texture2D( textureVelocity, ref ).xyz;

                        f = ( 0.5 - cos( adjustedPercent * PI_2 ) * 0.5 + 0.5 ) * delta;
                        velocity += normalize( birdVelocity ) * f;

                    } else {

                        // Attraction / Cohesion - move closer
                        float threshDelta = 1.0 - alignmentThresh;
                        float adjustedPercent;
                        if( threshDelta == 0. ) adjustedPercent = 1.;
                        else adjustedPercent = ( percent - alignmentThresh ) / threshDelta;

                        f = ( 0.5 - ( cos( adjustedPercent * PI_2 ) * -0.5 + 0.5 ) ) * delta;

                        velocity += normalize( dir ) * f;

                    }

                }

            }



            // this make tends to fly around than down or up
            // if (velocity.y > 0.) velocity.y *= (1. - 0.2 * delta);

            // Speed Limits
            if ( length( velocity ) > limit ) {
                velocity = normalize( velocity ) * limit;
            }

            gl_FragColor = vec4( velocity, 1.0 );

        }
            `;
    }

    function birdVS() {
        return `
                attribute vec2 reference;
        attribute float birdVertex;

        attribute vec3 birdColor;

        uniform sampler2D texturePosition;
        uniform sampler2D textureVelocity;

        varying vec4 vColor;
        varying float z;

        uniform float time;

        void main() {

            vec4 tmpPos = texture2D( texturePosition, reference );
            vec3 pos = tmpPos.xyz;
            vec3 velocity = normalize(texture2D( textureVelocity, reference ).xyz);

            vec3 newPosition = position;

            if ( birdVertex == 4.0 || birdVertex == 7.0 ) {
                // flap wings
                newPosition.y = sin( tmpPos.w ) * 5.;
            }

            newPosition = mat3( modelMatrix ) * newPosition;


            velocity.z *= -1.;
            float xz = length( velocity.xz );
            float xyz = 1.;
            float x = sqrt( 1. - velocity.y * velocity.y );

            float cosry = velocity.x / xz;
            float sinry = velocity.z / xz;

            float cosrz = x / xyz;
            float sinrz = velocity.y / xyz;

            mat3 maty =  mat3(
                cosry, 0, -sinry,
                0    , 1, 0     ,
                sinry, 0, cosry

            );

            mat3 matz =  mat3(
                cosrz , sinrz, 0,
                -sinrz, cosrz, 0,
                0     , 0    , 1
            );

            newPosition =  maty * matz * newPosition;
            newPosition += pos;

            z = newPosition.z;

            vColor = vec4( birdColor, 1.0 );
            gl_Position = projectionMatrix *  viewMatrix  * vec4( newPosition, 1.0 );
        }
            `;
    }

    function birdFS() {
        return `
                varying vec4 vColor;
        varying float z;

        uniform vec3 color;

        void main() {
            // Fake colors for now
            float z2 = 0.2 + ( 1000. - z ) / 1000. * vColor.x;
            gl_FragColor = vec4( z2, z2, z2, 1. );

        }
            `;
    }
}