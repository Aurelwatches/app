import SwiftUI

struct TasksView: View {
    @State private var groups: [TaskGroup] = TaskGroup.sample

    private var completedCount: Int {
        groups.flatMap(\.tasks).filter(\.isDone).count
    }
    private var totalCount: Int {
        groups.flatMap(\.tasks).count
    }

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            List {
                ForEach($groups) { $group in
                    Section {
                        ForEach($group.tasks) { $task in
                            TaskRow(task: $task)
                                .listRowBackground(Color.appCard)
                                .swipeActions(edge: .trailing) {
                                    Button(role: .destructive) {
                                        group.tasks.removeAll { $0.id == task.id }
                                    } label: {
                                        Label("Delete", systemImage: "trash")
                                    }
                                    Button {
                                        // Reschedule for later — wired up once there's a data layer.
                                    } label: {
                                        Label("Snooze", systemImage: "clock")
                                    }
                                    .tint(.appAccent)
                                }
                        }
                    } header: {
                        Text(group.name)
                            .foregroundStyle(Color.appTextSecondary)
                    }
                }
            }
            .listStyle(.insetGrouped)
            .scrollContentBackground(.hidden)
            .listRowSeparatorTint(Color.appDivider)
            .background(Color.appBackground)
            .safeAreaInset(edge: .top) { header }

            addButton
        }
        .background(Color.appBackground.ignoresSafeArea())
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("Tasks")
                .font(.title2.weight(.medium))
                .foregroundStyle(Color.appTextPrimary)
            Text("Today \u{00B7} \(completedCount) of \(totalCount) done")
                .font(.caption)
                .foregroundStyle(Color.appTextSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 18)
        .padding(.top, 12)
        .padding(.bottom, 8)
        .background(Color.appBackground)
    }

    private var addButton: some View {
        Button {
            // Present a new-task sheet once there's a data layer to save it to.
        } label: {
            Image(systemName: "plus")
                .font(.system(size: 20, weight: .semibold))
                .foregroundStyle(Color.appBackground)
                .frame(width: 44, height: 44)
                .background(Circle().fill(Color.appAccent))
        }
        .padding(.trailing, 18)
        .padding(.bottom, 18)
        .accessibilityLabel("Add task")
    }
}

// MARK: - Model

struct GoalTask: Identifiable {
    let id = UUID()
    var title: String
    var isDone: Bool
}

struct TaskGroup: Identifiable {
    let id = UUID()
    let name: String
    var tasks: [GoalTask]

    static let sample: [TaskGroup] = [
        TaskGroup(name: "Launch business", tasks: [
            GoalTask(title: "Write project outline", isDone: false),
            GoalTask(title: "Research competitors", isDone: true),
        ]),
        TaskGroup(name: "Get fit", tasks: [
            GoalTask(title: "Morning run", isDone: true),
            GoalTask(title: "Meal prep dinner", isDone: false),
        ]),
        TaskGroup(name: "Read more", tasks: [
            GoalTask(title: "Read 20 pages", isDone: false),
        ]),
    ]
}

// MARK: - Row

private struct TaskRow: View {
    @Binding var task: GoalTask

    var body: some View {
        HStack(spacing: 12) {
            Button {
                task.isDone.toggle()
            } label: {
                ZStack {
                    Circle()
                        .strokeBorder(Color.appAccent, lineWidth: task.isDone ? 0 : 2)
                        .background(Circle().fill(task.isDone ? Color.appAccent : .clear))
                        .frame(width: 22, height: 22)
                    if task.isDone {
                        Image(systemName: "checkmark")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundStyle(Color.appBackground)
                    }
                }
            }
            .buttonStyle(.plain)
            .accessibilityLabel(task.isDone ? "Mark incomplete" : "Mark complete")

            Text(task.title)
                .font(.subheadline)
                .foregroundStyle(task.isDone ? Color.appTextTertiary : Color.appTextPrimary)
                .strikethrough(task.isDone)

            Spacer()
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    TasksView()
        .preferredColorScheme(.dark)
}
