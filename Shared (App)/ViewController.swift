//
//  ViewController.swift
//  Shared (App)
//
//  Created by zzh on 2026/8/18.
//

import WebKit

#if os(iOS)
import UIKit
typealias PlatformViewController = UIViewController
#elseif os(macOS)
import Cocoa
import SafariServices
typealias PlatformViewController = NSViewController
#endif

let extensionBundleIdentifier = "com.zhihaofans.safaqrcode.safari-extension"

class ViewController: PlatformViewController, WKNavigationDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        self.webView.navigationDelegate = self

        self.webView.configuration.userContentController.add(self, name: "controller")

        self.webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
    }

#if os(macOS)
    override func viewDidAppear() {
        super.viewDidAppear()

        // Keep the window title in sync with the app display name, so Debug
        // builds ("SafaQrcode(测试)") are easy to tell apart from the installed
        // Release build ("SafaQrcode").
        if let displayName = Bundle.main.object(forInfoDictionaryKey: "CFBundleDisplayName") as? String {
            self.view.window?.title = displayName
        }
    }
#endif

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
#if os(iOS)
        webView.evaluateJavaScript("show('ios')")
#elseif os(macOS)
        webView.evaluateJavaScript("show('mac')")

        // Inject the real app icon into the page, so the page always matches
        // whatever icon the app bundle carries (no manual sync needed).
        // Load the .icns directly and use its largest representation to avoid
        // the washed-out upscaling NSWorkspace would produce.
        if let iconPath = Bundle.main.path(forResource: "AppIcon", ofType: "icns"),
           let icon = NSImage(contentsOfFile: iconPath),
           let largestRep = icon.representations.max(by: { $0.pixelsWide < $1.pixelsWide }) as? NSBitmapImageRep,
           let png = largestRep.representation(using: .png, properties: [:]) {
            let dataUrl = "data:image/png;base64,\(png.base64EncodedString())"
            webView.evaluateJavaScript("setAppIcon('\(dataUrl)')")
        }

        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                if #available(macOS 13, *) {
                    webView.evaluateJavaScript("show('mac', \(state.isEnabled), true)")
                } else {
                    webView.evaluateJavaScript("show('mac', \(state.isEnabled), false)")
                }
            }
        }
#endif
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
#if os(macOS)
        if (message.body as! String != "open-preferences") {
            return
        }

        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
            guard error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                NSApp.terminate(self)
            }
        }
#elseif os(iOS)
        if (message.body as! String != "open-settings") {
            return
        }

        UIApplication.shared.open(URL(string: UIApplication.openSettingsURLString)!, options: [:], completionHandler: nil)
#endif
    }

}
