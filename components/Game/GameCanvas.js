import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { degToRad } from "three/src/math/MathUtils";

import { Model as ModelKingMen } from "@/components/Models/King";
import Player from "./Player";
import { Star } from "./Star";
import Enemy from "./Enemy";

const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`)

const GrassPlane = () => {

    const width = 110; // Set the width of the plane
    const height = 170; // Set the height of the plane

    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(5, 5)

    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <planeGeometry attach="geometry" args={[width, height]} />
                <meshStandardMaterial attach="material" map={texture} />
            </mesh>
        </>
    );
};

function GameCanvas(props) {

    // const GPUTier = useDetectGPU()

    // const {
    //     playerRotation,
    //     setPlayerRotation
    // } = useCannonStore(state => ({
    //     playerRotation: state.playerRotation,
    //     setPlayerRotation: state.setPlayerRotation
    // }));

    const {
        handleCameraChange,
        gameState,
        players,
        move,
        cameraInfo,
        server
    } = props;

    const [[a, b, c, d, e]] = useState(() => [...Array(5)].map(createRef))

    return (
        <Canvas camera={{ position: [0, 10, 30], fov: 50 }}>

            <OrbitControls
            // autoRotate={gameState?.status == 'In Lobby'}
            />

            <Sky
                // distance={450000}
                sunPosition={[0, 10, 0]}
            // inclination={0}
            // azimuth={0.25}dadaa
            // {...props} 
            />

            <ambientLight intensity={5} />
            <spotLight intensity={30000} position={[-50, 100, 50]} angle={5} penumbra={1} />

            {/* <pointLight position={[-10, -10, -10]} /> */}

            {/* <FlatRing
                args={[3, 5, 32]}
                color={"gold"}
            />

            <FlatRing
                args={[6, 8, 32]}
                color={"white"}
            /> */}

            {/* <Rocks /> */}

            {/* <ModelGoogleIglooOpen
                position={[100, 30, 0]}
                scale={3}
                rotation={[0, degToRad(-55), 0]}
            />

            <ModelKennyNLMiniGolfFlagRed
                position={[100, 30, 10]}
                scale={10}
                rotation={[0, degToRad(-90), 0]}
            /> */}

            <Physics
                gravity={[0, -30, 0]}
                debug
            >

                <Player />

                {/* <Star
                        position={[-25, 4, 0]}
                        scale={2}
                    /> */}

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
                        position={[0, 0, 0]}
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

                {/* <Star
                        position={[15, 4, 0]}
                        scale={2}
                    />

                    <Star
                        position={[25, 4, 0]}
                        scale={2}
                    /> */}

                {/* <ModelKingMen
                    scale={3}
                    rotation={[0, degToRad(90), 0]}
                    position={[0, 0.5, 0]}
                /> */}

                {/* <Enemy
                        position={[30, 2.75, 0]}
                    /> */}

                <Platform
                    position={[55, 3, 0]}
                    args={[25, 1, 2.5]}
                />

                {/* <Walls /> */}

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)

function Platform({ args, position }) {

    return (
        <RigidBody type="fixed" position={position} friction={0.05} restitution={0}>
            <mesh
            // castShadow
            >
                <boxGeometry args={args} />
                <meshStandardMaterial color="black" />
            </mesh>
        </RigidBody>
    )

}

function MovingPlatform({ args, position }) {
    const rigidBodyRef = useRef(null);
    const directionRef = useRef(1);
    const speed = 2;

    useFrame((_, delta) => {
        if (!rigidBodyRef.current) return;

        const pos = rigidBodyRef.current.translation();

        if (pos.y >= 10) directionRef.current = -1;
        else if (pos.y <= -10) directionRef.current = 1;

        const nextY = pos.y + speed * directionRef.current * delta;
        rigidBodyRef.current.setNextKinematicTranslation({
            x: pos.x,
            y: nextY,
            z: pos.z,
        });
    });

    return (
        <RigidBody
            ref={rigidBodyRef}
            type="kinematicPosition"
            position={position}
            friction={0.05}
            restitution={0}
        >
            <mesh
            // castShadow
            >
                <boxGeometry args={args} />
                <meshStandardMaterial color="black" />
            </mesh>
        </RigidBody>
    );
}