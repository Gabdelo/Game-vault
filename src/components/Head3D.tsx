import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { Glitch } from "./ui/Glitch"
import CyberBox from "./ui/CyberBox"

function Head3D({ isInLogin }: { isInLogin: boolean }) {
  const { scene } = useGLTF("/head.glb")
  const headRef = useRef<THREE.Object3D>(null!)
  const lookAtUserRef = useRef(false)

  // Clonar la escena para evitar efectos secundarios
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child: any) => {
      if (child.isMesh) {
        // MeshBasicMaterial para color puro sin brillo, metal ni sombras
        child.material = new THREE.MeshPhysicalMaterial({
          color: "#00FFF7",
  metalness: 2.6,
  roughness: 1,
  clearcoat: 1,
        })
      }
      child.castShadow = false
      child.receiveShadow = false
    })
    
    return clone
  }, [scene])

  // Ciclo recursivo: mira login/registro 12 seg, luego usuario 3 seg
  useEffect(() => {
    let timeoutA: ReturnType<typeof setTimeout>
    let timeoutB: ReturnType<typeof setTimeout>

    const cycle = () => {
      // Fase 1: mirar login/registro (12s)
      lookAtUserRef.current = false

      timeoutA = setTimeout(() => {
        // Fase 2: mirar al usuario (3s)
        lookAtUserRef.current = true

        timeoutB = setTimeout(() => {
          // Reiniciar ciclo
          cycle()
        }, 3000)
      }, 12000)
    }

    cycle()

    return () => {
      clearTimeout(timeoutA)
      clearTimeout(timeoutB)
    }
  }, [])

  // Movimiento suave y continuo para simular que está "viva"
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (headRef.current) {
      // Determina el ángulo Y según si mira al usuario o al login/registro
      let targetY: number
      if (lookAtUserRef.current) {
        targetY = isInLogin ? -0.15 : 0.15
      } else {
        targetY = isInLogin ? -0.7 : 0.7
      }

      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetY,
        0.01
      )

      // Movimientos sutiles en los ejes X y Z (dentro del rango 0.01 - 0.09)
      headRef.current.rotation.x = Math.sin(t * 0.5) * 0.03
      headRef.current.rotation.z = Math.cos(t * 0.4) * 0.015
    }
  })

  return (
    <primitive
      ref={headRef}
      object={clonedScene}
      scale={3.9}
      position={[0, -4.4, 0]}
      rotation={[0, isInLogin ? -0.7 : 0.7, 0]}
    />
  )
}

export default function ThreeScene({ isInLogin }: { isInLogin: boolean }) {
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [isInLogin])

  return (
    
    <div className="w-full h-full  rounded-[90px] p-[4.3rem] ">
      <CyberBox className="w-full h-full" label="EXTRACTING DATA FROM USER BRAIN..."
      bottomLabel="v2.4.1"       // bottom-right, semitransparente
  rightLabel="SECURE ZONE"
  cornerLines
  glow
  accentColor="#00F7FF"
  bgColor="#0a160f"
  padding="10px"
  statusLabel="ONLINE"
  statusColor="#00ff88"
  hudData={[
    ["LINK", "ESTABLISHED"],
["PING", "12ms"],
["LATENCY", "LOW"],

["PACKETS", "SYNC"],
["NODE", "CONNECTED"],
  ]}
  divider dividerText="// STATS //"
  animatedCorners   // esquinas pulsan en fade escalonado (reemplaza cornerLines)
  dashedBorder      // borde punteado en lugar de sólido
  noise             // overlay de grano animado, muy sutil (opacity 0.03)
  dualScan   
  
  
  
  >
      <Glitch 
      trigger="loop" 
      options={{ frames: 6, speed: 10, intensity: 10 }}
      style={{ display: "block", width: "100%", height: "100%", }}
    >
      <Canvas
        style={{
          background: "transparent",
          borderRadius: "90px",
          width: "100%",
          height: "100%",
        }}
        camera={{ position: [0, 0, 4] }}
      >
      <ambientLight intensity={0.9} />

      <directionalLight
        position={[13, 13, 10]}
        intensity={0.8}
        color={"#FFFF00"}
      />

      <spotLight
        position={[5, 5, 5]}
        intensity={0.5}
        angle={0.3}
      />

      <Head3D isInLogin={isInLogin} />

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
    </Glitch>
    </CyberBox>
     </div> 

    
  )
}

// Precarga opcional del modelo para mejorar el rendimiento
useGLTF.preload("/head.glb")