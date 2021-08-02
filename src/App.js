import React, {useRef, useState} from 'react';
import {Canvas, useFrame, extend} from '@react-three/fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });



function Box(props) {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color={'hotpink'}/>
        </mesh>
    )
}

const App = () => {
    return (
        <Canvas>
            <orbitControls/>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <Box position={[-1.2, 0, 0]}/>
            <Box position={[1.2, 0, 0]}/>
        </Canvas>
    )
};

export default App;
