import { NavLink, useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import ShieldLogo from "./ShieldLogo"
import Wordmark from "./Wordmark"
import { logOut } from "../../services/api"

const primary = "#0F3D2E"
const primaryMid = "#124734"
const accent = "#E6A800"

const Sidebar = () => {
    const navigate = useNavigate()
    const cookies = new Cookies()

    const token = cookies.get("token")
    const isAdmin = token ? JSON.parse(atob(token.split(".")[1])).roles === "admin" : false

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
        { path: "/dashboard", label: "Dashboard", icon: "🏠" },
        { path: "/transfer", label: "Payments", icon: "💸" },
        { path: "/crypto",      label: "Crypto", icon: "🪙" },
        { path: "/transactions", label: "Transactions", icon: "📋" },
        { path: "/settings", label: "Settings", icon: "⚙️" },,
    ]

    const adminLinks = [
        { path: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
        { path: "/admin/users", label: "Users", icon: "👥" },
        { path: "/admin/exchange", label: "Exchange", icon: "💱" },
        { path: "/admin/message", label: "Message", icon: "📢" },
    ]

    const links = isAdmin ? adminLinks : userLinks

    return (
        <div
            className="d-none d-md-flex flex-column"
            style={{
                width: "240px",
                minHeight: "100vh",
                background: `linear-gradient(180deg, ${primary} 0%, ${primaryMid} 100%)`,
                position: "fixed",
                top: 0, left: 0,
                zIndex: 100,
                padding: "24px 0",
                boxShadow: "2px 0 20px rgba(0,0,0,0.12)"
            }}
        >
            <div
                className="d-flex align-items-center gap-3 px-4 mb-4"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/dashboard")}
            >
                <ShieldLogo size={34} />
                <div>
                    {/* <p style={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        margin: 0,
                        letterSpacing: "0.5px"
                    }}>
                        
                    </p> */}
                    <Wordmark size={16} lightMode={true} />
                    <p style={{
                        color: accent,
                        fontSize: "10px",
                        margin: 0,
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: "1.5px",
                        fontWeight: "bold"
                    }}>
                        {isAdmin ? "ADMIN ACCOUNT" : "PERSONAL ACCOUNT"}
                    </p>
                </div>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 24px 16px" }} />

            <div className="flex-grow-1">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        style={({ isActive }) => ({
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 24px",
                            color: isActive ? accent : "rgba(255,255,255,0.6)",
                            background: isActive ? `${accent}12` : "transparent",
                            borderLeft: isActive ? `3px solid ${accent}` : "3px solid transparent",
                            textDecoration: "none",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "14px",
                            transition: "all 0.2s",
                            fontWeight: isActive ? "bold" : "normal"
                        })}
                    >
                        <span style={{ fontSize: "16px" }}>{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "16px 24px" }} />

            <div
                onClick={handleLogout}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 24px",
                    color: "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    borderLeft: "3px solid transparent",
                    transition: "all 0.2s",
                }}
                onMouseOver={e => {
                    e.currentTarget.style.color = "#ef5350"
                    e.currentTarget.style.borderLeft = "3px solid #ef5350"
                    e.currentTarget.style.background = "rgba(239,83,80,0.08)"
                }}
                onMouseOut={e => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)"
                    e.currentTarget.style.borderLeft = "3px solid transparent"
                    e.currentTarget.style.background = "transparent"
                }}
            >
                <span style={{ fontSize: "16px" }}>⭕</span>
                <span>Logout</span>
            </div>

        </div>
    )
}

export default Sidebar;