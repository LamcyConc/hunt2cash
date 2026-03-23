import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import Layout from "../../components/common/Layout"
import { myProfile } from "../../services/api"

const primary      = "#0F3D2E"
const primaryLight = "#0B5D3B"
const accent       = "#E6A800"

const Profile = () => {
    const navigate = useNavigate()
    const cookies  = new Cookies()
    const user     = cookies.get("user")

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async () => {
        try {
            const res = await myProfile()
            setProfile(res.data.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProfile() }, [])

    const initials = user
        ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
        : "?"

    const formatDate = (dateStr) => {
        if (!dateStr) return "—"
        return new Date(dateStr).toLocaleDateString("en-NG", {
            day: "numeric", month: "long", year: "numeric"
        })
    }

    if (loading) {
        return (
            <Layout pageTitle="Profile">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <div style={{ textAlign: "center" }}>
                        <div className="spinner-border" style={{ color: primary }} role="status" />
                        <p style={{ color: "#888", marginTop: 12, fontFamily: "'Inter', sans-serif" }}>
                            Loading profile...
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout pageTitle="Profile">

            {/* Avatar Header */}
            <div
                className="d-flex align-items-center gap-4 mb-4 p-4"
                style={{
                    background:   `linear-gradient(135deg, ${primary} 0%, ${primaryLight} 100%)`,
                    borderRadius: "16px",
                }}
            >
                <div style={{
                    width:          "64px", height: "64px",
                    borderRadius:   "50%",
                    background:     accent,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    color:          primary,
                    fontWeight:     "bold",
                    fontSize:       "22px",
                    fontFamily:     "'Inter', sans-serif",
                    flexShrink:     0,
                    border:         "3px solid rgba(255,255,255,0.3)"
                }}>
                    {initials}
                </div>
                <div>
                    <h5 style={{
                        color:      "#FFFFFF",
                        fontWeight: "bold",
                        fontFamily: "'Inter', sans-serif",
                        margin:     "0 0 4px"
                    }}>
                        {profile?.firstName} {profile?.lastName}
                    </h5>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 6px" }}>
                        {profile?.email}
                    </p>
                    <span style={{
                        background:    `${accent}25`,
                        color:         accent,
                        fontSize:      "10px",
                        padding:       "3px 10px",
                        borderRadius:  "50px",
                        fontFamily:    "'Inter', sans-serif",
                        letterSpacing: "1px",
                        border:        `1px solid ${accent}40`
                    }}>
                        {profile?.roles?.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Profile Details Card */}
            <div style={{
                background:   "#FFFFFF",
                border:       "1px solid #e8ede9",
                borderRadius: "16px",
                padding:      "24px",
                boxShadow:    "0 2px 8px rgba(15,61,46,0.04)",
                marginBottom: "16px"
            }}>
                <p style={{
                    color:         "#888",
                    fontSize:      "11px",
                    letterSpacing: "2px",
                    fontWeight:    "bold",
                    marginBottom:  "16px"
                }}>
                    ACCOUNT DETAILS
                </p>

                {[
                    { label: "FIRST NAME",      value: profile?.firstName     || "—" },
                    { label: "LAST NAME",        value: profile?.lastName      || "—" },
                    { label: "EMAIL",            value: profile?.email         || "—" },
                    { label: "ACCOUNT NUMBER",   value: profile?.accountNumber || "—" },
                    { label: "BALANCE",          value: `₦${parseFloat(profile?.bankBalance || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}` },
                    { label: "ACCOUNT STATUS",   value: profile?.isActive ? "✅ Active" : "❌ Suspended" },
                    { label: "DATE JOINED",      value: formatDate(profile?.createdAt) },
                ].map((row, i) => (
                    <div
                        key={i}
                        className="d-flex justify-content-between align-items-center"
                        style={{ padding: "12px 0", borderBottom: "1px solid #f8f8f8" }}
                    >
                        <span style={{ color: "#aaa", fontSize: "11px", letterSpacing: "1px" }}>
                            {row.label}
                        </span>
                        <span style={{
                            color:      primary,
                            fontWeight: "bold",
                            fontSize:   "13px",
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            {row.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Settings shortcut */}
            <button
                onClick={() => navigate("/settings")}
                style={{
                    width:         "100%",
                    padding:       "13px",
                    background:    "#FFFFFF",
                    color:         primary,
                    border:        `1.5px solid ${primary}`,
                    borderRadius:  "10px",
                    fontSize:      "13px",
                    fontWeight:    "bold",
                    fontFamily:    "'Inter', sans-serif",
                    letterSpacing: "1px",
                    cursor:        "pointer",
                    transition:    "all 0.2s"
                }}
                onMouseOver={e => {
                    e.currentTarget.style.background = primary
                    e.currentTarget.style.color      = "#FFFFFF"
                }}
                onMouseOut={e => {
                    e.currentTarget.style.background = "#FFFFFF"
                    e.currentTarget.style.color      = primary
                }}
            >
                ⚙️ Go to Settings
            </button>

        </Layout>
    )
}

export default Profile;