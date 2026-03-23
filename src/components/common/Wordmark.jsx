const primary = "#0F3D2E"
const accent  = "#E6A800"

const Wordmark = ({ size = 20, lightMode = false }) => (
    <span style={{
        fontSize:    size,
        fontWeight:  "bold",
        letterSpacing: "2px",
        fontFamily:  "'Inter', sans-serif"
    }}>
        <span style={{ color: lightMode ? "#FFFFFF" : primary }}>HUNT2</span>
        <span style={{ color: accent }}>CASH</span>
    </span>
)

export default Wordmark