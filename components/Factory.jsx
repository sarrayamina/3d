import { useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { useEffect } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function Model(props) {
  const gltf = useLoader(GLTFLoader, './models/room_and_ball_model.glb') 

  return (
    <primitive object={gltf.scene} />
  )
}

useGLTF.preload('/models/room_and_ball_model.glb')