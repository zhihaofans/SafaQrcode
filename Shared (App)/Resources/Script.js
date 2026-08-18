function show(platform, enabled, useSettingsInsteadOfPreferences) {
    document.body.classList.add(`platform-${platform}`);

    if (useSettingsInsteadOfPreferences) {
        document.getElementsByClassName('platform-mac state-on')[0].innerText = "SafaQrcode 扩展当前已启用，你可以在 Safari 设置的「扩展」中关闭它。";
        document.getElementsByClassName('platform-mac state-off')[0].innerText = "SafaQrcode 扩展当前未启用，你可以在 Safari 设置的「扩展」中启用它。";
        document.getElementsByClassName('platform-mac state-unknown')[0].innerText = "你可以在 Safari 设置的「扩展」中启用 SafaQrcode 扩展。";
        document.getElementsByClassName('platform-mac open-preferences')[0].innerText = "退出并打开 Safari 设置…";
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
