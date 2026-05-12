import '@google/model-viewer'

const ModelViewer = () => {
    return (
        <div style={{ width: '100%', height: '300px' }}>
            {/* @ts-ignore */}
            <model-viewer
                src="/vehicle.glb"
                shadow-intensity="1"
                control-camera
                touch-action="pan-y"
                style={{ width: '100%', minHeight: '300px', display: 'block' }}
            />
        </div>
    )
}

export default ModelViewer