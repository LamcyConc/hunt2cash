import Sidebar from "./Sidebar"
import BottomNav from "./BottomNav"
import Navbar from "./Navbar"

const Layout = ({ children, pageTitle }) => {
    return (
        <div style={{ background: "#F4F6F4", minHeight: "100vh" }}>

            <Sidebar />
            <Navbar pageTitle={pageTitle} />

            {/* Desktop — pushed right by sidebar, down by navbar */}
            <div
                className="d-none d-md-block"
                style={{
                    marginLeft: "240px",
                    paddingTop: "64px",  // ← navbar height
                }}
            >
                <div className="p-4" style={{ paddingBottom: "40px" }}>
                    {children}
                </div>
            </div>

            {/* Mobile — pushed down by navbar, up by bottom nav */}
            <div
                className="d-md-none"
                style={{
                    paddingTop: "64px",   // ← navbar height
                }}
            >
                <div className="p-3" style={{ paddingBottom: "160px" }}>
                    {children}
                </div>
            </div>

        </div>
    )
}

export default Layout;