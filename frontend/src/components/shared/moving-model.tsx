import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useRef, useEffect } from 'react'
import type { MovingModelProps } from '@/types/props'
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js'

const COLORS: Record<string, number> = {
    "Idle": 0x6b7280,
    "Precharge": 0xeab308,
    "Ready": 0x10b981,
    "Running": 0x3b82f6,
    "Boosting": 0xa78bfa,
    "Braking": 0xf97316,
    "Stopped": 0x9a3412,
    "Crashed": 0xdc2626
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

        const camera = new THREE.PerspectiveCamera(30, mount.clientWidth / mount.clientHeight, 0.1, 1000)
        camera.position.set(-2.5, 2, -2)
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

        // Add a line next to the track
        const material = new THREE.LineBasicMaterial()
        material.color = new THREE.Color().setRGB(255, 255, 255)
        // Not effective using WebGL
        // material.linewidth = 20

        const points = []

        // Also need the points for the text
        const zero = new THREE.Vector3(-0.75, 0, -1)
        const ten = new THREE.Vector3(-0.75, 0, 9)
        const twenty = new THREE.Vector3(-0.75, 0, 19)
        const thirty = new THREE.Vector3(-0.75, 0, 29)
        const fourty = new THREE.Vector3(-0.75, 0, 39)
        const fifty = new THREE.Vector3(-0.75, 0, 49)

        points.push(zero)
        points.push(ten)
        points.push(twenty)
        points.push(thirty)
        points.push(fourty)
        points.push(fifty)
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(geometry, material)
        line.computeLineDistances()
        scene.add(line)

        // Text render
        const textLoader = new FontLoader()
        textLoader.load("/helvetiker_bold.typeface.json", font => {
            const config = {
                font,
                size: 0.2,
                depth: 0.02,
                curveSegments: 12
            }
            
            const material = new THREE.MeshBasicMaterial({
                color: 0xffffff
            });

            for (let i = 0; i < 21; i++) {
                const geometry = new TextGeometry(`${2.5*i} m`, config)
                
                const textMesh = new THREE.Mesh(geometry, material).rotateY(180)
                textMesh.position.set(zero.x, zero.y, zero.z + 2.5*i)
                scene.add(textMesh)
            }
        }, undefined, undefined)

        // Camera controls (orbit -> around the vehicle)
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

        vehicle.traverse((piece) => {
            if (piece instanceof THREE.Mesh) {
                piece.material.color.setHex(COLORS[progressInfo.state])
            }
        })

        // Moving the vehicle
        const diff = new THREE.Vector3(-1, 0, -1)
        vehicle.position.set(
            position.x + diff.x,
            position.y + diff.y,
            position.z + diff.z
        )

        // Camera movement
        const offset = new THREE.Vector3(-2.5, 2, -2)
        camera.position.set(
            position.x + offset.x,
            position.y + offset.y,
            position.z + offset.z
        )

        // ControlOrbits new position
        controls.target.set(position.x, position.y, position.z)
        controls.update()
    }, [position, progressInfo.state])

    //! Isn't posible the camara movement in the App, because it's position is recalculated each render
    return <div ref={mountRef} style={{ width: '100%', height: '90%' }} />
}

export default MovingModel