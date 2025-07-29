import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Debug, Physics, useBox, useSphere } from "@react-three/cannon";
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

            <Physics gravity={[0, -8, 0]}>

                <Debug>

                    <Player />

                    <Star
                        position={[-25, 4, 0]}
                        scale={2}
                    />

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

                    <Star
                        position={[15, 4, 0]}
                        scale={2}
                    />

                    <Star
                        position={[25, 4, 0]}
                        scale={2}
                    />

                    <ModelKingMen
                        scale={3}
                        rotation={[0, degToRad(90), 0]}
                        position={[0, 0.5, 0]}
                    />

                    <Enemy
                        position={[30, 2.75, 0]}
                    />

                    <Platform
                        position={[55, 3, 0]}
                        args={[25, 1, 2.5]}
                    />

                    {/* <Walls /> */}

                </Debug>

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)

function Platform({ args, position }) {

    const [ref, api] = useBox(() => ({
        mass: 0,
        type: 'Static',
        args: args,
        position: position,
    }))

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="black" />
        </mesh>
    )

}

function MovingPlatform({ args, position }) {
    const [ref, api] = useBox(() => ({
        mass: 0,
        type: 'Dynamic',
        args: args,
        position: position,
    }));

    const [direction, setDirection] = useState(1); // 1 for moving up, -1 for moving down
    const speed = 0.05; // Speed of movement
    const currentPosition = useRef(position); // Keep track of the current position

    // Subscribe to position changes (only once)
    useEffect(() => {
        const unsubscribe = api.position.subscribe((pos) => {
            currentPosition.current = pos;
        });

        return () => {
            unsubscribe(); // Clean up the subscription when the component unmounts
        };
    }, [api.position]);

    // Update position every frame
    useFrame(() => {
        const [x, y, z] = currentPosition.current;

        // Reverse direction at limits
        if (y >= 10) {
            setDirection(-1);
        } else if (y <= -10) {
            setDirection(1);
        }

        // Update the position
        api.position.set(x, y + speed * direction, z);
    });

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="black" />
        </mesh>
    );
}