import { useEffect } from "react"

const Toast = ({ show, type = "success", message, onClose }) => {

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose()
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [show])

    if (!show) return null

    const isSuccess = type === "success"

    return (
        <div
            style={{
                position:     "fixed",
                top:          "80px",
                right:        "20px",
                zIndex:       999,
                minWidth:     "300px",
                maxWidth:     "380px",
                background:   "#FFFFFF",
                borderRadius: "12px",
                boxShadow:    "0 8px 32px rgba(0,0,0,0.15)",
                border:       `1px solid ${isSuccess ? "rgba(76,175,80,0.3)" : "rgba(220,53,69,0.3)"}`,
                borderLeft:   `4px solid ${isSuccess ? "#4CAF50" : "#dc3545"}`,
                padding:      "16px 20px",
                display:      "flex",
                alignItems:   "flex-start",
                gap:          "12px",
                fontFamily:   "'Inter', sans-serif",
                animation:    "slideIn 0.3s ease",
            }}
        >
            {/* Icon */}
            <div style={{
                width:          "32px",
                height:         "32px",
                borderRadius:   "50%",
                background:     isSuccess ? "rgba(76,175,80,0.1)" : "rgba(220,53,69,0.1)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                fontSize:       "16px",
                flexShrink:     0
            }}>
                {isSuccess ? "✅" : "❌"}
            </div>

            <div style={{ flex: 1 }}>
                <p style={{
                    margin:     0,
                    fontWeight: "bold",
                    fontSize:   "13px",
                    color:      isSuccess ? "#4CAF50" : "#dc3545"
                }}>
                    {isSuccess ? "Success" : "Failed"}
                </p>
                <p style={{
                    margin:    "2px 0 0",
                    fontSize:  "12px",
                    color:     "#555",
                    lineHeight: 1.5
                }}>
                    {message}
                </p>
            </div>

            <span
                onClick={onClose}
                style={{
                    cursor:     "pointer",
                    fontSize:   "16px",
                    color:      "#aaa",
                    userSelect: "none",
                    lineHeight: 1,
                    flexShrink: 0
                }}
            >
                ✕
            </span>

            <div style={{
                position:     "absolute",
                bottom:       0,
                left:         0,
                height:       "3px",
                borderRadius: "0 0 12px 12px",
                background:   isSuccess ? "#4CAF50" : "#dc3545",
                animation:    "shrink 4s linear forwards"
            }} />

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(120%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
                @keyframes shrink {
                    from { width: 100%; }
                    to   { width: 0%;   }
                }
            `}</style>

        </div>
    )
}

export default Toast