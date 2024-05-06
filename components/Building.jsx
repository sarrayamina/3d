import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, Stats, Plane } from '@react-three/drei';
import { Model } from './Factory';
import TWEEN from '@tweenjs/tween.js';
import { Raycaster, Vector2 } from 'three';

function Annotation({ point }) {
  return ( point ?
    <Html position={[0, 0, 0]} >
      <svg height="34" width="34" transform="translate(-16 -16)" style={{ cursor: 'pointer' }} >
        <circle
          cx="17"
          cy="17"
          r="16"
          stroke="white"
          strokeWidth="2"
          fill="rgba(0,0,0,.66)"
        />
      </svg>
    </Html> : <></>
  )
}

function Tween() {
  useFrame(() => {
    TWEEN.update()
  })
}

function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

export default function App() {
  const ref = useRef();
  const [point, setPoint] = useState({
    "title": "point 1",
    "infos": [],
    "description": "",
    "lookAt": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "camPos": {
      "x": 14.41,
      "y": 27.73,
      "z": -12.21
    }
  },
)

  const ClickHandler = ({ controls }) => {
    const { camera, scene } = useThree();
    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const handlePointerDown = async (event) => {
      const { clientX, clientY } = event;
      const rect = event.target.getBoundingClientRect();

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const { point } = intersects[0];
        if (event.detail < 2) {
          return;
        }
        setSelectedPoint(JSON.parse(JSON.stringify(point)));
        if (camera) {
          setSelectedCamera(JSON.parse(JSON.stringify(camera.position)))
        }
        setShowModal(true)
      }
    };


    useFrame(() => {
      window.addEventListener('click', handlePointerDown);
      return () => {
        window.removeEventListener('click', handlePointerDown);
      };
    });
  };

  useEffect(() => {
      setInterval(() => {
        let newPoint = point;
        // newPoint.camPos = {
        //   x: newPoint.camPos.x - 0.01,
        //   y: newPoint.camPos.y - 0.01,
        //   z: newPoint.camPos.z - 0.01,
        // }
        newPoint.lookAt = {
          x: newPoint.lookAt.x - 0.05,
          y: newPoint.lookAt.y - 0.00,
          z: newPoint.lookAt.z - 0.05,
        }

        setPoint(JSON.parse(JSON.stringify({...newPoint})));
      }, 100);
  }, [])

  return (
    <>
      <Canvas camera={{ position: [-4.2520588839200215,  4.928318533897892, 4.720094649945432] }}>
        <OrbitControls
          ref={ref}
          target={[3.29, 1.27, -5.07]}
          minPolarAngle={-Math.PI}
          maxPolarAngle={Math.PI * 0.5}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
        />
        <ClickHandler controls={ref} />
        <Suspense fallback={<Loader />}>
          <Environment preset="city" background blur={0.75} />
          <Model />
          <Annotation point={point} />
          <Tween />
        </Suspense>
        <Stats />
      </Canvas>
    </>
  )
}

