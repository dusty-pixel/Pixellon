import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { usePointer } from '../../motion/MotionProvider'
import { useScrollProgress } from '../../motion/useScrollProgress'

function brandColors() {
  try {
    const css = getComputedStyle(document.documentElement)
    const g = (n, fb) => (css.getPropertyValue(n) || '').trim() || fb
    return [g('--theme-primary', '#0284C7'), g('--theme-accent', '#00D2FF'), g('--theme-accent2', '#38BDF8')]
  } catch {
    return ['#0284C7', '#00D2FF', '#38BDF8']
  }
}

/** Instanced floating voxel cubes — one draw call. */
function VoxelField({ count }) {
  const ref = useRef(null)
  const group = useRef(null)
  const { progress } = useScrollProgress()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colors = useMemo(() => brandColors(), [])

  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 14,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 6 - 1,
        s: 0.12 + Math.random() * 0.42,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        sp: 0.1 + Math.random() * 0.35,
        ph: Math.random() * Math.PI * 2,
        c: colors[i % colors.length],
      })),
    [count, colors],
  )

  const colorObjs = useMemo(() => data.map((d) => new THREE.Color(d.c)), [data])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    // Scroll journey: the whole field slowly wheels as the page descends.
    if (group.current) group.current.rotation.y = t * 0.02 + progress.get() * 0.9
    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      dummy.position.set(d.x, d.y + Math.sin(t * d.sp + d.ph) * 0.45, d.z)
      dummy.rotation.set(d.rx + t * d.sp * 0.4, d.ry + t * d.sp * 0.3, 0)
      dummy.scale.setScalar(d.s)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
      ref.current.setColorAt(i, colorObjs[i])
    }
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  })

  return (
    <group ref={group}>
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0.75} toneMapped={false} />
    </instancedMesh>
    </group>
  )
}

function PortalRing() {
  const ref = useRef(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.z = clock.elapsedTime * 0.12
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.25 + Math.PI / 2.4
  })
  return (
    <mesh ref={ref} position={[2.6, 0.4, -2.5]}>
      <torusGeometry args={[1.5, 0.045, 12, 72]} />
      <meshBasicMaterial color="#00D2FF" transparent opacity={0.5} toneMapped={false} />
    </mesh>
  )
}

function ParticleField({ count }) {
  const ref = useRef(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2
    }
    return arr
  }, [count])
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.015
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.15) * 0.15
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#38BDF8" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/** Camera drifts with shared pointer + full-page scroll journey. */
function CameraRig({ pointer }) {
  const { camera } = useThree()
  const { progress } = useScrollProgress()

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    const p = progress.get()
    const tx = (pointer?.nx ? pointer.nx.get() : 0) * 1.3
    const ty = (pointer?.ny ? -pointer.ny.get() : 0) * 0.8 + p * 1.4
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 2, d)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 2, d)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 10 + p * 4, 2, d)
    camera.lookAt(0, p * 1.2, -1)
  })
  return null
}

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error) {
    console.warn('WebGL Arena Scene fallback activated:', error)
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

export default function ArenaScene() {
  const pointer = usePointer()
  const coarse = pointer?.coarse
  const [visible, setVisible] = useState(true)
  const wrapRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([en]) => setVisible(en.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden>
      <WebGLErrorBoundary>
        <Canvas
          dpr={coarse ? [1, 1] : [1, 1.5]}
          camera={{ position: [0, 0, 10], fov: 52 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          frameloop={visible ? 'always' : 'never'}
        >
          <Suspense fallback={null}>
            <VoxelField count={coarse ? 34 : 85} />
            <PortalRing />
            <ParticleField count={coarse ? 120 : 260} />
            <CameraRig pointer={pointer} />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  )
}
