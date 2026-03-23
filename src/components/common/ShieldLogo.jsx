const primary = "#0F3D2E"
const accent  = "#E6A800"

const ShieldLogo = ({
    size        = 36,
    bgColor     = primary,
    letterColor = "#FFFFFF",
    accentColor = accent,
}) => (
    <svg
        width={size}
        height={size * 1.15}
        viewBox="0 0 80 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M40 4L8 16V44C8 62 22 78 40 88C58 78 72 62 72 44V16L40 4Z"
            fill={bgColor}
            stroke={accentColor}
            strokeWidth="3"
        />
        <path
            d="M40 12L16 22V44C16 59 28 72 40 80C52 72 64 59 64 44V22L40 12Z"
            fill="none"
            stroke={`${accentColor}40`}
            strokeWidth="1.5"
        />
        <text
            x="40"
            y="57"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontWeight="700"
            fontSize="34"
            fill={letterColor}
        >
            H
        </text>
        <line
            x1="28" y1="68" x2="52" y2="68"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
)

export default ShieldLogo;