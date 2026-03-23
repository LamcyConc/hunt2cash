import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import Wordmark from "./Wordmark"
import ShieldLogo from "./ShieldLogo"
import MobileDrawer from "./MobileDrawer"

const primary = "#0F3D2E"
const accent  = "#E6A800"

const Navbar = ({ pageTitle = "" }) => {
    const navigate = useNavigate()
    const cookies  = new Cookies()
    const user     = cookies.get("user")

    const [drawerOpen, setDrawerOpen] = useState(false)

    const initials = user
        ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
        : "?"

    return (
        <>
            <div
                style={{
                    position:     "fixed",
                    top: 0, left: 0, right: 0,
                    height:       "64px",
                    background:   "#FFFFFF",
                    borderBottom: "1px solid #e8ede9",
                    display:      "flex",
                    alignItems:   "center",
                    justifyContent: "space-between",
                    padding:      "0 24px",
                    zIndex:       99,
                    boxShadow:    "0 2px 12px rgba(15,61,46,0.06)",
                }}
            >
                {/* Mobile — Logo */}
                <div
                    className="d-md-none d-flex align-items-center gap-2"
                    onClick={() => navigate("/dashboard")}
                    style={{ cursor: "pointer" }}
                >
                    <ShieldLogo size={23} />
                    <Wordmark size={16} />
                </div>

                {/* Right — name + email + avatar + hamburger */}
                <div className="d-flex align-items-center gap-3 ms-auto">

                    {/* Name + email — desktop only */}
                    <div className="d-none d-sm-block" style={{ textAlign: "right" }}>
                        <p style={{
                            margin:     0,
                            fontSize:   "13px",
                            color:      primary,
                            fontWeight: "bold",
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>
                            {user?.email}
                        </p>
                    </div>

                    {/* Avatar */}
                    <div
                        onClick={() => navigate("/profile")}
                        style={{
                            width:          "38px",
                            height:         "38px",
                            borderRadius:   "50%",
                            background:     primary,
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            color:          accent,
                            fontWeight:     "bold",
                            fontSize:       "14px",
                            fontFamily:     "'Inter', sans-serif",
                            cursor:         "pointer",
                            border:         `2px solid ${accent}`,
                            flexShrink:     0,
                            transition:     "transform 0.2s"
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={e  => e.currentTarget.style.transform = "scale(1)"}
                    >
                        {initials}
                    </div>

                    {/* Hamburger — mobile only */}
                    <div
                        className="d-md-none"
                        onClick={() => setDrawerOpen(true)}
                        style={{
                            width:          "38px",
                            height:         "38px",
                            borderRadius:   "8px",
                            background:     "#f4f6f4",
                            border:         "1px solid #e8ede9",
                            display:        "flex",
                            flexDirection:  "column",
                            alignItems:     "center",
                            justifyContent: "center",
                            gap:            "5px",
                            cursor:         "pointer",
                            flexShrink:     0,
                            transition:     "background 0.2s"
                        }}
                        onMouseOver={e => e.currentTarget.style.background = "#e8ede9"}
                        onMouseOut={e  => e.currentTarget.style.background = "#f4f6f4"}
                    >
                        {[0,1,2].map(i => (
                            <div key={i} style={{
                                width:        "16px",
                                height:       "2px",
                                background:   primary,
                                borderRadius: "2px"
                            }} />
                        ))}
                    </div>

                </div>

            </div>

            {/* Mobile Drawer */}
            <MobileDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </>
    )
}

export default Navbar