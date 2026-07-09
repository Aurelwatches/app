import SwiftUI

@main
struct GoalsAppApp: App {
    init() {
        let tabBarAppearance = UITabBarAppearance()
        tabBarAppearance.configureWithOpaqueBackground()
        tabBarAppearance.backgroundColor = UIColor(Color.appBackground)
        UITabBar.appearance().standardAppearance = tabBarAppearance
        UITabBar.appearance().scrollEdgeAppearance = tabBarAppearance
    }

    var body: some Scene {
        WindowGroup {
            RootTabView()
                .preferredColorScheme(.dark)
                .tint(.appAccent)
        }
    }
}

struct RootTabView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Today", systemImage: "house.fill") }

            TasksView()
                .tabItem { Label("Tasks", systemImage: "checklist") }

            PlaceholderView(title: "Insights")
                .tabItem { Label("Insights", systemImage: "chart.bar.fill") }

            PlaceholderView(title: "Profile")
                .tabItem { Label("Profile", systemImage: "person.fill") }
        }
    }
}

/// Stand-in for tabs not yet built (Tasks, Insights, Profile).
private struct PlaceholderView: View {
    let title: String

    var body: some View {
        ZStack {
            Color.appBackground.ignoresSafeArea()
            Text("\(title) — coming next")
                .foregroundStyle(Color.appTextSecondary)
        }
    }
}
