const ModalShell = ({ show, onClose, title, children }) => {
    if (!show) return null

    return (
        <div
            onClick={onClose}
            style={{
                position:       "fixed",
                inset:          0,
                background:     "rgba(0,0,0,0.45)",
                zIndex:         200,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                padding:        "16px"
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background:   "#FFFFFF",
                    borderRadius: "16px",
                    padding:      "28px",
                    width:        "100%",
                    maxWidth:     "440px",
                    boxShadow:    "0 8px 40px rgba(0,0,0,0.15)",
                    fontFamily:   "'Inter', sans-serif"
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 style={{
                        color:      "#0F3D2E",
                        fontWeight: "bold",
                        fontSize:   "16px",
                        margin:     0
                    }}>
                        {title}
                    </h6>
                    <span
                        onClick={onClose}
                        style={{
                            cursor:     "pointer",
                            fontSize:   "20px",
                            color:      "#aaa",
                            lineHeight: 1,
                            userSelect: "none"
                        }}
                    >
                        ✕
                    </span>
                </div>
                {children}
            </div>
        </div>
    )
}

export default ModalShell