import { Model as ModelSpaceMen } from "@/components/Models/Spacesuit";
import { RigidBody, CuboidCollider, CapsuleCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { degToRad } from "three/src/math/MathUtils";

function Enemy({ args, position }) {
    const rigidBodyRef = useRef();
    const modelRef = useRef();
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

        if (modelRef.current) {
            modelRef.current.position.set(pos.x, pos.y, pos.z);
            modelRef.current.rotation.y = directionRef.current === 1 ? Math.PI / 2 : -Math.PI / 2;
        }
    });

    return (
        <group>
            <RigidBody
                ref={rigidBodyRef}
                type="kinematicPosition"
                position={position}
                userData={{ isEnemy: true }}
            >
                <CapsuleCollider args={[1.75, 0.8]} />

            </RigidBody>
            <group
                ref={modelRef}
            >
                <ModelSpaceMen
                    scale={2.5}
                    position={[0, -2, 0]}
                    action="Walk"
                />
            </group>
        </group>
    );
}

export default Enemy