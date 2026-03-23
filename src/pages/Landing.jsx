import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import ShieldLogo from "../components/common/ShieldLogo"
import Wordmark from "../components/common/Wordmark"

const primary      = "#0F3D2E"
const primaryLight = "#0B5D3B"
const accent       = "#E6A800"
const accentBright = "#F4B400"

const Landing = () => {
    const navigate  = useNavigate()
    const [visible, setVisible]   = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        setTimeout(() => setVisible(true), 80)
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const fadeIn = (delay = 0) => ({
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
    })

    const features = [
        { icon: "💸", title: "Instant Transfers",      desc: "Send money to any account number in seconds, any time of the day." },
        { icon: "₿",  title: "Sell Crypto to Naira",   desc: "Convert BTC, ETH & USDT to Naira at live market rates, no delays." },
        { icon: "🔒", title: "PIN-Protected Security", desc: "Every transaction requires your personal PIN. Your funds stay yours." },
        { icon: "💼", title: "Crypto Wallet",          desc: "Deposit and manage BTC, ETH and USDT balances in one secure wallet." },
        { icon: "📊", title: "Real-Time Rates",        desc: "Live crypto prices pulled directly from the market before every swap." },
        { icon: "📋", title: "Full History",           desc: "Every banking and crypto transaction logged and accessible anytime." },
    ]

    const navLinks    = ["Features", "How It Works", "About"]
    const footerProduct = ["Bank Transfer", "Sell Crypto", "Crypto Wallet", "Transactions", "PIN Security"]
    const footerCompany = ["About Us", "Privacy Policy", "Terms of Use", "AML Policy"]
    const footerContact = [
        { icon: "✉️", value: "support@hunt2cash.com" },
        { icon: "✉️", value: "help@hunt2cash.com" },
        { icon: "📞", value: "+234 913 739 3413" },
    ]

    return (
        <>
        <nav style={{
                position:       "sticky", top: 0, zIndex: 200,
                height:         "70px",
                display:        "flex", alignItems: "center",
                justifyContent: "space-between",
                padding:        "0 5%",
                background:     scrolled ? "rgba(255,255,255,0.97)" : "#FFFFFF",
                borderBottom:   `1px solid ${scrolled ? "#e8e8e8" : "#f2f2f2"}`,
                boxShadow:      scrolled ? "0 2px 16px rgba(15,61,46,0.08)" : "none",
                transition:     "all 0.3s ease",}}>
                <div
                    style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    <ShieldLogo size={34} />
                    <Wordmark size={18} />
                </div>

                <div className="d-none d-lg-flex align-items-center" style={{ gap: 36 }}>
                    {navLinks.map(label => (
                        <span
                            key={label}
                            style={{
                                color: "#444", fontSize: 14,
                                cursor: "pointer",
                                fontFamily: "'Inter', sans-serif",
                                transition: "color 0.2s",
                            }}
                            onMouseOver={e => e.target.style.color = primary}
                            onMouseOut={e  => e.target.style.color = "#444"}
                        >
                            {label}
                        </span>
                    ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button
                        onClick={() => navigate("/login")}
                        className="d-none d-sm-block"
                        style={{
                            background: "none", border: "none",
                            color: primary, fontSize: 14,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600, cursor: "pointer",
                            padding: "8px 16px",
                            transition: "color 0.2s",
                        }}
                        onMouseOver={e => e.target.style.color = accent}
                        onMouseOut={e  => e.target.style.color = primary}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        style={{
                            background: primary, color: "#FFFFFF",
                            border: "none", borderRadius: 4,
                            padding: "10px 20px", fontSize: 13,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: "bold", letterSpacing: "1px",
                            cursor: "pointer", transition: "background 0.2s",
                        }}
                        onMouseOver={e => e.target.style.background = primaryLight}
                        onMouseOut={e  => e.target.style.background = primary}
                    >
                        GET STARTED
                    </button>
                </div>
            </nav>
        <div style={{ fontFamily: "'Inter', sans-serif", background: "#FFFFFF", overflowX: "hidden" }}>
            <section style={{
                minHeight:  "calc(100vh - 70px)",
                display:    "flex", alignItems: "center",
                padding:    "100px 5% 80px",
                background: "#FFFFFF",
            }}>
                <div className="container-fluid p-0">
                    <div className="row align-items-center g-5">

                        {/* Left */}
                        <div className="col-12 col-lg-6">

                            <div style={{
                                ...fadeIn(0),
                                display:      "inline-flex",
                                alignItems:   "center", gap: 8,
                                border:       `1px solid ${accent}`,
                                borderRadius: 3,
                                padding:      "5px 14px",
                                marginBottom: 36,
                            }}>
                                <span style={{ color: primary, fontSize: 10, letterSpacing: "2.5px", fontWeight: "bold" }}>
                                     BANKING & CRYPTO - ONE PLATFORM
                                </span>
                            </div>

                            <h1 style={{ ...fadeIn(0.1), fontSize: "clamp(38px, 5.5vw, 66px)", fontWeight: "bold", lineHeight: 1.2, color: primary, marginBottom: 14 }}>
                                Bank Smarter,
                            </h1>
                            <h1 style={{ ...fadeIn(0.18), fontSize: "clamp(38px, 5.5vw, 66px)", fontWeight: "bold", lineHeight: 1.2, fontStyle: "italic", color: accent, marginBottom: 14 }}>
                                Convert
                            </h1>
                            <h1 style={{ ...fadeIn(0.26), fontSize: "clamp(38px, 5.5vw, 66px)", fontWeight: "bold", lineHeight: 1.2, color: primary, marginBottom: 36 }}>
                                Smarter.
                            </h1>

                            <p style={{ ...fadeIn(0.34), fontSize: 16, color: "#666", lineHeight: 2, maxWidth: 460, marginBottom: 48 }}>
                                Hunt2Cash gives you complete control over your finances —
                                instant bank transfers, real-time crypto-to-Naira conversion,
                                and bank-grade security. All in one place.
                            </p>

                            <div style={{ ...fadeIn(0.42), display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
                                <button
                                    onClick={() => navigate("/register")}
                                    style={{
                                        background: accent, color: primary,
                                        border: "none", borderRadius: 4,
                                        padding: "15px 34px", fontSize: 14,
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: "bold", letterSpacing: "1px",
                                        cursor: "pointer",
                                        boxShadow: `0 6px 20px ${accent}50`,
                                        transition: "all 0.2s",
                                    }}
                                    onMouseOver={e => {
                                        e.target.style.background = accentBright
                                        e.target.style.transform  = "translateY(-2px)"
                                    }}
                                    onMouseOut={e => {
                                        e.target.style.background = accent
                                        e.target.style.transform  = "translateY(0)"
                                    }}
                                >
                                    CREATE ACCOUNT
                                </button>
                                <button
                                    onClick={() => navigate("/login")}
                                    style={{
                                        background: "transparent", color: primary,
                                        border: `2px solid ${primary}`,
                                        borderRadius: 4, padding: "15px 34px",
                                        fontSize: 14,
                                        fontFamily: "'Inter', sans-serif",
                                        letterSpacing: "1px", cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseOver={e => {
                                        e.target.style.background = primary
                                        e.target.style.color      = "#FFFFFF"
                                    }}
                                    onMouseOut={e => {
                                        e.target.style.background = "transparent"
                                        e.target.style.color      = primary
                                    }}
                                >
                                    SIGN IN
                                </button>
                            </div>

                            <div style={{ ...fadeIn(0.5), display: "flex", gap: 28, flexWrap: "wrap" }}>
                                {["Free to open", "Instant settlement", "No hidden fees"].map((t, i) => (
                                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: "#666", fontSize: 13 }}>
                                        <span style={{ color: accent, fontWeight: "bold", fontSize: 15 }}>✓</span> {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right — Feature card */}
                        <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end">
                            <div style={{
                                ...fadeIn(0.3),
                                background:   "#FFFFFF",
                                border:       "1px solid #e8ede9",
                                borderRadius: 16,
                                padding:      "48px 36px",
                                width:        "100%", maxWidth: 400,
                                boxShadow:    "0 12px 48px rgba(15,61,46,0.10)",
                            }}>
                                <div style={{ textAlign: "center", marginBottom: 36 }}>
                                    <ShieldLogo size={60} />
                                    <div style={{ marginTop: 14 }}>
                                        <Wordmark size={17} />
                                    </div>
                                    <p style={{ color: "#888", fontSize: 13, marginTop: 10, lineHeight: 1.7 }}>
                                        Your finances, protected by a shield<br />that never sleeps.
                                    </p>
                                </div>

                                {[
                                    { icon: "🔒", title: "PIN Protected",     sub: "Every transaction secured" },
                                    { icon: "⚡", title: "Instant Transfers", sub: "Send money in seconds" },
                                    { icon: "₿",  title: "Sell Crypto",       sub: "BTC, ETH & USDT to Naira" },
                                    { icon: "📋", title: "Always Available",  sub: "24/7 account access" },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 14,
                                            padding:      "14px 16px",
                                            marginBottom: 12,
                                            background:   i % 2 === 0 ? "#fafcfb" : "#FFFFFF",
                                            border:       "1px solid #eef2ee",
                                            borderRadius: 10,
                                            transition:   "border-color 0.2s",
                                        }}
                                        onMouseOver={e => e.currentTarget.style.borderColor = accent}
                                        onMouseOut={e  => e.currentTarget.style.borderColor = "#eef2ee"}
                                    >
                                        <div style={{
                                            width: 38, height: 38,
                                            background:   `${accent}18`,
                                            borderRadius: 8,
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center", fontSize: 17,
                                            flexShrink: 0,
                                        }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: "bold", fontSize: 13, color: primary }}>{item.title}</div>
                                            <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{item.sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

          
            <section id="features" style={{ padding: "100px 5%", background: "#F6F9F7" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                    <div style={{ textAlign: "center", marginBottom: 64 }}>
                        <p style={{ color: accent, fontSize: 11, letterSpacing: "3px", fontWeight: "bold", marginBottom: 12 }}>
                            WHAT WE OFFER
                        </p>
                        <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: "bold", color: primary, marginBottom: 16 }}>
                            Everything in One Platform
                        </h2>
                        <p style={{ color: "#777", fontSize: 15, maxWidth: 480, margin: "0 auto", lineHeight: 1.8 }}>
                            From everyday banking to crypto trading — Hunt2Cash handles it all securely.
                        </p>
                    </div>

                    <div className="row g-5">
                        {features.map((f, i) => (
                            <div key={i} className="col-12 col-sm-6 col-lg-4">
                                <div
                                    style={{
                                        background:   "#FFFFFF",
                                        borderRadius: 12,
                                        padding:      "36px 28px",
                                        height:       "100%",
                                        border:       "1px solid #e8ede9",
                                        boxShadow:    "0 2px 12px rgba(15,61,46,0.04)",
                                        transition:   "all 0.25s",
                                        cursor:       "default",
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.transform   = "translateY(-5px)"
                                        e.currentTarget.style.boxShadow   = "0 12px 32px rgba(15,61,46,0.10)"
                                        e.currentTarget.style.borderColor = accent
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.transform   = "translateY(0)"
                                        e.currentTarget.style.boxShadow   = "0 2px 12px rgba(15,61,46,0.04)"
                                        e.currentTarget.style.borderColor = "#e8ede9"
                                    }}
                                >
                                    <div style={{
                                        width: 52, height: 52,
                                        background:   `${accent}18`,
                                        borderRadius: 10,
                                        display: "flex", alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 24, marginBottom: 22,
                                    }}>
                                        {f.icon}
                                    </div>
                                    <h6 style={{ fontWeight: "bold", color: primary, marginBottom: 10, fontSize: 15, fontFamily: "'Inter', sans-serif" }}>
                                        {f.title}
                                    </h6>
                                    <p style={{ color: "#777", fontSize: 13, lineHeight: 1.8, margin: 0 }}>
                                        {f.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            
            <footer style={{ background: primary, color: "#FFFFFF" }}>

                <div style={{ padding: "80px 5% 60px", maxWidth: 1100, margin: "0 auto" }}>
                    <div className="row g-5">

                        {/* Col 1 — Brand */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                                <ShieldLogo size={38} bgColor="#FFFFFF" letterColor={primary} accentColor={accent} />
                                <Wordmark size={17} lightMode />
                            </div>
                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.9, maxWidth: 280 }}>
                                Hunt2Cash is a next-generation fintech platform combining
                                banking and crypto trading — built for speed, security and simplicity.
                            </p>
                            <p style={{ color: accent, fontSize: 12, letterSpacing: "1.5px", marginTop: 20, fontWeight: "bold" }}>
                                TRADE WITH CONFIDENCE.
                            </p>
                        </div>

                        {/* Col 2 — Product */}
                        <div className="col-6 col-sm-3 col-lg-2">
                            <p style={{ color: accent, fontSize: 11, letterSpacing: "2.5px", fontWeight: "bold", marginBottom: 24 }}>
                                PRODUCT
                            </p>
                            {footerProduct.map((item, i) => (
                                <p key={i} style={{ marginBottom: 16 }}>
                                    <span
                                        style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, cursor: "pointer", transition: "color 0.2s" }}
                                        onMouseOver={e => e.target.style.color = accent}
                                        onMouseOut={e  => e.target.style.color = "rgba(255,255,255,0.6)"}
                                    >
                                        {item}
                                    </span>
                                </p>
                            ))}
                        </div>

                        {/* Col 3 — Company */}
                        <div className="col-6 col-sm-3 col-lg-2">
                            <p style={{ color: accent, fontSize: 11, letterSpacing: "2.5px", fontWeight: "bold", marginBottom: 24 }}>
                                COMPANY
                            </p>
                            {footerCompany.map((item, i) => (
                                <p key={i} style={{ marginBottom: 16 }}>
                                    <span
                                        style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, cursor: "pointer", transition: "color 0.2s" }}
                                        onMouseOver={e => e.target.style.color = accent}
                                        onMouseOut={e  => e.target.style.color = "rgba(255,255,255,0.6)"}
                                    >
                                        {item}
                                    </span>
                                </p>
                            ))}
                        </div>

                        {/* Col 4 — Get in touch */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <p style={{ color: accent, fontSize: 11, letterSpacing: "2.5px", fontWeight: "bold", marginBottom: 24 }}>
                                GET IN TOUCH
                            </p>
                            {footerContact.map((c, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                                    <span style={{ fontSize: 14 }}>{c.icon}</span>
                                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>{c.value}</span>
                                </div>
                            ))}
                            <button
                                onClick={() => navigate("/register")}
                                style={{
                                    marginTop:  12,
                                    background: accent, color: primary,
                                    border:     "none", borderRadius: 4,
                                    padding:    "12px 28px", fontSize: 13,
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: "bold", letterSpacing: "1px",
                                    cursor:     "pointer", transition: "all 0.2s",
                                }}
                                onMouseOver={e => e.target.style.background = accentBright}
                                onMouseOut={e  => e.target.style.background = accent}
                            >
                                GET STARTED FREE
                            </button>
                        </div>

                    </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "0 5%" }} />

                {/* Bottom bar */}
                <div style={{
                    padding:        "24px 5%",
                    maxWidth:       1100, margin: "0 auto",
                    display:        "flex", justifyContent: "space-between",
                    alignItems:     "center", flexWrap: "wrap", gap: 12,
                }}>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0 }}>
                        © 2026 Hunt2Cash. All rights reserved.
                    </p>
                    <div style={{ display: "flex", gap: 28 }}>
                        {[["Sign In", "/login"], ["Register", "/register"]].map(([label, path], i) => (
                            <span
                                key={i}
                                onClick={() => navigate(path)}
                                style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", transition: "color 0.2s" }}
                                onMouseOver={e => e.target.style.color = accent}
                                onMouseOut={e  => e.target.style.color = "rgba(255,255,255,0.4)"}
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>

            </footer>

        </div>
    </>
    )
}

export default Landing