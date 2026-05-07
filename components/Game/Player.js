import { useFrame, useThree } from "@react-three/fiber"
import { RigidBody, CapsuleCollider, useRapier, BallCollider } from "@react-three/rapier"
import { memo, useRef, useState, useEffect, useCallback } from "react"
import { Vector3 } from "three"

import { useKeyboardStore } from "@/hooks/useKeyboard"
import { Model as ModelKingMen } from "@/components/Models/King";
import { useControlsStore, useGameStore } from "@/hooks/useGameStore";
import { degToRad } from "three/src/math/MathUtils";
import { Text } from "@react-three/drei";
import { useStore } from "@/hooks/useStore"

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

const PROJECTILE_SPEED = 30;

function Projectile({ id, startPos, dir, onExpire }) {
    const rbRef = useRef()
    const birthTime = useRef(Date.now())
    const expired = useRef(false)

    useEffect(() => {
        const rb = rbRef.current
        if (rb) {
            rb.setLinvel({ x: dir.x * PROJECTILE_SPEED, y: dir.y * PROJECTILE_SPEED, z: 0 }, true)
        }
    }, [])

    useFrame(() => {
        if (!expired.current && Date.now() - birthTime.current > 5000) {
            expired.current = true
            onExpire(id)
        }
    })

    return (
        <RigidBody ref={rbRef} position={startPos} gravityScale={0} ccd>
            <BallCollider args={[0.15]} />
            <mesh>
                <sphereGeometry args={[0.15]} />
                <meshStandardMaterial color="red" emissive="red" emissiveIntensity={1} />
            </mesh>
        </RigidBody>
    )
}

function Player(props) {

    const rigidBodyRef = useRef()
    const playerModelRef = useRef()
    const lastMoveRef = useRef("Right")
    const actionRef = useRef("Idle")

    const debug = useStore(state => state.debug)

    // These only update when the value actually changes (infrequent),
    // triggering a re-render to update the model's animation/rotation.
    const [lastMove, setLastMove] = useState("Right");
    const [action, setAction] = useState("Idle")
    const [projectiles, setProjectiles] = useState([])
    const [repeatFire, setRepeatFire] = useState(true)
    const lastFireInfo = useRef(null)

    const { camera, gl } = useThree()
    const { rapier, world } = useRapier()

    const handleProjectileExpire = useCallback((id) => {
        setProjectiles(prev => prev.filter(p => p.id !== id))
    }, [])

    useEffect(() => {
        const canvas = gl.domElement

        const fire = (worldPos) => {
            const rb = rigidBodyRef.current
            if (!rb) return

            const playerPos = rb.translation()
            const dx = worldPos.x - playerPos.x
            const dy = worldPos.y - playerPos.y
            const len = Math.sqrt(dx * dx + dy * dy) || 1

            setProjectiles(prev => [...prev, {
                id: Date.now() + Math.random(),
                startPos: [playerPos.x, playerPos.y + 1, 0],
                dir: { x: dx / len, y: dy / len }
            }])

            // Play shooting animation for 0.25 seconds
            actionRef.current = "Idle_Gun_Shoot"
            setAction("Idle_Gun_Shoot")
            setTimeout(() => {
                // Return to Idle (or it will be updated by next useFrame anyway)
                if (actionRef.current === "Idle_Gun_Shoot") {
                    actionRef.current = "Idle"
                    setAction("Idle")
                }
            }, 250)
        }

        const handleClick = (event) => {
            const rb = rigidBodyRef.current
            if (!rb) return

            const rect = canvas.getBoundingClientRect()
            const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1
            const ndcY = -((event.clientY - rect.top) / rect.height) * 2 + 1

            // Unproject screen point through camera to the Z=0 world plane
            const vec = new Vector3(ndcX, ndcY, 0.5)
            vec.unproject(camera)
            const dir = vec.sub(camera.position).normalize()
            const t = -camera.position.z / dir.z
            const worldPos = camera.position.clone().addScaledVector(dir, t)

            lastFireInfo.current = worldPos
            fire(worldPos)
        }

        canvas.addEventListener('click', handleClick)
        return () => canvas.removeEventListener('click', handleClick)
    }, [camera, gl])

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
            rb.setTranslation({ x: 0, y: 20, z: 0 }, true)
        }

        if (otherData?.isStar) {
            const currentScore = useGameStore.getState().score;
            useGameStore.getState().setScore(currentScore + 1)
        }
    }

    const lastFireTime = useRef(0)

    useFrame(() => {
        const rb = rigidBodyRef.current
        if (!rb) return

        // Auto-firing logic
        if (repeatFire && lastFireInfo.current) {
            const now = Date.now()
            if (now - lastFireTime.current > 500) { // Shoot every 500ms
                lastFireTime.current = now
                
                const playerPos = rb.translation()
                const worldPos = lastFireInfo.current
                const dx = worldPos.x - playerPos.x
                const dy = worldPos.y - playerPos.y
                const len = Math.sqrt(dx * dx + dy * dy) || 1

                setProjectiles(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    startPos: [playerPos.x, playerPos.y + 1, 0],
                    dir: { x: dx / len, y: dy / len }
                }])

                // Play shooting animation
                if (actionRef.current !== "Idle_Gun_Shoot") {
                    const prevAction = actionRef.current
                    actionRef.current = "Idle_Gun_Shoot"
                    setAction("Idle_Gun_Shoot")
                    setTimeout(() => {
                        if (actionRef.current === "Idle_Gun_Shoot") {
                            actionRef.current = prevAction
                            setAction(prevAction)
                        }
                    }, 250)
                }
            }
        }

        // Read all state imperatively — no React subscriptions, no re-renders
        const kb = useKeyboardStore.getState()
        const tc = useControlsStore.getState().touchControls
        const gs = useGameStore.getState()

        const pos = rb.translation()
        const vel = rb.linvel()

        // Fall reset
        if (pos.y < -15) {
            rb.setLinvel({ x: 0, y: 0, z: 0 }, true)
            rb.setTranslation({ x: 0, y: 20, z: 0 }, true)
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
            if (actionRef.current !== "Walk" && actionRef.current !== "Idle_Gun_Shoot") { 
                actionRef.current = "Walk"; 
                setAction("Walk") 
            }
        } else if (movingLeft) {
            if (lastMoveRef.current !== "Left") { lastMoveRef.current = "Left"; setLastMove("Left") }
            if (actionRef.current !== "Walk" && actionRef.current !== "Idle_Gun_Shoot") { 
                actionRef.current = "Walk"; 
                setAction("Walk") 
            }
        } else {
            if (actionRef.current !== "Idle" && actionRef.current !== "Idle_Gun_Shoot") { 
                actionRef.current = "Idle"; 
                setAction("Idle") 
            }
        }

        // Camera follow (reuse pre-allocated vectors)
        if (gs.cameraMode === "Player") {
            _cameraPos.set(
                pos.x, 
                pos.y + 0, 
                30
            )
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
                <CapsuleCollider args={[1.75, 0.8]} />
            </RigidBody>

            <group ref={playerModelRef}>

                {debug &&
                    <group>
                        <Text position={[0, 6, 0]} fontSize={0.5} color="white" onClick={() => setRepeatFire(!repeatFire)}>
                            {`RepeatFire: ${repeatFire ? "ON" : "OFF"}`}
                        </Text>
                        <Text position={[0, 5, 0]}>
                            {action}
                        </Text>
                    </group>
                }

                <ModelKingMen
                    // scale={3}
                    scale={2.5}
                    rotation={[
                        0,
                        lastMove == "Right" ? degToRad(90) : degToRad(-90),
                        0
                    ]}
                    position={[0, -2.5, 0]}
                    action={action}
                />
            </group>

            {projectiles.map(p => (
                <Projectile
                    key={p.id}
                    id={p.id}
                    startPos={p.startPos}
                    dir={p.dir}
                    onExpire={handleProjectileExpire}
                />
            ))}

        </group>
    )
}

export default memo(Player)