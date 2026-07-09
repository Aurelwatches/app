import SwiftUI

struct HomeView: View {
    @State private var showingGoalCreation = false

    // Sample data for now — will be replaced by a view model backed by the API.
    private let completedTasks = 3
    private let totalTasks = 5
    private let streakDays = 12
    private let level = 7
    private let currentXP = 340
    private let xpForNextLevel = 500
    private let assistantMessage = "You're one task from tying your best streak. The outline shouldn't take long, want to knock it out now?"

    private let weekDays: [DayStatus] = [
        DayStatus(letter: "Sun", number: 5, state: .completed),
        DayStatus(letter: "Mon", number: 6, state: .completed),
        DayStatus(letter: "Tue", number: 7, state: .completed),
        DayStatus(letter: "Wed", number: 8, state: .completed),
        DayStatus(letter: "Thu", number: 9, state: .today),
        DayStatus(letter: "Fri", number: 10, state: .future),
        DayStatus(letter: "Sat", number: 11, state: .future),
    ]

    var body: some View {
        ZStack {
            Color.appBackground.ignoresSafeArea()

            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    header
                    DayStripView(days: weekDays)
                    progressRing
                    statCards
                    quickActions
                    AssistantMessageCard(text: assistantMessage, timestamp: "9:02 AM")
                }
                .padding(.horizontal, 18)
                .padding(.top, 12)
                .padding(.bottom, 24)
            }
        }
        .sheet(isPresented: $showingGoalCreation) {
            GoalCreationFlow()
        }
    }

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(Date(), style: .date)
                    .font(.caption)
                    .foregroundStyle(Color.appTextSecondary)
                Text("Good morning")
                    .font(.title2.weight(.medium))
                    .foregroundStyle(Color.appTextPrimary)
            }
            Spacer()
            LevelBadge(level: level)
        }
    }

    private var progressRing: some View {
        VStack(spacing: 10) {
            ProgressRingView(completed: completedTasks, total: totalTasks)
                .frame(width: 168, height: 168)

            Button {
                // Navigate to Tasks — wired up once tab navigation is shared state.
            } label: {
                Text("View details")
                    .font(.caption.weight(.medium))
                    .foregroundStyle(Color.appAccent)
                    .padding(.horizontal, 18)
                    .padding(.vertical, 7)
                    .overlay(
                        Capsule().stroke(Color.appAccent, lineWidth: 1)
                    )
            }
        }
        .frame(maxWidth: .infinity)
    }

    private var statCards: some View {
        HStack(spacing: 10) {
            StatCard(icon: "flame.fill", iconColor: .appWarm, label: "Streak") {
                Text("\(streakDays) days")
                    .font(.system(.title3, design: .rounded).weight(.medium))
                    .foregroundStyle(Color.appTextPrimary)
            }

            StatCard(icon: "star.fill", iconColor: .appAccent, label: "Next level") {
                VStack(alignment: .leading, spacing: 6) {
                    ProgressBar(progress: Double(currentXP) / Double(xpForNextLevel))
                        .frame(height: 6)
                    Text("\(currentXP)/\(xpForNextLevel) xp")
                        .font(.caption2)
                        .foregroundStyle(Color.appTextSecondary)
                }
            }
        }
    }

    private var quickActions: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Quick actions")
                .font(.caption)
                .foregroundStyle(Color.appTextSecondary)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 4), spacing: 8) {
                QuickActionTile(icon: "target", label: "Goals") {
                    showingGoalCreation = true
                }
                QuickActionTile(icon: "clock.arrow.circlepath", label: "History") {}
                QuickActionTile(icon: "chart.bar.fill", label: "Insights") {}
                QuickActionTile(icon: "gearshape.fill", label: "Settings") {}
            }
        }
    }
}

// MARK: - Day strip

private struct DayStatus: Identifiable {
    let id = UUID()
    let letter: String
    let number: Int
    let state: State

    enum State { case completed, today, future }
}

private struct DayStripView: View {
    let days: [DayStatus]

    var body: some View {
        HStack {
            ForEach(days) { day in
                VStack(spacing: 4) {
                    Text(day.letter)
                        .font(.caption2)
                        .foregroundStyle(textColor(for: day.state))
                    Text("\(day.number)")
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(numberColor(for: day.state))
                    Circle()
                        .fill(day.state == .completed ? Color.appAccent : .clear)
                        .frame(width: 4, height: 4)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(day.state == .today ? Color.appAccent : .clear)
                )
            }
        }
    }

    private func textColor(for state: DayStatus.State) -> Color {
        switch state {
        case .today: return .appAccentFill
        case .completed: return .appTextTertiary
        case .future: return .appTextDisabled
        }
    }

    private func numberColor(for state: DayStatus.State) -> Color {
        switch state {
        case .today: return .appAccentFill
        case .completed: return .appTextPrimary
        case .future: return .appTextDisabled
        }
    }
}

// MARK: - Progress ring

private struct ProgressRingView: View {
    let completed: Int
    let total: Int

    private var progress: Double {
        total == 0 ? 0 : Double(completed) / Double(total)
    }

    var body: some View {
        ZStack {
            Circle()
                .stroke(Color.appDivider, lineWidth: 16)

            Circle()
                .trim(from: 0, to: progress)
                .stroke(Color.appAccent, style: StrokeStyle(lineWidth: 16, lineCap: .round))
                .rotationEffect(.degrees(-90))

            VStack(spacing: 2) {
                Text("\(completed)/\(total)")
                    .font(.system(size: 30, weight: .semibold, design: .rounded))
                    .monospacedDigit()
                    .foregroundStyle(Color.appTextPrimary)
                Text("tasks today")
                    .font(.caption)
                    .foregroundStyle(Color.appTextSecondary)
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(Int(progress * 100)) percent of today's tasks complete, \(completed) of \(total)")
    }
}

// MARK: - Shared building blocks

private struct LevelBadge: View {
    let level: Int

    var body: some View {
        Text("Lvl \(level)")
            .font(.caption.weight(.medium))
            .foregroundStyle(Color.appAccentOnFill)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(Capsule().fill(Color.appAccentFill))
    }
}

private struct StatCard<Content: View>: View {
    let icon: String
    let iconColor: Color
    let label: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 14))
                    .foregroundStyle(iconColor)
                Text(label)
                    .font(.caption)
                    .foregroundStyle(Color.appTextSecondary)
            }
            content
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(RoundedRectangle(cornerRadius: 12).fill(Color.appCard))
    }
}

private struct ProgressBar: View {
    let progress: Double

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                Capsule().fill(Color.appDivider)
                Capsule()
                    .fill(Color.appAccent)
                    .frame(width: geometry.size.width * min(max(progress, 0), 1))
            }
        }
    }
}

private struct QuickActionTile: View {
    let icon: String
    let label: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 18))
                    .foregroundStyle(Color.appAccent)
                Text(label)
                    .font(.caption2)
                    .foregroundStyle(Color.appTextPrimary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .background(RoundedRectangle(cornerRadius: 12).fill(Color.appCard))
        }
        .buttonStyle(.plain)
    }
}

private struct AssistantMessageCard: View {
    let text: String
    let timestamp: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 6) {
                Image(systemName: "bubble.left.fill")
                    .font(.system(size: 12))
                    .foregroundStyle(Color.appAccent)
                Text(timestamp)
                    .font(.caption2)
                    .foregroundStyle(Color.appTextSecondary)
            }
            Text(text)
                .font(.subheadline)
                .foregroundStyle(Color(hex: 0xE4E4E7))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(RoundedRectangle(cornerRadius: 12).fill(Color.appCard))
    }
}

#Preview {
    HomeView()
        .preferredColorScheme(.dark)
}
