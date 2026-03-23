const Button = ({ label, onClick, type = "button", variant = "primary", disabled = false, fullWidth = false }) => {

    const styles = {
        primary: {
            background: "#1B4332",
            color: "#F5A623",
            border: "none",
        },
        secondary: {
            background: "transparent",
            color: "#1B4332",
            border: "2px solid #1B4332",
        },
        gold: {
            background: "#F5A623",
            color: "#1B4332",
            border: "none",
        },
        danger: {
            background: "transparent",
            color: "#dc3545",
            border: "2px solid #dc3545",
        }
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn ${fullWidth ? "w-100" : ""} px-4 py-2 fw-semibold`}
            style={{
                ...styles[variant],
                borderRadius: "8px",
                fontFamily: "'Inter', sans-serif",
                opacity: disabled ? 0.6 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.2s"
            }}
        >
            {label}
        </button>
    )
}

export default Button


