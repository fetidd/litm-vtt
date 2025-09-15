import constant from "../constants"
import { Theme as LitmTheme } from "../litm/theme"

export default function Theme({ theme }: ThemeProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#fff9a6",
            border: "1px solid #e6c200",
            borderRadius: "4px",
            width: `${theme.name.length*constant.TAG_CHAR_WIDTH_MULTIPLIER}px`,
            height: "30px",
            color: "#333",
            alignContent: "center",
        }}>
            <span style={{textAlign: "center"}}>{theme.name}</span>
        </div>
    )
}

export type ThemeProps = {
    theme: LitmTheme
}
