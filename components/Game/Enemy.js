import { Model as ModelSpaceMen } from "@/components/Models/Spacesuit";
import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils";

function Enemy({ args, position }) {
    const [ref, api] = useBox(() => ({
        mass: 0,
        isTrigger: true,
        args: [1, 4, 1],
        position: position,
        userData: {
            isEnemy: true
        },
        onCollide: (e) => {
            console.log("Player collided with an enemy!", e);
        },
    }));

    const [direction, setDirection] = useState(1); // 1 for moving right, -1 for moving left
    const speed = 0.05; // Speed of movement
    const originalX = useRef(position[0]); // Store the original X position

    useFrame(() => {
        api.position.subscribe(([x, y, z]) => {
            // Calculate movement bounds relative to the original X position
            const minX = originalX.current - 10;
            const maxX = originalX.current + 10;

            // Reverse direction at the limits
            if (x >= maxX) {
                setDirection(-1); // Move left
            } else if (x <= minX) {
                setDirection(1); // Move right
            }

            // Update the position relative to the original X position
            api.position.set(x + speed * direction, y, z);
        });
    });

    return (
        <group ref={ref}>
            <ModelSpaceMen
                scale={3}
                rotation={[0, (direction > 0 ? Math.PI / 2 : Math.PI / -2), 0]} // DegToRad(-90) simplified
                position={[0, -2, 0]}
                action="Walk"
            />
        </group>
    );
}

export default Enemy