import { useState, useEffect } from "react"
import { getAdminMessage } from "../../services/api"

const AdminMessageFormat = ({ context = "general" }) => {
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchMessage = async () => {
        try {
            const response = await getAdminMessage(context)
            setMessage(response.data.data)
        } catch (error) {
            setMessage(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessage()
    }, [context])

    if (loading || !message) return null

    return (
        <div
            className="d-flex align-items-start gap-3 p-3 mb-4"
            style={{
                background:  "rgba(15,61,46,0.06)",
                border:      "1px solid rgba(15,61,46,0.15)",
                borderLeft:  "4px solid #0F3D2E",
                borderRadius: "8px",
                fontFamily:  "'Inter', sans-serif"
            }}
        >
            <div style={{
                width: 36, height: 36,
                background:   "#0F3D2E",
                borderRadius: "8px",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                fontSize: "16px", flexShrink: 0
            }}>
                📢
            </div>

            <div className="flex-grow-1">
                <p className="mb-1 fw-semibold" style={{
                    color:         "#0F3D2E",
                    fontSize:      "11px",
                    letterSpacing: "1px"
                }}>
                    ADMIN MESSAGE
                </p>
                <p className="mb-0" style={{ color: "#444", fontSize: "14px", lineHeight: 1.6 }}>
                    {message.message}
                </p>
                <p className="mb-0 mt-1" style={{ color: "#999", fontSize: "11px" }}>
                    {new Date(message.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric", month: "long", year: "numeric"
                    })}
                </p>
            </div>
        </div>
    )
}

export default AdminMessageFormat