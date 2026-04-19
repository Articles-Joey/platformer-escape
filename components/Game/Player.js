import { useFrame, useThree } from "@react-three/fiber"
import { RigidBody, CapsuleCollider, useRapier } from "@react-three/rapier"
import { memo, useRef, useState } from "react"
import { Vector3 } from "three"

import { useKeyboardStore } from "@/hooks/useKeyboard"
import { Model as ModelKingMen } from "@/components/Models/King";
import { useControlsStore, useGameStore } from "@/hooks/useGameStore";
import { degToRad } from "three/src/math/MathUtils";
import { Text } from "@react-three/drei";

const JUMP_FORCE = 20;
const SPEED = 12;
const STICK_VELOCITY = -5; // downward velocity applied when grounded to stick to moving platforms

let lastLocation

// Pre-allocate reusable vectors (avoids GC pressure every frame)
const _cameraPos = new Vector3()
const _cameraTarget = new Vector3()
const _direction = new Vector3()
const _frontVector = new Vector3()
const _sideVector = new Vector3()
const _playerLoc = new Vector3()

function myToFixed(i, digits) {
    var pow = Math.pow(10, digits);
    return Math.floor(i * pow) / pow;
}

function Player(props) {

    const rigidBodyRef = useRef()
    const playerModelRef = useRef()
    const lastMoveRef = useRef("Right")
    const actionRef = useRef("Idle")

    // These only update when the value actually changes (infrequent),
    // triggering a re-render to update the model's animation/rotation.
    const [lastMove, setLastMove] = useState("Right");
    const [action, setAction] = useState("Idle")

    const { camera } = useThree()
    const { rapier, world } = useRapier()

    const isGrounded = () => {
        const rb = rigidBodyRef.current
        if (!rb) return false
        const origin = rb.translation()
        const ray = new rapier.Ray(
            { x: origin.x, y: origin.y, z: origin.z },
            { x: 0, y: -1, z: 0 }
        )
        const hit = world.castRay(ray, 3.5, true)
        return hit !== null && hit.timeOfImpact < 3.5
    }

    const handleCollision = (e) => {
        const otherData = e.other?.rigidBodyObject?.userData

        if (otherData?.isEnemy) {
            const rb = rigidBodyRef.current
            if (!rb) return
            rb.setLinvel({ x: 0, y: 0, z: 0 }, true)
            rb.setTranslation({ x: 0, y: 10, z: 0 }, true)
        }

        if (otherData?.isStar) {
            const currentScore = useGameStore.getState().score;
            useGameStore.getState().setScore(currentScore + 1)
        }
    }

    useFrame(() => {
        const rb = rigidBodyRef.current
        if (!rb) return

        // Read all state imperatively — no React subscriptions, no re-renders
        const kb = useKeyboardStore.getState()
        const tc = useControlsStore.getState().touchControls
        const gs = useGameStore.getState()

        const pos = rb.translation()
        const vel = rb.linvel()

        // Fall reset
        if (pos.y < -15) {
            rb.setLinvel({ x: 0, y: 0, z: 0 }, true)
            rb.setTranslation({ x: 0, y: 10, z: 0 }, true)
            camera.lookAt(0, 0, -50);
            return
        }

        // Update model position to match physics body
        if (playerModelRef.current) {
            playerModelRef.current.position.set(pos.x, pos.y, pos.z);
        }

        // Update direction/action — only setState when value actually changes
        const movingRight = kb.moveRight || tc.right
        const movingLeft = kb.moveLeft || tc.left

        if (movingRight) {
            if (lastMoveRef.current !== "Right") { lastMoveRef.current = "Right"; setLastMove("Right") }
            if (actionRef.current !== "Walk") { actionRef.current = "Walk"; setAction("Walk") }
        } else if (movingLeft) {
            if (lastMoveRef.current !== "Left") { lastMoveRef.current = "Left"; setLastMove("Left") }
            if (actionRef.current !== "Walk") { actionRef.current = "Walk"; setAction("Walk") }
        } else {
            if (actionRef.current !== "Idle") { actionRef.current = "Idle"; setAction("Idle") }
        }

        // Camera follow (reuse pre-allocated vectors)
        if (gs.cameraMode === "Player") {
            _cameraPos.set(pos.x, pos.y + 8, 50)
            camera.position.copy(_cameraPos)
            _cameraTarget.set(pos.x, pos.y, 0)
            camera.lookAt(_cameraTarget)
        }

        // Track location — only update store when position actually changes
        let posX = myToFixed(pos.x || 0, 2)
        let posY = myToFixed(pos.y || 0, 2)
        let posZ = myToFixed(pos.z || 0, 2)

        if (!lastLocation || lastLocation.x !== posX || lastLocation.y !== posY || lastLocation.z !== posZ) {
            lastLocation = { x: posX, y: posY, z: posZ }
            _playerLoc.set(posX, posY, posZ)
            useGameStore.setState({ playerLocation: _playerLoc })
        }

        if (pos.y > gs.maxHeight) {
            useGameStore.setState({ maxHeight: pos.y.toFixed(2) })
        }

        // Movement (reuse pre-allocated vectors)
        _frontVector.set(
            0,
            0,
            (kb.moveBackward ? 1 : 0) - (kb.moveForward ? 1 : 0)
        )

        _sideVector.set(
            (movingLeft ? 1 : 0) - (movingRight ? 1 : 0),
            0,
            0,
        )

        _direction
            .subVectors(_frontVector, _sideVector)
            .normalize()
            .multiplyScalar(SPEED * (gs.shift ? 2 : 1))

        rb.setLinvel({ x: _direction.x, y: vel.y, z: 0 }, true)

        // Ground check (once per frame)
        const grounded = isGrounded()

        // Jump
        if ((kb.jump || tc.jump) && grounded) {
            rb.setLinvel({ x: vel.x, y: JUMP_FORCE, z: 0 }, true)

            if (tc.jump) {
                useControlsStore.getState().setTouchControls({
                    ...tc,
                    jump: false,
                })
            }
        }
        // Platform stickiness: when grounded and not jumping, apply a constant
        // downward velocity so the player stays glued to downward-moving platforms.
        // The physics solver prevents the player from falling through static surfaces.
        else if (grounded && vel.y < 1) {
            const currentVel = rb.linvel()
            if (currentVel.y > STICK_VELOCITY) {
                rb.setLinvel({ x: currentVel.x, y: STICK_VELOCITY, z: currentVel.z }, true)
            }
        }
    })

    return (
        <group>

            <RigidBody
                ref={rigidBodyRef}
                position={[0, 5, 0]}
                lockRotations
                ccd
                friction={0.05}
                restitution={0}
                linearDamping={0}
                userData={{ isPlayer: true }}
                onCollisionEnter={handleCollision}
            >
                <CapsuleCollider args={[1.75, 1.1]} />
            </RigidBody>

            <group ref={playerModelRef}>

                <Text position={[0, 5, 0]}>
                    {action}
                </Text>

                <ModelKingMen
                    scale={3}
                    rotation={[
                        0,
                        lastMove == "Right" ? degToRad(90) : degToRad(-90),
                        0
                    ]}
                    position={[0, -3.25, 0]}
                    action={action}
                />
            </group>

        </group>
    )
}

export default memo(Player)