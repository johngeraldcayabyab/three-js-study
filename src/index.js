
import {POINTER_CLICK, POINTER_ENTER, POINTER_EXIT, Pointer} from '../boilerplate/pointer.js'
import VRStats from "../boilerplate/vrstats.js"

//JQuery-like selector
const $ = (sel) => document.querySelector(sel)
const on = (elem, type, cb) => elem.addEventListener(type,cb)
const toRad = (deg) => deg * Math.PI/180

// global constants and variables for your app go here
let camera, scene, renderer, pointer, stats;

let obj


//give it a seed so we get the same values every time
//show 4 vs 5
let simplex = new SimplexNoise(4);
function map(val, smin, smax, emin, emax) {
    const t =  (val-smin)/(smax-smin)
    return (emax-emin)*t + emin
}
function noise(nx, ny) {
    // Re-map from -1.0:+1.0 to 0.0:1.0
    return map(simplex.noise2D(nx,ny),-1,1,0,1)
}
//stack some noisefields together
function octave(nx,ny,octaves) {
    let val = 0;
    let freq = 1;
    let max = 0;
    let amp = 1;
    for(let i=0; i<octaves; i++) {
        val += noise(nx*freq,ny*freq)*amp;
        max += amp;
        amp /= 2;
        freq  *= 2;
    }
    return val/max;
}

//generate grayscale image of noise
function generateTexture() {
    const canvas = document.getElementById('debug-canvas')
    const c = canvas.getContext('2d')
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width, canvas.height)

    for(let i=0; i<canvas.width; i++) {
        for(let j=0; j<canvas.height; j++) {
            let v =  octave(i/canvas.width,j/canvas.height,16)
            const per = (100*v).toFixed(2)+'%'
            c.fillStyle = `rgb(${per},${per},${per})`
            c.fillRect(i,j,1,1)
        }
    }
    return c.getImageData(0,0,canvas.width,canvas.height)
}

function generateMeshFromTexture(data) {
    //make plane geometry
    const geo = new THREE.PlaneGeometry(data.width,data.height,data.width,data.height+1)


    //assign vert data from the canvas
    for(let j=0; j<data.height; j++) {
        for (let i = 0; i < data.width; i++) {
            const n =  (j*(data.height)  +i)
            const nn = (j*(data.height+1)+i)
            const col = data.data[n*4] // the red channel
            const v1 = geo.vertices[nn]
            v1.z = map(col,0,255,-10,10) //map from 0:255 to -10:10
            if(v1.z > 2.5) v1.z *= 1.3 //exaggerate the peaks
            v1.x += map(Math.random(),0,1,-0.5,0.5) //jitter x
            v1.y += map(Math.random(),0,1,-0.5,0.5) //jitter y
        }
    }
    //for every face
    geo.faces.forEach(f=>{
        //get three verts for the face
        const a = geo.vertices[f.a]
        const b = geo.vertices[f.b]
        const c = geo.vertices[f.c]

        //if average is below water, set to 0
        //alt: color transparent to show the underwater landscape
        const avgz = (a.z+b.z+c.z)/3
        if(avgz < 0) {
            a.z = 0
            b.z = 0
            c.z = 0
        }


        //assign colors based on the highest point of the face
        const max = Math.max(a.z,Math.max(b.z,c.z))
        if(max <=0)   return f.color.set(0x44ccff)
        if(max <=1.5) return f.color.set(0x228800)
        if(max <=3.5)   return f.color.set(0xeecc44)
        if(max <=5)   return f.color.set(0xcccccc)

        //otherwise, return white
        f.color.set('white')
    })
    geo.colorsNeedUpdate = true
    geo.verticesNeedUpdate = true
    //required for flat shading
    geo.computeFlatVertexNormals()
    const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({
        // wireframe:true,
        vertexColors: THREE.VertexColors,
        //required for flat shading
        flatShading:true,
    }))
    mesh.position.y = -0
    mesh.position.z = -20
    //tilt slightly so we can see it better
    mesh.rotation.x = toRad(-30)
    return mesh
}

//called on setup. Customize this
function initContent(scene,camera,renderer) {
    //set the background color of the scene
    scene.background = new THREE.Color( 0xcccccc );

    const light = new THREE.DirectionalLight( 0xffffff, 0.7 );
    light.position.set( 1, 1, 0 ).normalize();
    scene.add( light );
    scene.add(new THREE.AmbientLight(0xffffff,0.3))


    $("#overlay").style.display = 'none'
    if($('#enter-vr'))  $('#enter-vr').removeAttribute('disabled')



    const tex = generateTexture()
    const mesh = generateMeshFromTexture(tex)
    scene.add(mesh)
    obj = mesh

}

//called on every frame. customize this
function render(time) {
    //update the pointer and stats, if configured
    if(pointer) pointer.tick(time)
    if(stats) stats.update(time)
    //rotate the cube on every tick
    if(obj) obj.rotation.z -= 0.001
    renderer.render( scene, camera );
}


// you shouldn't need to modify much below here

function initScene() {
    //create DIV for the canvas
    const container = document.createElement( 'div' );
    document.body.appendChild( container );
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 250 );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaOutput = true
    renderer.vr.enabled = true;
    container.appendChild( renderer.domElement );
    document.body.appendChild( WEBVR.createButton( renderer ) );

    initContent(scene,camera,renderer)

    window.addEventListener( 'resize', ()=>{
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );

    THREE.DefaultLoadingManager.onStart = (url, loaded, total) => {
        console.log(`loading ${url}.  loaded ${loaded} of ${total}`)
    }
    THREE.DefaultLoadingManager.onLoad = () => {
        console.log(`loading complete`)
        console.log("really setting it up now")
        $('#loading-indicator').style.display = 'none'
        $('#click-to-play').style.display = 'block'
        const overlay = $('#overlay')
        $("#click-to-play").addEventListener('click',()=>{
            overlay.style.visibility = 'hidden'
            if($('#enter-vr'))  $('#enter-vr').removeAttribute('disabled')
        })
    }
    THREE.DefaultLoadingManager.onProgress = (url, loaded, total) => {
        console.log(`prog ${url}.  loaded ${loaded} of ${total}`)
        $("#progress").setAttribute('value',100*(loaded/total))
    }
    THREE.DefaultLoadingManager.onError = (url) => {
        console.log(`error loading ${url}`)
    }


}



// initPage()
initScene()
renderer.setAnimationLoop(render)
