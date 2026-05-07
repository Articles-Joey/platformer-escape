import React, { useMemo } from 'react'
import { Image } from '@react-three/drei'

const Background = () => {
    const images = useMemo(() => {
        return Array.from({ length: 10 }).map((_, i) => ({
            position: [
                i * 50,
                // (Math.random() - 0.5) * 30,
                0,
                -5
            ],
            scale: [50, 50],
        }))
    }, [])

    return (
        <group position={[-25, 0, -10]}>
            {images.map((img, i) => (
                <Image
                    key={i}
                    url="/img/CogBG01.png"
                    position={img.position}
                    scale={img.scale}
                    transparent
                    opacity={1}
                />
            ))}
        </group>
    )
}

export default Background
