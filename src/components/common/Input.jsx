const Input = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
    disabled = false,
    required = false,
    error = ""
}) => {

    return (
        <div className="mb-3 w-100">

            {label && (
                <label
                    htmlFor={name}
                    className="form-label fw-semibold"
                    style={{
                        color: "#1B4332",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px"
                    }}
                >
                    {label} {required && <span style={{ color: "#dc3545" }}>*</span>}
                </label>
            )}


            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`form-control ${error ? "is-invalid" : ""}`}
                style={{
                    borderRadius: "8px",
                    border: `1.5px solid ${error ? "#dc3545" : "#d0d0d0"}`,
                    padding: "10px 14px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    color: "#1A1A1A",
                    background: disabled ? "#f5f5f5" : "#ffffff",
                    outline: "none",
                    transition: "border 0.2s"
                }}
                onFocus={e => e.target.style.border = "1.5px solid #1B4332"}
                onBlur={e => e.target.style.border = `1.5px solid ${error ? "#dc3545" : "#d0d0d0"}`}
            />

        
            {error && (
                <div style={{
                    color: "#dc3545",
                    fontSize: "12px",
                    marginTop: "4px",
                    fontFamily: "'Inter', sans-serif"
                }}>
                    {error}
                </div>
            )}

        </div>
    )
}

export default Input