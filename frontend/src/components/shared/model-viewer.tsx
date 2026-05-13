import '@google/model-viewer'

const ModelViewer = () => {
    return (
        <div style={{ width: '100%', height: '300px' }}>
            {/* @ts-ignore */}
            <model-viewer
                src="/full-model-1.glb"
                shadow-intensity="1"
                camera-controls
                alt="Static model"
                camera-orbit="0deg 75deg 2m"
                style={{ width: '100%', minHeight: '300px', display: 'block' }}
            />
        </div>
    )
}

export default ModelViewer