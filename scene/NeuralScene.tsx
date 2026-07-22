'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotionSafe } from '@/lib/useReducedMotionSafe'

/**
 * NeuralScene — a 3D feed-forward neural network built purely from primitive
 * geometries: instanced spheres (neurons), line segments (synapses) and small
 * glowing spheres (signals) that travel along random edges. Lights and
 * materials only — no external assets, no drei Environment.
 *
 * Reduced motion: the network renders as a static frame (no rotation, no
 * pulses, no parallax) via frameloop="demand".
 */

const LAYERS = [6, 10, 10, 6]
const LAYER_X = [-5.2, -1.8, 1.8, 5.2]
const ACCENT = '#0ea5e9'
const ACCENT_BRIGHT = '#7dd3fc'

interface Network {
  positions: THREE.Vector3[]
  edges: [number, number][]
  linePositions: Float32Array
}

function buildNetwork(): Network {
  // Deterministic pseudo-random so SSR/CSR & re-renders agree.
  let seed = 42
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  const positions: THREE.Vector3[] = []
  const layerStart: number[] = []
  LAYERS.forEach((count, li) => {
    layerStart.push(positions.length)
    for (let i = 0; i < count; i++) {
      const spread = 4.6
      const y = (i / (count - 1) - 0.5) * spread + (rand() - 0.5) * 0.7
      const z = (rand() - 0.5) * 2.6
      positions.push(new THREE.Vector3(LAYER_X[li] + (rand() - 0.5) * 0.5, y, z))
    }
  })

  const edges: [number, number][] = []
  for (let li = 0; li < LAYERS.length - 1; li++) {
    for (let a = 0; a < LAYERS[li]; a++) {
      for (let b = 0; b < LAYERS[li + 1]; b++) {
        if (rand() < 0.28) {
          edges.push([layerStart[li] + a, layerStart[li + 1] + b])
        }
      }
    }
  }

  const linePositions = new Float32Array(edges.length * 6)
  edges.forEach(([a, b], i) => {
    positions[a].toArray(linePositions, i * 6)
    positions[b].toArray(linePositions, i * 6 + 3)
  })

  return { positions, edges, linePositions }
}

const PULSE_COUNT = 14

function Network({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const nodesRef = useRef<THREE.InstancedMesh>(null)
  const pulsesRef = useRef<THREE.InstancedMesh>(null)
  // The canvas is pointer-events-none (content sits on top), so parallax
  // tracks the window pointer instead of R3F's canvas-local pointer.
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const net = useMemo(buildNetwork, [])

  const lineGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(net.linePositions, 3))
    return g
  }, [net])

  // Per-pulse state: which edge it rides and its progress/speed.
  const pulses = useMemo(
    () =>
      Array.from({ length: PULSE_COUNT }, (_, i) => ({
        edge: (i * 37) % net.edges.length,
        t: (i / PULSE_COUNT) % 1,
        speed: 0.24 + ((i * 29) % 10) * 0.035,
      })),
    [net],
  )

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const from = useMemo(() => new THREE.Vector3(), [])
  const to = useMemo(() => new THREE.Vector3(), [])

  // Place all node instances once.
  const placeNodes = (mesh: THREE.InstancedMesh) => {
    net.positions.forEach((p, i) => {
      dummy.position.copy(p)
      const s = 0.9 + ((i * 13) % 7) * 0.05
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    if (nodesRef.current && !nodesRef.current.userData.placed) {
      placeNodes(nodesRef.current)
      nodesRef.current.userData.placed = true
    }

    if (reduced) {
      // Static pose for the single demand-rendered frame.
      g.rotation.set(0.1, -0.35, 0)
      return
    }

    // Slow idle rotation + mouse parallax (pointer normalized -1..1).
    const targetY = pointer.current.x * 0.22 + Math.sin(state.clock.elapsedTime * 0.08) * 0.12
    const targetX = -pointer.current.y * 0.14 + 0.08
    g.rotation.y += (targetY - g.rotation.y) * Math.min(1, delta * 2)
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 2)

    // Signals travelling along edges.
    const mesh = pulsesRef.current
    if (mesh) {
      pulses.forEach((p, i) => {
        p.t += delta * p.speed
        if (p.t >= 1) {
          p.t = 0
          p.edge = (p.edge + 7) % net.edges.length
        }
        const [a, b] = net.edges[p.edge]
        from.copy(net.positions[a])
        to.copy(net.positions[b])
        dummy.position.lerpVectors(from, to, p.t)
        // Brightest mid-flight.
        const s = 0.5 + Math.sin(p.t * Math.PI) * 0.7
        dummy.scale.setScalar(s)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      })
      mesh.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={group}>
      {/* Neurons */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, net.positions.length]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={0.55}
          roughness={0.35}
          metalness={0.1}
        />
      </instancedMesh>

      {/* Synapses */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={ACCENT} transparent opacity={0.22} />
      </lineSegments>

      {/* Signals */}
      <instancedMesh ref={pulsesRef} args={[undefined, undefined, PULSE_COUNT]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshBasicMaterial color={ACCENT_BRIGHT} transparent opacity={0.95} />
      </instancedMesh>
    </group>
  )
}

export default function NeuralScene() {
  const reduced = useReducedMotionSafe()

  return (
    <Canvas
      frameloop={reduced ? 'demand' : 'always'}
      camera={{ position: [0, 0, 9.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
      className="!pointer-events-none"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 6, 8]} intensity={90} color={ACCENT_BRIGHT} />
      <pointLight position={[-7, -4, 6]} intensity={40} color="#ffffff" />
      <Network reduced={reduced} />
    </Canvas>
  )
}
