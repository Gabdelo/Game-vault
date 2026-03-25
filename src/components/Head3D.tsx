import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { useEffect, useRef } from "react"




function Head3D({ isInLogin }: { isInLogin: boolean }) {
  const { scene } = useGLTF("/head.glb")

  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material.color.set("white")
    }
  })

  return <primitive
      object={scene}
      scale={3.5}
      position={[0,-4, 0]}
      rotation={[0, isInLogin ? -0.7 : 0.7, 0]}
    />
}

export default function ThreeScene({ isInLogin }: { isInLogin: boolean }) {
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [isInLogin])

  return (
    <Canvas
  style={{ background: "transparent" }}
  camera={{ position: [0, 0, 4] }}
>
  <ambientLight intensity={0.4} />

  <directionalLight
    position={[3, 3, 3]}
    intensity={100.5}
    color={"#f7de00"}
  />

  <spotLight
    position={[0, 5, 5]}
    intensity={2}
    angle={0.3}
  />

  <Head3D isInLogin={isInLogin} />

  <OrbitControls
    ref={controlsRef}
    enableZoom={false}
    enablePan={false}
  />
</Canvas>
  )
}