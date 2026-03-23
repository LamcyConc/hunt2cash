import { useState, useEffect } from "react"
import Layout from "../../components/common/Layout"
import ModalShell from "../../components/common/ModalShell"
import { getAllUsers, toggleUserStatus, deleteUser } from "../../services/api"

const primary = "#0F3D2E"
const accent  = "#E6A800"

const AdminUsers = () => {
    const [users,         setUsers]         = useState([])
    const [filtered,      setFiltered]      = useState([])
    const [loading,       setLoading]       = useState(true)
    const [search,        setSearch]        = useState("")
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [actionLoading, setActionLoading] = useState(null)
    const [successMsg,    setSuccessMsg]    = useState("")
    const [errorMsg,      setErrorMsg]      = useState("")

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers()
            setUsers(res.data.data || [])
            setFiltered(res.data.data || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [])

    // Search filter
    useEffect(() => {
        if (!search) {
            setFiltered(users)
            return
        }
        const q = search.toLowerCase()
        setFiltered(users.filter(u =>
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.accountNumber?.includes(q)
        ))
    }, [search, users])

    const handleToggle = async (userId) => {
        setActionLoading(userId)
        setSuccessMsg("")
        setErrorMsg("")
        try {
            await toggleUserStatus(userId)
            await fetchUsers()
            setSuccessMsg("User status updated successfully!")
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Failed to update status")
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async (userId) => {
        setActionLoading(userId)
        setSuccessMsg("")
        setErrorMsg("")
        try {
            await deleteUser(userId)
            await fetchUsers()
            setConfirmDelete(null)
            setSuccessMsg("User deleted successfully!")
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Failed to delete user")
        } finally {
            setActionLoading(null)
        }
    }

    if (loading) {
        return (
            <Layout pageTitle="Users">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <div style={{ textAlign: "center" }}>
                        <div className="spinner-border" style={{ color: primary }} role="status" />
                        <p style={{ color: "#888", marginTop: 12, fontFamily: "'Inter', sans-serif" }}>
                            Loading users...
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout pageTitle="Users">

            <div className="mb-4">
                <h5 style={{
                    color:        primary,
                    fontWeight:   "bold",
                    fontFamily:   "'Inter', sans-serif",
                    marginBottom: 4
                }}>
                    User Management
                </h5>
                <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
                    {users.length} total users
                </p>
            </div>

            {/* Messages */}
            {successMsg && (
                <div className="mb-3 p-3" style={{
                    background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.2)",
                    borderRadius: "8px", color: "#4CAF50", fontSize: "13px"
                }}>
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="mb-3 p-3" style={{
                    background: "rgba(220,53,69,0.06)", border: "1px solid rgba(220,53,69,0.15)",
                    borderRadius: "8px", color: "#dc3545", fontSize: "13px"
                }}>
                    {errorMsg}
                </div>
            )}

            {/* Search */}
            <div className="mb-3" style={{ maxWidth: "400px" }}>
                <input
                    type="text"
                    placeholder="Search by name, email or account number..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        width:        "100%",
                        padding:      "10px 14px",
                        borderRadius: "8px",
                        border:       "1.5px solid #ddd",
                        fontSize:     "13px",
                        fontFamily:   "'Inter', sans-serif",
                        outline:      "none",
                        background:   "#FFFFFF"
                    }}
                    onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                    onBlur={e  => e.target.style.border = "1.5px solid #ddd"}
                />
            </div>

            {/* Table */}
            <div style={{
                background:   "#FFFFFF",
                border:       "1px solid #e8ede9",
                borderRadius: "16px",
                overflow:     "hidden",
                boxShadow:    "0 2px 8px rgba(15,61,46,0.04)"
            }}>
                {/* Table header */}
                <div
                    className="d-none d-md-grid"
                    style={{
                        display:             "grid",
                        gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr",
                        padding:             "12px 20px",
                        background:          "#fafafa",
                        borderBottom:        "1px solid #f0f0f0"
                    }}
                >
                    {["NAME", "EMAIL", "ACCOUNT NO.", "STATUS", "ACTIONS"].map((h, i) => (
                        <span key={i} style={{
                            color:         "#aaa",
                            fontSize:      "10px",
                            letterSpacing: "1.5px",
                            fontWeight:    "bold"
                        }}>
                            {h}
                        </span>
                    ))}
                </div>

                {/* Rows */}
                {filtered.length === 0 ? (
                    <div style={{ padding: "60px 24px", textAlign: "center" }}>
                        <p style={{ fontSize: "32px", marginBottom: 8 }}>👤</p>
                        <p style={{ color: "#aaa", fontFamily: "'Inter', sans-serif", margin: 0 }}>
                            No users found
                        </p>
                    </div>
                ) : (
                    filtered.map((user, i) => (
                        <div
                            key={user._id}
                            style={{
                                borderBottom: i < filtered.length - 1 ? "1px solid #f8f8f8" : "none",
                                padding:      "14px 20px",
                            }}
                        >
                            {/* Desktop row */}
                            <div
                                className="d-none d-md-grid align-items-center"
                                style={{
                                    display:             "grid",
                                    gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr",
                                    gap:                 "8px"
                                }}
                            >
                                {/* Name */}
                                <div className="d-flex align-items-center gap-2">
                                    <div style={{
                                        width:          "32px", height: "32px",
                                        borderRadius:   "50%",
                                        background:     primary,
                                        display:        "flex",
                                        alignItems:     "center",
                                        justifyContent: "center",
                                        color:          accent,
                                        fontWeight:     "bold",
                                        fontSize:       "11px",
                                        flexShrink:     0
                                    }}>
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                    </div>
                                    <span style={{
                                        color:      primary,
                                        fontWeight: "bold",
                                        fontSize:   "13px",
                                        fontFamily: "'Inter', sans-serif"
                                    }}>
                                        {user.firstName} {user.lastName}
                                    </span>
                                </div>

                                {/* Email */}
                                <span style={{
                                    color:        "#888",
                                    fontSize:     "12px",
                                    overflow:     "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace:   "nowrap"
                                }}>
                                    {user.email}
                                </span>

                                {/* Account number */}
                                <span style={{
                                    color:      primary,
                                    fontSize:   "12px",
                                    fontFamily: "monospace",
                                    fontWeight: "bold"
                                }}>
                                    {user.accountNumber}
                                </span>

                                {/* Status */}
                                <span style={{
                                    background:   user.isActive ? "rgba(76,175,80,0.1)" : "rgba(239,83,80,0.1)",
                                    color:        user.isActive ? "#4CAF50" : "#ef5350",
                                    fontSize:     "10px",
                                    fontWeight:   "bold",
                                    padding:      "3px 10px",
                                    borderRadius: "50px",
                                    letterSpacing: "0.5px",
                                    display:      "inline-block"
                                }}>
                                    {user.isActive ? "ACTIVE" : "SUSPENDED"}
                                </span>

                                {/* Actions */}
                                <div className="d-flex gap-2">
                                    <button
                                        onClick={() => handleToggle(user._id)}
                                        disabled={actionLoading === user._id}
                                        style={{
                                            padding:      "5px 10px",
                                            background:   user.isActive ? "rgba(239,83,80,0.1)" : "rgba(76,175,80,0.1)",
                                            color:        user.isActive ? "#ef5350" : "#4CAF50",
                                            border:       "none",
                                            borderRadius: "6px",
                                            fontSize:     "11px",
                                            fontWeight:   "bold",
                                            cursor:       actionLoading === user._id ? "not-allowed" : "pointer",
                                            fontFamily:   "'Inter', sans-serif"
                                        }}
                                    >
                                        {actionLoading === user._id ? "..." : user.isActive ? "Suspend" : "Activate"}
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(user)}
                                        disabled={actionLoading === user._id}
                                        style={{
                                            padding:      "5px 10px",
                                            background:   "rgba(239,83,80,0.1)",
                                            color:        "#ef5350",
                                            border:       "none",
                                            borderRadius: "6px",
                                            fontSize:     "11px",
                                            fontWeight:   "bold",
                                            cursor:       actionLoading === user._id ? "not-allowed" : "pointer",
                                            fontFamily:   "'Inter', sans-serif"
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* Mobile row */}
                            <div className="d-md-none">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <div style={{
                                            width:          "36px", height: "36px",
                                            borderRadius:   "50%",
                                            background:     primary,
                                            display:        "flex",
                                            alignItems:     "center",
                                            justifyContent: "center",
                                            color:          accent,
                                            fontWeight:     "bold",
                                            fontSize:       "12px",
                                            flexShrink:     0
                                        }}>
                                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p style={{
                                                color:      primary,
                                                fontWeight: "bold",
                                                fontSize:   "13px",
                                                fontFamily: "'Inter', sans-serif",
                                                margin:     0
                                            }}>
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p style={{ color: "#aaa", fontSize: "11px", margin: 0 }}>
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span style={{
                                        background:   user.isActive ? "rgba(76,175,80,0.1)" : "rgba(239,83,80,0.1)",
                                        color:        user.isActive ? "#4CAF50" : "#ef5350",
                                        fontSize:     "10px",
                                        fontWeight:   "bold",
                                        padding:      "3px 10px",
                                        borderRadius: "50px"
                                    }}>
                                        {user.isActive ? "ACTIVE" : "SUSPENDED"}
                                    </span>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        onClick={() => handleToggle(user._id)}
                                        disabled={actionLoading === user._id}
                                        style={{
                                            flex:         1,
                                            padding:      "7px",
                                            background:   user.isActive ? "rgba(239,83,80,0.1)" : "rgba(76,175,80,0.1)",
                                            color:        user.isActive ? "#ef5350" : "#4CAF50",
                                            border:       "none",
                                            borderRadius: "6px",
                                            fontSize:     "12px",
                                            fontWeight:   "bold",
                                            cursor:       "pointer",
                                            fontFamily:   "'Inter', sans-serif"
                                        }}
                                    >
                                        {actionLoading === user._id ? "..." : user.isActive ? "Suspend" : "Activate"}
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(user)}
                                        style={{
                                            flex:         1,
                                            padding:      "7px",
                                            background:   "rgba(239,83,80,0.1)",
                                            color:        "#ef5350",
                                            border:       "none",
                                            borderRadius: "6px",
                                            fontSize:     "12px",
                                            fontWeight:   "bold",
                                            cursor:       "pointer",
                                            fontFamily:   "'Inter', sans-serif"
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ModalShell
                show={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                title="⚠️ Delete User"
            >
                <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.6, marginBottom: "20px" }}>
                    Are you sure you want to delete <strong style={{ color: primary }}>
                        {confirmDelete?.firstName} {confirmDelete?.lastName}
                    </strong>? This action cannot be undone.
                </p>
                <div className="d-flex gap-3">
                    <button
                        onClick={() => setConfirmDelete(null)}
                        style={{
                            flex:         1, padding: "11px",
                            background:   "#f0f0f0", color: "#555",
                            border:       "none", borderRadius: "8px",
                            fontSize:     "13px", fontWeight: "bold",
                            fontFamily:   "'Inter', sans-serif", cursor: "pointer"
                        }}
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={() => handleDelete(confirmDelete._id)}
                        disabled={actionLoading === confirmDelete?._id}
                        style={{
                            flex:         1, padding: "11px",
                            background:   actionLoading === confirmDelete?._id ? "#aaa" : "#dc3545",
                            color:        "#FFFFFF",
                            border:       "none", borderRadius: "8px",
                            fontSize:     "13px", fontWeight: "bold",
                            fontFamily:   "'Inter', sans-serif",
                            cursor:       actionLoading === confirmDelete?._id ? "not-allowed" : "pointer"
                        }}
                    >
                        {actionLoading === confirmDelete?._id ? "DELETING..." : "DELETE"}
                    </button>
                </div>
            </ModalShell>

        </Layout>
    )
}

export default AdminUsers