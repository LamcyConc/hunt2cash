import { NavLink, useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import ShieldLogo from "./ShieldLogo"
import Wordmark from "./Wordmark"
import { logOut } from "../../services/api"

const primary    = "#0F3D2E"
const primaryMid = "#124734"
const accent     = "#E6A800"

const MobileDrawer = ({ isOpen, onClose }) => {
    const navigate = useNavigate()
    const cookies  = new Cookies()

    const token   = cookies.get("token")
    const isAdmin = token ? JSON.parse(atob(token.split(".")[1])).roles === "admin" : false

    // const handleLogout = () => {
    //     cookies.remove("token", { path: "/" })
    //     cookies.remove("user",  { path: "/" })
    //     window.location.href = "/login"
    // }
    const handleLogout = async () => {
    try {
        await logOut()
    } catch (error) {
        console.log(error)
    } finally {
        cookies.remove("token", { path: "/" })
        cookies.remove("user",  { path: "/" })
        window.location.href = "/login"
    }
}

    const userLinks = [
        { path: "/dashboard",    label: "Dashboard",    icon: "🏠" },
        { path: "/transfer",     label: "Payments",     icon: "💸" },
        { path: "/crypto",       label: "Crypto",       icon: "🪙"  },
        { path: "/transactions", label: "Transactions", icon: "📋" },
        { path: "/settings",     label: "Settings",     icon: "⚙️" },
    ]

    const adminLinks = [
        { path: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
        { path: "/admin/users",     label: "Users",     icon: "👥" },
        { path: "/admin/exchange",  label: "Exchange",  icon: "💱" },
        { path: "/admin/message",   label: "Message",   icon: "📢" },
    ]

    const links = isAdmin ? adminLinks : userLinks

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position:   "fixed",
                    inset:      0,
                    background: "rgba(0,0,0,0.5)",
                    zIndex:     200,
                    opacity:    isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "auto" : "none",
                    transition: "opacity 0.3s ease",
                }}
            />

            {/* Drawer */}
            <div
                style={{
                    position:   "fixed",
                    top:        0,
                    left:       0,
                    bottom:     0,
                    width:      "260px",
                    background: `linear-gradient(180deg, ${primary} 0%, ${primaryMid} 100%)`,
                    zIndex:     201,
                    transform:  isOpen ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s ease",
                    display:    "flex",
                    flexDirection: "column",
                    padding:    "24px 0",
                    boxShadow:  "4px 0 24px rgba(0,0,0,0.2)"
                }}
            >
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between px-4 mb-4">
                    <div
                        className="d-flex align-items-center gap-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            navigate(isAdmin ? "/admin/dashboard" : "/dashboard")
                            onClose()
                        }}
                    >
                        <ShieldLogo size={34} />
                        <div>
                            <Wordmark size={16} lightMode={true} />
                            <p style={{
                                color:         accent,
                                fontSize:      "10px",
                                margin:        0,
                                fontFamily:    "'Inter', sans-serif",
                                letterSpacing: "1.5px",
                                fontWeight:    "bold"
                            }}>
                                {isAdmin ? "ADMIN ACCOUNT" : "PERSONAL ACCOUNT"}
                            </p>
                        </div>
                    </div>

                    {/* Close button */}
                    <div
                        onClick={onClose}
                        style={{
                            width:          "30px",
                            height:         "30px",
                            borderRadius:   "50%",
                            background:     "rgba(255,255,255,0.1)",
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            cursor:         "pointer",
                            color:          "rgba(255,255,255,0.7)",
                            fontSize:       "14px",
                            flexShrink:     0
                        }}
                    >
                        ✕
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 24px 16px" }} />

                {/* Nav Links */}
                <div style={{ flex: 1 }}>
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={onClose}
                            style={({ isActive }) => ({
                                display:        "flex",
                                alignItems:     "center",
                                gap:            "12px",
                                padding:        "14px 24px",
                                color:          isActive ? accent : "rgba(255,255,255,0.6)",
                                background:     isActive ? `${accent}12` : "transparent",
                                borderLeft:     isActive ? `3px solid ${accent}` : "3px solid transparent",
                                textDecoration: "none",
                                fontFamily:     "'Inter', sans-serif",
                                fontSize:       "14px",
                                transition:     "all 0.2s",
                                fontWeight:     isActive ? "bold" : "normal"
                            })}
                        >
                            <span style={{ fontSize: "18px" }}>{link.icon}</span>
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "16px 24px" }} />

                {/* Logout */}
                <div
                    onClick={handleLogout}
                    style={{
                        display:     "flex",
                        alignItems:  "center",
                        gap:         "12px",
                        padding:     "14px 24px",
                        color:       "rgba(255,255,255,0.5)",
                        cursor:      "pointer",
                        fontFamily:  "'Inter', sans-serif",
                        fontSize:    "14px",
                        borderLeft:  "3px solid transparent",
                        transition:  "all 0.2s",
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.color      = "#ef5350"
                        e.currentTarget.style.borderLeft = "3px solid #ef5350"
                        e.currentTarget.style.background = "rgba(239,83,80,0.08)"
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.color      = "rgba(255,255,255,0.5)"
                        e.currentTarget.style.borderLeft = "3px solid transparent"
                        e.currentTarget.style.background = "transparent"
                    }}
                >
                    <span style={{ fontSize: "18px" }}>⭕</span>
                    <span>Logout</span>
                </div>

            </div>
        </>
    )
}

export default MobileDrawer;