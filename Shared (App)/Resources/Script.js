// The main app page is shown in Simplified Chinese on any Chinese-language
// system (zh-Hans or zh-Hant), and in English everywhere else.
const isChinese = /^zh/i.test(navigator.language || "");

const TEXT = {
    tagline: {
        en: "Generate a QR code for the current page — scan it to open it on your phone.",
        zh: "为当前网页生成二维码，扫码即可在手机上打开"
    },
    iosStatus: {
        en: "Enable SafaQrcode in Settings → Safari → Extensions first.",
        zh: "请先在 设置 → Safari → 扩展 中启用 SafaQrcode。"
    },
    macUnknown: {
        en: "You can turn on SafaQrcode’s extension in Safari’s Extensions preferences.",
        zh: "你可以在 Safari 的「扩展」偏好设置中启用 SafaQrcode 扩展。"
    },
    macOn: {
        en: "SafaQrcode’s extension is currently on. You can turn it off in Safari’s Extensions preferences.",
        zh: "SafaQrcode 扩展当前已启用，你可以在「扩展」偏好设置中关闭它。"
    },
    macOff: {
        en: "SafaQrcode’s extension is currently off. You can turn it on in Safari’s Extensions preferences.",
        zh: "SafaQrcode 扩展当前未启用，你可以在「扩展」偏好设置中启用它。"
    },
    macUnknownSettings: {
        en: "You can turn on SafaQrcode’s extension in the Extensions section of Safari Settings.",
        zh: "你可以在 Safari 设置的「扩展」中启用 SafaQrcode 扩展。"
    },
    macOnSettings: {
        en: "SafaQrcode’s extension is currently on. You can turn it off in the Extensions section of Safari Settings.",
        zh: "SafaQrcode 扩展当前已启用，你可以在 Safari 设置的「扩展」中关闭它。"
    },
    macOffSettings: {
        en: "SafaQrcode’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.",
        zh: "SafaQrcode 扩展当前未启用，你可以在 Safari 设置的「扩展」中启用它。"
    },
    openPrefs: {
        en: "Quit and Open Safari Extensions Preferences…",
        zh: "退出并打开 Safari 扩展偏好设置…"
    },
    openPrefsSettings: {
        en: "Quit and Open Safari Settings…",
        zh: "退出并打开 Safari 设置…"
    },
    openSettings: {
        en: "Open Settings",
        zh: "打开设置"
    },
    tutorialTitle: {
        en: "First-Time Setup Guide",
        zh: "首次使用教程"
    },
    steps: [
        { en: "Open any webpage in Safari.", zh: "在 Safari 中打开任意网页。" },
        { en: "Click the Extensions (puzzle) icon in the Safari toolbar and choose SafaQrcode.", zh: "点击 Safari 工具栏中的「扩展」图标（拼图形状），在菜单里选择「SafaQrcode」。" },
        { en: "Enable SafaQrcode in Settings → Safari → Extensions, then tap the size icon at the left of the address bar and choose SafaQrcode.", zh: "先在 设置 → Safari → 扩展 中启用 SafaQrcode，然后点击网页地址栏左侧的「大小」图标，在菜单里选择「SafaQrcode」。" },
        { en: "The extension popup shows a QR code for the current page.", zh: "扩展弹窗中会显示当前网页的二维码。" },
        { en: "Scan it with your phone camera to open the page on your phone; you can also tap “Copy URL” or “Download QR Code”.", zh: "用手机相机扫描二维码，即可在手机上打开当前网页；也可以点击「复制网址」或「下载二维码」。" }
    ]
};

function pick(key) {
    return TEXT[key][isChinese ? "zh" : "en"];
}

function pickStep(index) {
    return TEXT.steps[index][isChinese ? "zh" : "en"];
}

function applyLanguage() {
    document.documentElement.lang = isChinese ? "zh-CN" : "en";

    const selectors = {
        tagline: ".tagline",
        iosStatus: ".status.platform-ios",
        macUnknown: ".platform-mac.state-unknown",
        macOn: ".platform-mac.state-on",
        macOff: ".platform-mac.state-off",
        openPrefs: ".platform-mac.open-preferences",
        openSettings: ".platform-ios.open-settings",
        tutorialTitle: ".tutorial h2"
    };

    for (const [key, selector] of Object.entries(selectors)) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = pick(key);
        }
    }

    document.querySelectorAll(".tutorial li").forEach((item, index) => {
        if (TEXT.steps[index]) {
            item.textContent = pickStep(index);
        }
    });
}

function show(platform, enabled, useSettingsInsteadOfPreferences) {
    document.body.classList.add(`platform-${platform}`);
    applyLanguage();

    if (useSettingsInsteadOfPreferences) {
        document.getElementsByClassName('platform-mac state-on')[0].innerText = pick("macOnSettings");
        document.getElementsByClassName('platform-mac state-off')[0].innerText = pick("macOffSettings");
        document.getElementsByClassName('platform-mac state-unknown')[0].innerText = pick("macUnknownSettings");
        document.getElementsByClassName('platform-mac open-preferences')[0].innerText = pick("openPrefsSettings");
    }

    if (typeof enabled === "boolean") {
        document.body.classList.toggle(`state-on`, enabled);
        document.body.classList.toggle(`state-off`, !enabled);
    } else {
        document.body.classList.remove(`state-on`);
        document.body.classList.remove(`state-off`);
    }
}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage("open-preferences");
}

function openSettings() {
    webkit.messageHandlers.controller.postMessage("open-settings");
}

// Replace the static page icon with the real app icon (macOS passes it in
// as a PNG data URL at runtime, so the page always matches the app bundle).
function setAppIcon(dataUrl) {
    const icon = document.querySelector(".app-icon");
    if (icon && dataUrl) {
        icon.src = dataUrl;
    }
}

document.querySelector("button.open-preferences").addEventListener("click", openPreferences);

const settingsButton = document.querySelector("button.open-settings");
if (settingsButton) {
    settingsButton.addEventListener("click", openSettings);
}
