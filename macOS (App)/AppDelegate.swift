//
//  AppDelegate.swift
//  macOS (App)
//
//  Created by zzh on 2026/8/18.
//

import Cocoa

@main
class AppDelegate: NSObject, NSApplicationDelegate {

    func applicationDidFinishLaunching(_ notification: Notification) {
        localizeMenu()
    }

    // Simplified Chinese on any Chinese-language system (zh-Hans or zh-Hant),
    // English everywhere else — matching the rest of the app's UI.
    private func localizeMenu() {
        let isChinese = Locale.preferredLanguages.first?.lowercased().hasPrefix("zh") ?? false
        guard isChinese, let mainMenu = NSApp.mainMenu else { return }

        let translations = [
            "About SafaQrcode": "关于 SafaQrcode",
            "Hide SafaQrcode": "隐藏 SafaQrcode",
            "Hide Others": "隐藏其他",
            "Show All": "全部显示",
            "Quit SafaQrcode": "退出 SafaQrcode",
            "Help": "帮助",
            "SafaQrcode Help": "SafaQrcode 帮助"
        ]

        for menu in mainMenu.items.compactMap({ $0.submenu }) {
            for item in menu.items {
                if let translated = translations[item.title] {
                    item.title = translated
                }
            }
        }
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

}
