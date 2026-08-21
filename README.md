# SafaQrcode

> A Safari extension for iOS & macOS that turns the webpage you're viewing into a QR code — scan it to open it on your phone.

SafaQrcode 是一款适用于 iOS 和 macOS 的 Safari 扩展，为当前网页一键生成二维码，扫码即可在手机上打开。

![icon](https://github.com/zhihaofans/SafaQrcode/blob/master/Shared%20(App)/Resources/Icon.png)

---

## ✨ Features / 功能

- **Instant QR code** — click the extension toolbar icon and get a QR code for the current page immediately.
  （点击扩展图标，立即为当前页面生成二维码。）
- **Copy URL / Download QR Code** — grab the URL or save the QR image to your device.
  （支持一键复制网址、下载二维码图片。）
- **Readable non-English URLs** — percent-encoded URLs are decoded for display, so Chinese and other languages are easy to read.
  （显示时自动解码百分号编码，非英文网址一目了然。）
- **Offline & private** — QR generation runs entirely on your device with a bundled library. No network requests, no data leaves your machine.
  （二维码生成完全本地完成，无网络请求、不上传任何数据。）
- **Localized** — Simplified Chinese on any Chinese-language system (zh-Hans / zh-Hant), English everywhere else.
  （中文系统显示简体中文，其他语言显示英文。）
- **Auto-synced app icon** — the main page always shows the real app icon.
  （主界面图标自动跟随 App 图标。）

## 🖼 Screenshots / 截图

*(Add your screenshots here / 在此添加你的截图)*

## 🔒 Privacy / 隐私

SafaQrcode collects **no personal data**. The current page URL is read **only** when you actively open the extension, and is used **only** to generate a QR code on your device — it is never transmitted or stored.

SafaQrcode **不收集任何个人数据**。仅在主动打开扩展时读取当前页网址，且仅用于在设备上生成二维码，不会传输或存储。

- [Privacy Policy / 隐私政策](https://github.com/zhihaofans/SafaQrcode/blob/master/docs/privacy-policy.md)
- [Support / 支持](https://github.com/zhihaofans/SafaQrcode/blob/master/docs/support.md)

## 🔗 Project / 项目

- Repository: [https://github.com/zhihaofans/SafaQrcode](https://github.com/zhihaofans/SafaQrcode)
- To report a bug or request a feature, please open an [issue](https://github.com/zhihaofans/SafaQrcode/issues).
  （遇到问题或需要新功能，欢迎在仓库提交 Issue。）

## 🛠 Getting Started / 开始使用

Requires **Xcode 15+** and macOS 12+ / iOS 15+.

1. Clone the repository.
2. Open `SafaQrcode.xcodeproj` in Xcode.
3. Select the **SafaQrcode (macOS)** or **SafaQrcode (iOS)** scheme and press **Run**.
4. In Safari, enable the **SafaQrcode** extension (Safari → Settings → Extensions).

> **Note** / 说明: Debug builds are named `SafaQrcode(测试)` so you can tell the test build apart from the installed release build. Release builds are named `SafaQrcode`.
> （Debug 构建名为 `SafaQrcode(测试)`，便于与正式版区分；Release 构建名为 `SafaQrcode`。）

## 🧱 How it works / 工作原理

- The extension uses the Safari `activeTab` permission to read the current page URL only when you invoke it.
- The QR code is rendered by the bundled [`qrcode-generator`](https://github.com/kazuhikoarase/qrcode-generator) library (MIT licensed) — no external API is called.
- The main app hosts a small web page that shows the extension's status and a first-time setup guide.

## 📝 License

Project code is released under the MIT License. The bundled [`qrcode-generator`](https://github.com/kazuhikoarase/qrcode-generator) library is MIT licensed.

---

**Contact / 联系**: [zhihaofans@hotmail.com](mailto:zhihaofans@hotmail.com)
