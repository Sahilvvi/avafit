"use client"

import { Suspense, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useTexture, Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"
import { RotateCw } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"

type DragState = {
  yaw: number
  yawTarget: number
  pitch: number
  pitchTarget: number
  dragging: boolean
  idleT: number
  zoom: number
  zoomTarget: number
}

const YAW_LIMIT = THREE.MathUtils.degToRad(36)
const PITCH_LIMIT = THREE.MathUtils.degToRad(128)
const MIN_ZOOM = 2.7
const MAX_ZOOM = 6.2

function makeState(): DragState {
  return { yaw: 0, yawTarget: 0, pitch: 0, pitchTarget: 0, dragging: false, idleT: 0, zoom: 4.2, zoomTarget: 4.2 }
}

/**
 * A real object, not an animation of one — an actual textured mesh with
 * volume, studio lighting, and reflections. It turns like something held in
 * your hand, not a camera orbiting it: horizontal drag only ever rotates the
 * exterior face through a bounded arc (it can never spin around to the
 * interior), while dragging upward tips the whole object back on its X axis —
 * like tipping a cup toward you — swinging the interior face into view. The
 * plaque's own edge gives it real thickness, so the turn reads as volume
 * rather than a flat card flipping.
 */
function SocketPlaque({ state }: { state: React.MutableRefObject<DragState> }) {
  const exterior = useTexture("/socket-exterior.png")
  const interior = useTexture("/socket-interior.png")
  const group = useRef<THREE.Group>(null)

  // Reaching the interior face happens via a ~180° rotation about X (a tip,
  // not a spin around Y), which mirrors the box's default UV on both axes
  // relative to how the source image was authored — correct for both so the
  // interior reads right-way-up and unmirrored once it swings into view.
  useMemo(() => {
    interior.wrapS = THREE.RepeatWrapping
    interior.wrapT = THREE.RepeatWrapping
    interior.repeat.set(-1, -1)
    interior.center.set(0.5, 0.5)
    interior.needsUpdate = true
  }, [interior])
  ;[exterior, interior].forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
  })

  const edgeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#141519", roughness: 0.85, metalness: 0.1 }),
    []
  )

  useFrame((_, delta) => {
    const s = state.current
    const d = Math.min(delta, 0.05)
    if (!s.dragging) {
      s.idleT += d
      // Idle life only while closed — once tipped open, hold still instead
      // of oscillating the reveal.
      if (Math.abs(s.pitch) < 0.03) {
        s.yawTarget = Math.sin(s.idleT * 0.55) * YAW_LIMIT * 0.55
      }
      s.pitchTarget = THREE.MathUtils.lerp(s.pitchTarget, 0, 1 - Math.pow(0.001, d))
    }
    s.yaw = THREE.MathUtils.damp(s.yaw, s.yawTarget, 7, d)
    s.pitch = THREE.MathUtils.damp(s.pitch, s.pitchTarget, 7, d)
    if (group.current) {
      group.current.rotation.y = s.yaw
      group.current.rotation.x = -s.pitch
    }
  })

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[1.3, 2.55, 0.16]} />
        <primitive attach="material-0" object={edgeMat} />
        <primitive attach="material-1" object={edgeMat} />
        <primitive attach="material-2" object={edgeMat} />
        <primitive attach="material-3" object={edgeMat} />
        <meshStandardMaterial attach="material-4" map={exterior} roughness={0.55} metalness={0.3} alphaTest={0.5} />
        <meshStandardMaterial attach="material-5" map={interior} roughness={0.55} metalness={0.3} alphaTest={0.5} />
      </mesh>
    </group>
  )
}

/** Drives camera distance from the shared drag state, damped. */
function ZoomRig({ state }: { state: React.MutableRefObject<DragState> }) {
  const { camera } = useThree()
  useFrame((_, delta) => {
    const s = state.current
    s.zoom = THREE.MathUtils.damp(s.zoom, s.zoomTarget, 8, Math.min(delta, 0.05))
    camera.position.z = s.zoom
  })
  return null
}

function Scene({ state }: { state: React.MutableRefObject<DragState> }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <directionalLight position={[-4, -1, -3]} intensity={0.35} color="#5b8cff" />
      <Suspense fallback={null}>
        <SocketPlaque state={state} />
        <Environment preset="city" environmentIntensity={0.5} />
      </Suspense>
      <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={6} blur={2.4} far={2} />
      <ZoomRig state={state} />
    </>
  )
}

export function SocketExplorer() {
  const [ready, setReady] = useState(false)
  const state = useRef<DragState>(makeState())
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map())
  const pinchDist = useRef<number | null>(null)
  const lastSingle = useRef<{ x: number; y: number } | null>(null)

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    setReady(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    state.current.dragging = true
    if (pointers.current.size === 1) {
      lastSingle.current = { x: e.clientX, y: e.clientY }
      pinchDist.current = null
    } else if (pointers.current.size === 2) {
      pinchDist.current = pinchDistance()
      lastSingle.current = null
    }
  }

  function pinchDistance() {
    const pts = Array.from(pointers.current.values())
    if (pts.length < 2) return null
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size >= 2) {
      const dist = pinchDistance()
      if (dist && pinchDist.current) {
        const scale = pinchDist.current / dist
        const s = state.current
        s.zoomTarget = THREE.MathUtils.clamp(s.zoomTarget * scale, MIN_ZOOM, MAX_ZOOM)
      }
      pinchDist.current = dist
      return
    }

    if (!lastSingle.current) return
    const dx = e.clientX - lastSingle.current.x
    const dy = e.clientY - lastSingle.current.y
    lastSingle.current = { x: e.clientX, y: e.clientY }

    const s = state.current
    s.yawTarget = THREE.MathUtils.clamp(s.yawTarget + dx * 0.006, -YAW_LIMIT, YAW_LIMIT)
    s.pitchTarget = THREE.MathUtils.clamp(s.pitchTarget - dy * 0.008, 0, PITCH_LIMIT)
  }

  function endPointer(e: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size === 0) {
      state.current.dragging = false
      lastSingle.current = null
      pinchDist.current = null
    } else if (pointers.current.size === 1) {
      const [[, p]] = Array.from(pointers.current.entries())
      lastSingle.current = p
      pinchDist.current = null
    }
  }

  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    const s = state.current
    s.zoomTarget = THREE.MathUtils.clamp(s.zoomTarget + e.deltaY * 0.0022, MIN_ZOOM, MAX_ZOOM)
  }

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_20%,hsl(var(--primary)/0.07),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="The socket itself"
            title="One socket, seen from every side."
            description="A real 3D object, not a photo — drag sideways to turn it, drag up to tip it back and look inside, pinch or scroll to zoom."
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mt-14 flex flex-col items-center">
            <div
              className="h-[420px] w-full max-w-2xl touch-none sm:h-[480px]"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endPointer}
              onPointerCancel={endPointer}
              onPointerLeave={endPointer}
              onWheel={onWheel}
            >
              <Canvas camera={{ position: [0, 0, 4.2], fov: 38 }} dpr={[1, 2]} gl={{ antialias: true }}>
                <Scene state={state} />
              </Canvas>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <RotateCw className="h-3.5 w-3.5 text-primary/70" strokeWidth={1.8} />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {ready ? "Drag to turn · drag up to open · scroll to zoom" : "Drag to explore"}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
