import './App.css';
import {BoxBufferGeometry, Group, Mesh, MeshStandardMaterial} from "three";

function App() {

    const group = new Group();
    const geo = new BoxBufferGeometry(2, 2, 2);
    const mat = new MeshStandardMaterial({color: 0x1fbeca});
    const mesh = new Mesh(geo, mat);
    group.add(mesh);
    scene.add(group);

    return (
        <div className="App">

            <Canvas>
                <PointLight></PointLight>
            </Canvas>

            {/*<group>*/}
            {/*    <mesh>*/}
            {/*        <boxBufferGeometry attach="geometry" args={[0.047, 0.5, 0.29]}/>*/}
            {/*        <meshStandardMaterial attach="material" color={0xf95b3c}/>*/}
            {/*    </mesh>*/}
            {/*</group>*/}

            {/*<header className="App-header">*/}
            {/*  /!*<img src={logo} className="App-logo" alt="logo" />*!/*/}
            {/*  /!*<p>*!/*/}
            {/*  /!*  Edit <code>src/App.js</code> and save to reload.*!/*/}
            {/*  /!*</p>*!/*/}
            {/*  /!*<a*!/*/}
            {/*  /!*  className="App-link"*!/*/}
            {/*  /!*  href="https://reactjs.org"*!/*/}
            {/*  /!*  target="_blank"*!/*/}
            {/*  /!*  rel="noopener noreferrer"*!/*/}
            {/*  /!*>*!/*/}
            {/*  /!*  Learn React*!/*/}
            {/*  /!*</a>*!/*/}
            {/*</header>*/}
        </div>
    );
}

export default App;
