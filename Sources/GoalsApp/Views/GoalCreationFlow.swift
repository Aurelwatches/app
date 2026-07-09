import SwiftUI

struct GoalCreationFlow: View {
    @Environment(\.dismiss) private var dismiss

    @State private var step = 0
    @State private var name = ""
    @State private var icon = "target"
    @State private var why = ""
    @State private var frequency = Frequency.daily

    enum Frequency: String, CaseIterable, Identifiable {
        case daily = "Daily"
        case fewTimesAWeek = "Few times a week"
        case weekly = "Weekly"
        var id: String { rawValue }
    }

    var body: some View {
        VStack(spacing: 0) {
            StepHeader(step: step, totalSteps: 3, onBack: back)

            Group {
                switch step {
                case 0:
                    NameStep(name: $name, icon: $icon)
                case 1:
                    WhyStep(name: name, icon: icon, why: $why)
                default:
                    ReviewStep(name: name, icon: icon, why: why, frequency: $frequency)
                }
            }
            .padding(.horizontal, 18)
            .frame(maxHeight: .infinity)

            Button(action: primaryAction) {
                Text(step == 2 ? "Create goal" : "Continue")
                    .font(.system(.body, design: .rounded).weight(.medium))
                    .foregroundStyle(Color.appBackground)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(RoundedRectangle(cornerRadius: 14).fill(Color.appAccent))
            }
            .disabled(!canContinue)
            .opacity(canContinue ? 1 : 0.5)
            .padding(.horizontal, 18)
            .padding(.bottom, 18)
        }
        .background(Color.appBackground.ignoresSafeArea())
    }

    private var canContinue: Bool {
        switch step {
        case 0: return !name.trimmingCharacters(in: .whitespaces).isEmpty
        case 1: return !why.trimmingCharacters(in: .whitespaces).isEmpty
        default: return true
        }
    }

    private func back() {
        if step == 0 {
            dismiss()
        } else {
            step -= 1
        }
    }

    private func primaryAction() {
        if step < 2 {
            step += 1
        } else {
            // Save the goal — wired up once there's a data layer.
            dismiss()
        }
    }
}

// MARK: - Header

private struct StepHeader: View {
    let step: Int
    let totalSteps: Int
    let onBack: () -> Void

    var body: some View {
        HStack {
            Button(action: onBack) {
                Image(systemName: "chevron.left")
                    .foregroundStyle(Color.appTextTertiary)
            }
            Spacer()
            HStack(spacing: 6) {
                ForEach(0..<totalSteps, id: \.self) { index in
                    Circle()
                        .fill(index == step ? Color.appAccent : Color.appLockedFill)
                        .frame(width: 6, height: 6)
                }
            }
            Spacer()
            Color.clear.frame(width: 20)
        }
        .padding(.horizontal, 18)
        .padding(.top, 16)
        .padding(.bottom, 12)
    }
}

// MARK: - Step 1: name + icon

private struct NameStep: View {
    @Binding var name: String
    @Binding var icon: String

    private let icons = [
        "target", "book.fill", "figure.run", "dollarsign.circle.fill",
        "heart.fill", "brain.head.profile", "paintbrush.fill", "house.fill",
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            VStack(alignment: .leading, spacing: 8) {
                Text("What's your goal?")
                    .font(.title2.weight(.medium))
                    .foregroundStyle(Color.appTextPrimary)

                TextField(
                    "",
                    text: $name,
                    prompt: Text("e.g. Launch business").foregroundStyle(Color.appTextDisabled)
                )
                .font(.subheadline)
                .foregroundStyle(Color.appTextPrimary)
                .padding(14)
                .background(RoundedRectangle(cornerRadius: 12).fill(Color.appCard))
            }

            VStack(alignment: .leading, spacing: 10) {
                Text("Pick an icon")
                    .font(.caption)
                    .foregroundStyle(Color.appTextSecondary)

                LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 10), count: 4), spacing: 10) {
                    ForEach(icons, id: \.self) { symbol in
                        Button {
                            icon = symbol
                        } label: {
                            Image(systemName: symbol)
                                .font(.system(size: 18))
                                .foregroundStyle(icon == symbol ? Color.appBackground : Color.appAccent)
                                .frame(width: 48, height: 48)
                                .background(Circle().fill(icon == symbol ? Color.appAccent : Color.appCard))
                        }
                        .accessibilityLabel(symbol)
                    }
                }
            }

            Spacer()
        }
        .padding(.top, 8)
    }
}

// MARK: - Step 2: why

private struct WhyStep: View {
    let name: String
    let icon: String
    @Binding var why: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 14))
                    .foregroundStyle(Color.appAccent)
                Text(name)
                    .font(.caption)
                    .foregroundStyle(Color(hex: 0xE4E4E7))
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(Capsule().fill(Color.appCard))
            .padding(.top, 8)

            Text("Why does this matter to you?")
                .font(.title2.weight(.medium))
                .foregroundStyle(Color.appTextPrimary)
                .padding(.top, 8)

            Text("Your coach will remind you of this when motivation dips.")
                .font(.caption)
                .foregroundStyle(Color.appTextSecondary)

            ZStack(alignment: .topLeading) {
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.appCard)
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.appDivider, lineWidth: 1))

                if why.isEmpty {
                    Text("I want to finally build something of my own instead of just talking about it...")
                        .font(.subheadline)
                        .foregroundStyle(Color.appTextDisabled)
                        .padding(14)
                        .allowsHitTesting(false)
                }

                TextEditor(text: $why)
                    .font(.subheadline)
                    .foregroundStyle(Color.appTextPrimary)
                    .scrollContentBackground(.hidden)
                    .padding(8)
            }
            .frame(maxHeight: .infinity)
        }
        .padding(.top, 8)
    }
}

// MARK: - Step 3: frequency + review

private struct ReviewStep: View {
    let name: String
    let icon: String
    let why: String
    @Binding var frequency: GoalCreationFlow.Frequency

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Almost done")
                .font(.title2.weight(.medium))
                .foregroundStyle(Color.appTextPrimary)
                .padding(.top, 8)

            VStack(alignment: .leading, spacing: 10) {
                Text("How often?")
                    .font(.caption)
                    .foregroundStyle(Color.appTextSecondary)

                HStack(spacing: 8) {
                    ForEach(GoalCreationFlow.Frequency.allCases) { option in
                        Button {
                            frequency = option
                        } label: {
                            Text(option.rawValue)
                                .font(.caption.weight(.medium))
                                .foregroundStyle(frequency == option ? Color.appBackground : Color.appTextSecondary)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 8)
                                .background(Capsule().fill(frequency == option ? Color.appAccent : Color.appCard))
                        }
                    }
                }
            }

            VStack(alignment: .leading, spacing: 10) {
                HStack(spacing: 8) {
                    Image(systemName: icon)
                        .foregroundStyle(Color.appAccent)
                    Text(name)
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(Color.appTextPrimary)
                }
                Text(why)
                    .font(.footnote)
                    .foregroundStyle(Color.appTextSecondary)
                    .lineLimit(3)
            }
            .padding(14)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(RoundedRectangle(cornerRadius: 12).fill(Color.appCard))

            Spacer()
        }
        .padding(.top, 8)
    }
}

#Preview {
    GoalCreationFlow()
        .preferredColorScheme(.dark)
}
