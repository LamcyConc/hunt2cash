import { NavLink, useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"

const primary = "#0F3D2E"
const accent  = "#E6A800"

const BottomNav = () => {
    const navigate = useNavigate()
    const cookies  = new Cookies()

    const token   = cookies.get("token")
    const isAdmin = token ? JSON.parse(atob(token.split(".")[1])).roles === "admin" : false

    const handleLogout = () => {
        cookies.remove("token", { path: "/" })
        cookies.remove("user",  { path: "/" })
        window.location.href = "/login"
    }

    const userLinks = [
        { path: "/dashboard",    label: "Home",     icon: "🏠" },
        { path: "/transfer",     label: "Transfer", icon: "💸" },
        { path: "/crypto",       label: "Crypto",   icon: "₿"  },
        { path: "/transactions", label: "History",  icon: "📋" },
        { path: "/settings",     label: "Settings", icon: "⚙️" },
    ]

    const adminLinks = [
        { path: "/admin/dashboard", label: "Home",     icon: "🏠" },
        { path: "/admin/users",     label: "Users",    icon: "👥" },
        { path: "/admin/exchange",  label: "Exchange", icon: "💱" },
        { path: "/admin/message",   label: "Message",  icon: "📢" },
    ]

    const links = isAdmin ? adminLinks : userLinks

    return (
        <div
            className="d-md-none d-flex justify-content-around align-items-center"
            style={{
                position:   "fixed",
                bottom: 0, left: 0, right: 0,
                background: primary,
                padding:    "10px 0 18px",
                zIndex:     100,
                boxShadow:  "0 -2px 20px rgba(0,0,0,0.15)"
            }}
        >
            {links.map((link) => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    style={({ isActive }) => ({
                        display:        "flex",
                        flexDirection:  "column",
                        alignItems:     "center",
                        gap:            "3px",
                        textDecoration: "none",
                        color:          isActive ? accent : "rgba(255,255,255,0.45)",
                        transition:     "all 0.2s",
                        minWidth:       "44px",
                    })}
                >
                    <span style={{ fontSize: "20px" }}>{link.icon}</span>
                    <span style={{
                        fontSize:      "9px",
                        fontFamily:    "'Inter', sans-serif",
                        letterSpacing: "0.5px",
                        fontWeight:    "bold"
                    }}>
                        {link.label}
                    </span>
                </NavLink>
            ))}

            {/* Logout */}
            <div
                onClick={handleLogout}
                style={{
                    display:       "flex",
                    flexDirection: "column",
                    alignItems:    "center",
                    gap:           "3px",
                    cursor:        "pointer",
                    color:         "rgba(255,255,255,0.45)",
                    minWidth:      "44px",
                    transition:    "all 0.2s"
                }}
                onMouseOver={e => e.currentTarget.style.color = "#ef5350"}
                onMouseOut={e  => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
            >
                <span style={{ fontSize: "20px" }}>🚪</span>
                <span style={{
                    fontSize:      "9px",
                    fontFamily:    "'Inter', sans-serif",
                    letterSpacing: "0.5px",
                    fontWeight:    "bold"
                }}>
                    Logout
                </span>
            </div>

        </div>
    )
}

export default BottomNav;