import '@google/model-viewer'

const ModelViewer = () => {
    return (
        <div style={{ width: '100%', height: '200px' }}>
            {/* @ts-ignore */}
            <model-viewer
                src="/soporte_ruedas.glb"
                shadow-intensity="1"
                style={{ width: '100%', minHeight: '200px', display: 'block' }}
            />
        </div>
    )
}

export default ModelViewer