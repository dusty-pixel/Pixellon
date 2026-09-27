import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Galaxy fall — the camera plunges through a star tunnel toward the
 * Vault, accelerating into a warp dive. Pure procedural points +
 * canvas-glow sprites (no textures to download).
 */

function makeGlowTexture(hex) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, '#ffffff')
  grad.addColorStop(0.25, hex)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const PALETTE = ['#00D2FF', '#38BDF8', '#7dd3fc', '#ffb020', '#ffffff']

function StarLayer({ count, radius, zNear, zFar, size, spin }) {
  const ref = useRef(null)
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const col = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const r = radius * Math.sqrt(Math.random())
      const a = Math.random() * Math.PI * 2
      positions[i * 3] = Math.cos(a) * r
      positions[i * 3 + 1] = Math.sin(a) * r
      positions[i * 3 + 2] = zNear - Math.random() * (zNear - zFar)
      col.set(PALETTE[(Math.random() * PALETTE.length) | 0]).multiplyScalar(0.5 + Math.random() * 0.5)
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }
    return { positions, colors }
  }, [count, radius, zNear, zFar])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * spin
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={size} vertexColors sizeAttenuation depthWrite={false} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function Nebula({ position, scale, color, opacity }) {
  const tex = useMemo(() => makeGlowTexture(color), [color])
  const ref = useRef(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.03
  })
  return (
    <sprite ref={ref} position={position} scale={[scale, scale, 1]}>
      <spriteMaterial map={tex} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  )
}

/** Destination beacon — the Vault light at the end of the fall. */
function Beacon() {
  const tex = useMemo(() => makeGlowTexture('#00D2FF'), [])
  const ref = useRef(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    const s = 26 + Math.min(t * 14, 60)
    ref.current.scale.set(s, s, 1)
  })
  return (
    <sprite ref={ref} position={[0, 0, -150]} scale={[26, 26, 1]}>
      <spriteMaterial map={tex} transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  )
}

function FallRig({ onLanded }) {
  const landed = useRef(false)
  useFrame(({ camera, clock }, _dt) => {
    const dt = Math.min(_dt, 0.05)
    const t = clock.elapsedTime
    // gentle drift → accelerating plunge
    const speed = t < 0.9 ? 5 + t * 9 : 13 + (t - 0.9) * 52
    camera.position.z -= speed * dt
    camera.position.x = Math.sin(t * 0.5) * 0.35
    camera.position.y = Math.cos(t * 0.4) * 0.3
    camera.rotation.z = -Math.min(Math.max(t - 0.9, 0), 1.6) * 0.06
    const cam = camera
    if (cam.fov !== undefined) {
      cam.fov = 62 + Math.min(Math.max(t - 0.7, 0), 1.6) * 17
      cam.updateProjectionMatrix()
    }
    camera.lookAt(camera.position.x * 0.4, camera.position.y * 0.4, camera.position.z - 10)
    if (t > 2.55 && !landed.current) {
      landed.current = true
      onLanded()
    }
  })
  return null
}

export default function GalaxyFall({ onLanded }) {
  const cb = useRef(onLanded)
  cb.current = onLanded
  const fire = () => cb.current?.()

  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 30], fov: 62, near: 0.1, far: 400 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05070b']} />
        <fog attach="fog" args={['#05070b', 25, 150]} />
        <StarLayer count={1300} radius={30} zNear={40} zFar={-170} size={0.55} spin={0.008} />
        <StarLayer count={320} radius={13} zNear={40} zFar={-170} size={0.9} spin={-0.012} />
        <Nebula position={[-18, 8, -90]} scale={70} color="#0284C7" opacity={0.4} />
        <Nebula position={[20, -10, -120]} scale={85} color="#7c3aed" opacity={0.28} />
        <Nebula position={[0, 4, -60]} scale={44} color="#ffb020" opacity={0.16} />
        <Beacon />
        <FallRig onLanded={fire} />
      </Canvas>
    </div>
  )
}
