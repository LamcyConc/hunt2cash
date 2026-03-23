import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as yup from "yup"
import Cookies from "universal-cookie"
import Layout from "../../components/common/Layout"
import ModalShell from "../../components/common/ModalShell"
import FieldLabel from "../../components/common/FieldLabel"
import InputStyle from "../../components/common/InputStyle"
import Toast from "../../components/common/Toast"
import { myProfile, setPin, changePin, resetPin, changeUserPassword, deleteUserAccount } from "../../services/api"

const primary = "#0F3D2E"
const accent = "#E6A800"
const accentBright = "#F4B400"

const SectionCard = ({ title, icon, expanded, onToggle, children }) => (
    <div style={{
        background: "#FFFFFF",
        border: "1px solid #e8ede9",
        borderRadius: "16px",
        marginBottom: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(15,61,46,0.04)"
    }}>
        <div
            onClick={onToggle}
            className="d-flex justify-content-between align-items-center"
            style={{ padding: "18px 24px", cursor: "pointer" }}
            onMouseOver={e => e.currentTarget.style.background = "#fafafa"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}
        >
            <div className="d-flex align-items-center gap-3">
                <span style={{ fontSize: "20px" }}>{icon}</span>
                <span style={{
                    color: primary,
                    fontWeight: "bold",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "15px"
                }}>
                    {title}
                </span>
            </div>
            <span style={{
                color: "#aaa",
                fontSize: "18px",
                transition: "transform 0.2s",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)"
            }}>
                ▾
            </span>
        </div>

        {expanded && (
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid #f0f0f0" }}>
                <div style={{ paddingTop: "20px" }}>
                    {children}
                </div>
            </div>
        )}
    </div>
)

const ActionBtn = ({ isSubmitting, label, loadingLabel, danger = false }) => (
    <button
        type="submit"
        disabled={isSubmitting}
        style={{
            padding: "11px 28px",
            background: isSubmitting ? "#aaa" : danger ? "#dc3545" : accent,
            color: danger ? "#FFFFFF" : primary,
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "bold",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "1px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            transition: "background 0.2s"
        }}
        onMouseOver={e => {
            if (!isSubmitting) e.currentTarget.style.background = danger ? "#c62828" : accentBright
        }}
        onMouseOut={e => {
            if (!isSubmitting) e.currentTarget.style.background = danger ? "#dc3545" : accent
        }}
    >
        {isSubmitting ? loadingLabel : label}
    </button>
)

const PinInput = ({ name, placeholder, formik }) => (
    <input
        type="password"
        name={name}
        placeholder={placeholder}
        maxLength={4}
        onChange={formik.handleChange}
        value={formik.values[name]}
        style={InputStyle(formik.touched[name] && formik.errors[name])}
        onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
        onBlur={e => {
            formik.handleBlur(e)
            e.target.style.border = `1.5px solid ${formik.errors[name] ? "#dc3545" : "#ddd"}`
        }}
    />
)

const Settings = () => {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const user = cookies.get("user")
    const token  = cookies.get("token")
    const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null

    const [pinExists, setPinExists] = useState(false)
    const [expanded, setExpanded] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [toast, setToast] = useState({ show: false, type: "success", message: "" })

    const showToast = (type, message) => setToast({ show: true, type, message })
    const hideToast = () => setToast(t => ({ ...t, show: false }))

    const toggle = (section) => setExpanded(expanded === section ? null : section)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await myProfile()
                setPinExists(res.data?.hasPin || false)
            } catch (error) {
                console.log(error)
            }
        }
        fetchProfile()
    }, [])

    const setPinFormik = useFormik({
        initialValues: { pin: "", confirmPin: "" },

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await setPin({ pin: values.pin })
                showToast("success", "PIN set successfully! 🎉")
                setPinExists(true)
                resetForm()
            } catch (error) {
                showToast("error", error.response?.data?.message || "Failed to set PIN")
            } finally {
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            pin: yup.string()
                .required("PIN is required")
                .length(4, "PIN must be exactly 4 digits")
                .matches(/^\d{4}$/, "PIN must be digits only"),
            confirmPin: yup.string()
                .required("Please confirm your PIN")
                .oneOf([yup.ref("pin")], "PINs do not match")
        })
    })

    const changePinFormik = useFormik({
        initialValues: { currentPin: "", newPin: "", confirmNewPin: "" },

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await changePin({
                    currentPin: values.currentPin,
                    newPin: values.newPin
                })
                showToast("success", "PIN changed successfully! 🎉")
                resetForm()
            } catch (error) {
                showToast("error", error.response?.data?.message || "Failed to change PIN")
            } finally {
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            currentPin: yup.string()
                .required("Current PIN is required")
                .length(4, "PIN must be 4 digits"),
            newPin: yup.string()
                .required("New PIN is required")
                .length(4, "PIN must be 4 digits")
                .matches(/^\d{4}$/, "PIN must be digits only"),
            confirmNewPin: yup.string()
                .required("Please confirm new PIN")
                .oneOf([yup.ref("newPin")], "PINs do not match")
        })
    })

    const resetPinFormik = useFormik({
        initialValues: { password: "", newPin: "", confirmNewPin: "" },

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await resetPin({
                    password: values.password,
                    newPin: values.newPin
                })
                showToast("success", "PIN reset successfully! 🎉")
                setPinExists(true)
                resetForm()
            } catch (error) {
                showToast("error", error.response?.data?.message || "Failed to reset PIN")
            } finally {
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            password: yup.string()
                .required("Account password is required"),
            newPin: yup.string()
                .required("New PIN is required")
                .length(4, "PIN must be 4 digits")
                .matches(/^\d{4}$/, "PIN must be digits only"),
            confirmNewPin: yup.string()
                .required("Please confirm new PIN")
                .oneOf([yup.ref("newPin")], "PINs do not match")
        })
    })

    const deleteFormik = useFormik({
        initialValues: { password: "" },

        onSubmit: async (values, { setSubmitting }) => {
            try {
                await deleteUserAccount(user?._id || userId)
                cookies.remove("token", { path: "/" })
                cookies.remove("user", { path: "/" })
                window.location.href = "/login"
            } catch (error) {
                showToast("error", error.response?.data?.message || "Failed to delete account")
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            password: yup.string().required("Password is required to confirm deletion")
        })
    })

    const changePasswordFormik = useFormik({
        initialValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" },

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await changeUserPassword({
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword
                })
                showToast("success", "Password changed successfully! 🎉")
                resetForm()
            } catch (error) {
                showToast("error", error.response?.data?.message || "Failed to change password")
            } finally {
                setSubmitting(false)
            }
        },

        validationSchema: yup.object({
            oldPassword: yup.string()
                .required("Current password is required"),
            newPassword: yup.string()
                .required("New password is required")
                .min(6, "Password must be at least 6 characters"),
            confirmNewPassword: yup.string()
                .required("Please confirm your new password")
                .oneOf([yup.ref("newPassword")], "Passwords do not match")
        })
    });




    return (
        <Layout pageTitle="Settings">

            <div className="mb-4">
                <h5 style={{
                    color: primary,
                    fontWeight: "bold",
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: 4
                }}>
                    Settings
                </h5>
                <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
                    Manage your account preferences and security.
                </p>
            </div>

            <div
                onClick={() => navigate("/profile")}
                className="d-flex align-items-center justify-content-between"
                style={{
                    background: "#FFFFFF",
                    border: "1px solid #e8ede9",
                    borderRadius: "16px",
                    padding: "18px 24px",
                    marginBottom: "16px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(15,61,46,0.04)",
                    transition: "all 0.2s"
                }}
                onMouseOver={e => {
                    e.currentTarget.style.borderColor = primary
                    e.currentTarget.style.background = "#fafafa"
                }}
                onMouseOut={e => {
                    e.currentTarget.style.borderColor = "#e8ede9"
                    e.currentTarget.style.background = "#FFFFFF"
                }}
            >
                <div className="d-flex align-items-center gap-3">
                    <span style={{ fontSize: "20px" }}>👤</span>
                    <div>
                        <p style={{
                            color: primary,
                            fontWeight: "bold",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "15px",
                            margin: "0 0 2px"
                        }}>
                            View Profile
                        </p>
                        <p style={{ color: "#aaa", fontSize: "12px", margin: 0 }}>
                            {user?.firstName} {user?.lastName} · {user?.email}
                        </p>
                    </div>
                </div>
                <span style={{ color: "#aaa", fontSize: "18px" }}>›</span>
            </div>

            {!pinExists && (
                <SectionCard
                    title="Set PIN"
                    icon="🔐"
                    expanded={expanded === "setPin"}
                    onToggle={() => toggle("setPin")}
                >
                    <form onSubmit={setPinFormik.handleSubmit}>
                        <div className="mb-3">
                            <FieldLabel text="NEW PIN" />
                            <PinInput name="pin" placeholder="Enter 4-digit PIN" formik={setPinFormik} />
                            {setPinFormik.touched.pin && setPinFormik.errors.pin && (
                                <small className="text-danger">{setPinFormik.errors.pin}</small>
                            )}
                        </div>
                        <div className="mb-4">
                            <FieldLabel text="CONFIRM PIN" />
                            <PinInput name="confirmPin" placeholder="Repeat PIN" formik={setPinFormik} />
                            {setPinFormik.touched.confirmPin && setPinFormik.errors.confirmPin && (
                                <small className="text-danger">{setPinFormik.errors.confirmPin}</small>
                            )}
                        </div>
                        <ActionBtn
                            isSubmitting={setPinFormik.isSubmitting}
                            label="SET PIN"
                            loadingLabel="SETTING..."
                        />
                    </form>
                </SectionCard>
            )}

            {pinExists && (
                <SectionCard
                    title="Change PIN"
                    icon="🔄"
                    expanded={expanded === "changePin"}
                    onToggle={() => toggle("changePin")}
                >
                    <form onSubmit={changePinFormik.handleSubmit}>
                        <div className="mb-3">
                            <FieldLabel text="CURRENT PIN" />
                            <PinInput name="currentPin" placeholder="Enter current PIN" formik={changePinFormik} />
                            {changePinFormik.touched.currentPin && changePinFormik.errors.currentPin && (
                                <small className="text-danger">{changePinFormik.errors.currentPin}</small>
                            )}
                        </div>
                        <div className="mb-3">
                            <FieldLabel text="NEW PIN" />
                            <PinInput name="newPin" placeholder="Enter new PIN" formik={changePinFormik} />
                            {changePinFormik.touched.newPin && changePinFormik.errors.newPin && (
                                <small className="text-danger">{changePinFormik.errors.newPin}</small>
                            )}
                        </div>
                        <div className="mb-4">
                            <FieldLabel text="CONFIRM NEW PIN" />
                            <PinInput name="confirmNewPin" placeholder="Repeat new PIN" formik={changePinFormik} />
                            {changePinFormik.touched.confirmNewPin && changePinFormik.errors.confirmNewPin && (
                                <small className="text-danger">{changePinFormik.errors.confirmNewPin}</small>
                            )}
                        </div>
                        <ActionBtn
                            isSubmitting={changePinFormik.isSubmitting}
                            label="CHANGE PIN"
                            loadingLabel="CHANGING..."
                        />
                    </form>
                </SectionCard>
            )}

            <SectionCard
                title="Reset PIN"
                icon="🔁"
                expanded={expanded === "resetPin"}
                onToggle={() => toggle("resetPin")}
            >
                <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.6, marginBottom: "16px" }}>
                    Forgot your PIN? Reset it using your account password.
                </p>

                <form onSubmit={resetPinFormik.handleSubmit}>
                    <div className="mb-3">
                        <FieldLabel text="ACCOUNT PASSWORD" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your account password"
                            onChange={resetPinFormik.handleChange}
                            value={resetPinFormik.values.password}
                            style={InputStyle(resetPinFormik.touched.password && resetPinFormik.errors.password)}
                            onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                            onBlur={e => {
                                resetPinFormik.handleBlur(e)
                                e.target.style.border = `1.5px solid ${resetPinFormik.errors.password ? "#dc3545" : "#ddd"}`
                            }}
                        />
                        {resetPinFormik.touched.password && resetPinFormik.errors.password && (
                            <small className="text-danger">{resetPinFormik.errors.password}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <FieldLabel text="NEW PIN" />
                        <PinInput name="newPin" placeholder="Enter new PIN" formik={resetPinFormik} />
                        {resetPinFormik.touched.newPin && resetPinFormik.errors.newPin && (
                            <small className="text-danger">{resetPinFormik.errors.newPin}</small>
                        )}
                    </div>
                    <div className="mb-4">
                        <FieldLabel text="CONFIRM NEW PIN" />
                        <PinInput name="confirmNewPin" placeholder="Repeat new PIN" formik={resetPinFormik} />
                        {resetPinFormik.touched.confirmNewPin && resetPinFormik.errors.confirmNewPin && (
                            <small className="text-danger">{resetPinFormik.errors.confirmNewPin}</small>
                        )}
                    </div>
                    <ActionBtn
                        isSubmitting={resetPinFormik.isSubmitting}
                        label="RESET PIN"
                        loadingLabel="RESETTING..."
                    />
                </form>
            </SectionCard>

            <SectionCard
                title="Change Password"
                icon="🔑"
                expanded={expanded === "changePassword"}
                onToggle={() => toggle("changePassword")}
            >
                <form onSubmit={changePasswordFormik.handleSubmit}>
                    <div className="mb-3">
                        <FieldLabel text="CURRENT PASSWORD" />
                        <input
                            type="password"
                            name="oldPassword"
                            placeholder="Enter current password"
                            onChange={changePasswordFormik.handleChange}
                            value={changePasswordFormik.values.oldPassword}
                            style={InputStyle(changePasswordFormik.touched.oldPassword && changePasswordFormik.errors.oldPassword)}
                            onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                            onBlur={e => {
                                changePasswordFormik.handleBlur(e)
                                e.target.style.border = `1.5px solid ${changePasswordFormik.errors.oldPassword ? "#dc3545" : "#ddd"}`
                            }}
                        />
                        {changePasswordFormik.touched.oldPassword && changePasswordFormik.errors.oldPassword && (
                            <small className="text-danger">{changePasswordFormik.errors.oldPassword}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <FieldLabel text="NEW PASSWORD" />
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            onChange={changePasswordFormik.handleChange}
                            value={changePasswordFormik.values.newPassword}
                            style={InputStyle(changePasswordFormik.touched.newPassword && changePasswordFormik.errors.newPassword)}
                            onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                            onBlur={e => {
                                changePasswordFormik.handleBlur(e)
                                e.target.style.border = `1.5px solid ${changePasswordFormik.errors.newPassword ? "#dc3545" : "#ddd"}`
                            }}
                        />
                        {changePasswordFormik.touched.newPassword && changePasswordFormik.errors.newPassword && (
                            <small className="text-danger">{changePasswordFormik.errors.newPassword}</small>
                        )}
                    </div>
                    <div className="mb-4">
                        <FieldLabel text="CONFIRM NEW PASSWORD" />
                        <input
                            type="password"
                            name="confirmNewPassword"
                            placeholder="Repeat new password"
                            onChange={changePasswordFormik.handleChange}
                            value={changePasswordFormik.values.confirmNewPassword}
                            style={InputStyle(changePasswordFormik.touched.confirmNewPassword && changePasswordFormik.errors.confirmNewPassword)}
                            onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                            onBlur={e => {
                                changePasswordFormik.handleBlur(e)
                                e.target.style.border = `1.5px solid ${changePasswordFormik.errors.confirmNewPassword ? "#dc3545" : "#ddd"}`
                            }}
                        />
                        {changePasswordFormik.touched.confirmNewPassword && changePasswordFormik.errors.confirmNewPassword && (
                            <small className="text-danger">{changePasswordFormik.errors.confirmNewPassword}</small>
                        )}
                    </div>
                    <ActionBtn
                        isSubmitting={changePasswordFormik.isSubmitting}
                        label="CHANGE PASSWORD"
                        loadingLabel="CHANGING..."
                    />
                </form>
            </SectionCard>

            <SectionCard
                title="Delete Account"
                icon="⚠️"
                expanded={expanded === "delete"}
                onToggle={() => toggle("delete")}
            >
                <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.6, marginBottom: "20px" }}>
                    Deleting your account is permanent and cannot be undone.
                    All your data, balance and transaction history will be lost.
                </p>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    style={{
                        padding: "11px 28px",
                        background: "#dc3545",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: "1px",
                        cursor: "pointer",
                        transition: "opacity 0.2s"
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseOut={e => e.currentTarget.style.opacity = "1"}
                >
                    Delete My Account
                </button>
            </SectionCard>

            <ModalShell
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="⚠️ Delete Account"
            >
                <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.6, marginBottom: "20px" }}>
                    This action is <strong>permanent</strong>. Enter your password to confirm.
                </p>

                <form onSubmit={deleteFormik.handleSubmit}>
                    <div className="mb-4">
                        <FieldLabel text="CONFIRM PASSWORD" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            onChange={deleteFormik.handleChange}
                            value={deleteFormik.values.password}
                            style={InputStyle(deleteFormik.touched.password && deleteFormik.errors.password)}
                            onFocus={e => e.target.style.border = `1.5px solid ${primary}`}
                            onBlur={e => {
                                deleteFormik.handleBlur(e)
                                e.target.style.border = `1.5px solid ${deleteFormik.errors.password ? "#dc3545" : "#ddd"}`
                            }}
                        />
                        {deleteFormik.touched.password && deleteFormik.errors.password && (
                            <small className="text-danger">{deleteFormik.errors.password}</small>
                        )}
                    </div>

                    <div className="d-flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(false)}
                            style={{
                                flex: 1,
                                padding: "11px",
                                background: "#f0f0f0",
                                color: "#555",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "bold",
                                fontFamily: "'Inter', sans-serif",
                                cursor: "pointer"
                            }}
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={deleteFormik.isSubmitting}
                            style={{
                                flex: 1,
                                padding: "11px",
                                background: deleteFormik.isSubmitting ? "#aaa" : "#dc3545",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "bold",
                                fontFamily: "'Inter', sans-serif",
                                cursor: deleteFormik.isSubmitting ? "not-allowed" : "pointer"
                            }}
                        >
                            {deleteFormik.isSubmitting ? "DELETING..." : "DELETE"}
                        </button>
                    </div>
                </form>
            </ModalShell>

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={hideToast}
            />

        </Layout>
    )
}

export default Settings;