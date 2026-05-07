import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text, Stats } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { degToRad } from "three/src/math/MathUtils";

import Player from "./Player";
import Enemy from "./Enemy";
import { useStore } from "@/hooks/useStore";
import Background from "./Background";
import { MovingPlatform, Platform } from "./Platforms";

function GameCanvas(props) {

    const debug = useStore(state => state.debug);
    const showStats = useStore((state) => state?.debugConfig?.showStats);

    return (
        <Canvas camera={{ position: [0, 10, 30], fov: 50 }}>

            {showStats && <>
                <Stats className="stats-overlay" />
            </>}

            <OrbitControls />

            <Sky
                sunPosition={[0, 10, 0]}
            />

            <ambientLight intensity={5} />
            <spotLight intensity={30000} position={[-50, 100, 50]} angle={5} penumbra={1} />

            <Background />

            <Physics
                gravity={[0, -30, 0]}
                debug={debug ? true : false}
            >

                <Player />

                <MovingPlatform
                    position={[-30, 0, 0]}
                    args={[25, 1, 2.5]}
                />

                <group>
                    <Platform
                        position={[0, -10, 0]}
                        args={[25, 1, 2.5]}
                    />

                    <Platform
                        position={[0, -2, 0]}
                        args={[25, 1, 2.5]}
                    />

                    <Platform
                        position={[0, 10, 0]}
                        args={[25, 1, 2.5]}
                    />
                </group>

                <Platform
                    position={[30, 0, 0]}
                    args={[25, 1, 2.5]}
                />

                <Enemy
                    position={[30, 2.75, 0]}
                />

                <Platform
                    position={[55, 3, 0]}
                    args={[25, 1, 2.5]}
                />

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)