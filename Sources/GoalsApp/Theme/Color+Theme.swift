import SwiftUI

extension Color {
    // Backgrounds
    static let appBackground = Color(hex: 0x0B0B0D)
    static let appCard = Color(hex: 0x18181B)
    static let appDivider = Color(hex: 0x2C2C2E)
    static let appLockedFill = Color(hex: 0x1C1C1F)

    // Accent (amber)
    static let appAccent = Color(hex: 0xEF9F27)
    static let appAccentFill = Color(hex: 0x633806)
    static let appAccentOnFill = Color(hex: 0xFAC775)

    // Text
    static let appTextPrimary = Color.white
    static let appTextSecondary = Color(hex: 0x9C9CA3)
    static let appTextTertiary = Color(hex: 0x8E8E93)
    static let appTextDisabled = Color(hex: 0x5A5A5E)

    // Semantic accents used sparingly (e.g. streak flame)
    static let appWarm = Color(hex: 0xF0997B)
}

extension Color {
    init(hex: UInt32) {
        let r = Double((hex >> 16) & 0xFF) / 255
        let g = Double((hex >> 8) & 0xFF) / 255
        let b = Double(hex & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}
