import { Model as ModelSpaceMen } from "@/components/Models/Spacesuit";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { degToRad } from "three/src/math/MathUtils";

function Enemy({ args, position }) {
    const rigidBodyRef = useRef();
    const directionRef = useRef(1);
    const speed = 3;
    const originalX = useRef(position[0]);

    useFrame((_, delta) => {
        if (!rigidBodyRef.current) return;

        const pos = rigidBodyRef.current.translation();

        const minX = originalX.current - 10;
        const maxX = originalX.current + 10;

        if (pos.x >= maxX) directionRef.current = -1;
        else if (pos.x <= minX) directionRef.current = 1;

        const nextX = pos.x + speed * directionRef.current * delta;
        rigidBodyRef.current.setNextKinematicTranslation({
            x: nextX,
            y: pos.y,
            z: pos.z,
        });
    });

    return (
        <RigidBody
            ref={rigidBodyRef}
            type="kinematicPosition"
            position={position}
            userData={{ isEnemy: true }}
        >
            <CuboidCollider args={[0.5, 2, 0.5]} />
            <ModelSpaceMen
                scale={3}
                rotation={[0, Math.PI / 2, 0]}
                position={[0, -2, 0]}
                action="Walk"
            />
        </RigidBody>
    );
}

export default Enemy