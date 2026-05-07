import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three";

import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
// import { MovingPlatform, Platform } from "./Platforms";

function Platform({ args, position }) {
    const texture = useLoader(TextureLoader, "/img/blockside-spin.png");
    texture.wrapS = texture.wrapT = 1000; // RepeatWrapping
    texture.repeat.set(args[0], args[1]); // Tile based on platform dimensions
    texture.rotation = 0; // Reset rotation if needed, or adjust as desired

    return (
        <RigidBody type="fixed" position={position} friction={0.05} restitution={0}>
            <mesh
            // castShadow
            >
                <boxGeometry args={args} />
                <meshStandardMaterial attach="material-0" color="black" />
                <meshStandardMaterial attach="material-1" color="black" />
                <meshStandardMaterial attach="material-2" color="black" />
                <meshStandardMaterial attach="material-3" color="black" />
                <meshStandardMaterial attach="material-4" map={texture} />
                <meshStandardMaterial attach="material-5" map={texture} />
            </mesh>
        </RigidBody>
    )

}

function MovingPlatform({ args, position }) {
    const texture = useLoader(TextureLoader, "/img/blockside.png");
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
                <meshStandardMaterial attach="material-0" color="black" />
                <meshStandardMaterial attach="material-1" color="black" />
                <meshStandardMaterial attach="material-2" color="black" />
                <meshStandardMaterial attach="material-3" color="black" />
                <meshStandardMaterial attach="material-4" map={texture} />
                <meshStandardMaterial attach="material-5" map={texture} />
            </mesh>
        </RigidBody>
    );
}

export { Platform, MovingPlatform };