import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useRef, useEffect } from 'react'
import type { ProgressInfo } from '@/types/types'

type MovingModelProps = {
    progressInfo: ProgressInfo
}

const MovingModel = ({ progressInfo }: MovingModelProps) => {

    if (progressInfo === null) {
        return <div className='text-lg'>No data</div>
    }

    const position = { x: 0, y: 0, z: progressInfo.position_m }

    const mountRef = useRef<HTMLDivElement>(null)
    const vehicleRef = useRef<THREE.Object3D | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const controlsRef = useRef<OrbitControls | null>(null)

    // Prepares and renders the model, just ejecutes once
    useEffect(() => {
        const mount = mountRef.current!

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x182328)

        const camera = new THREE.PerspectiveCamera(35, mount.clientWidth / mount.clientHeight, 0.1, 1000)
        camera.position.set(1, 1, 3)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(mount.clientWidth, mount.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        mount.appendChild(renderer.domElement)

        // Add light to the scene
        scene.add(new THREE.AmbientLight(0xffffff, 1))
        const dirLight = new THREE.DirectionalLight(0xffffff, 2)
        dirLight.position.set(5, 5, 5)
        scene.add(dirLight)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controlsRef.current = controls

        const loader = new GLTFLoader()
        loader.load(
            '/full-model-1.glb',
            (gltf) => {
                scene.add(gltf.scene)

                const vehicle = gltf.scene.getObjectByName('Ensamblaje_Abrazadera_más_soportes_ruedas_y_ruedas')
                if (vehicle) {
                    vehicle.position.set(-1, 0, -1)
                    vehicleRef.current = vehicle
                }
            },
            undefined,
            (error) => console.error('Error cargando modelo:', error)
        )

        let frameId: number
        const animate = () => {
            frameId = requestAnimationFrame(animate)
            controls.update()
            renderer.render(scene, camera)
        }
        animate()

        return () => {
            cancelAnimationFrame(frameId)
            renderer.dispose()
            mount.removeChild(renderer.domElement)
        }
    }, [])

    // Changes the position and camera when position changes
    useEffect(() => {
        const vehicle = vehicleRef.current
        const camera = cameraRef.current
        const controls = controlsRef.current
        if (!vehicle || !camera || !controls) return

        // Moving the vehicle
        const diff = new THREE.Vector3(-1, 0, -1.5)
        vehicle.position.set(
            position.x + diff.x,
            position.y + diff.y,
            position.z + diff.z
        )

        // Camera movement
        const offset = new THREE.Vector3(1, 1, 3)
        camera.position.set(
            position.x + offset.x,
            position.y + offset.y,
            position.z + offset.z
        )

        // ControlOrbits new position
        controls.target.set(position.x, position.y, position.z)
        controls.update()
    }, [position])

    //! Isn't posible the camara movement in the App, because it's position is recalculated each render
    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}

export default MovingModel