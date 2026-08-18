// Get the URL of the currently active tab and render it as a QR code.

const qrContainer = document.getElementById("qrcode");
const urlElement = document.getElementById("url");
const statusElement = document.getElementById("status");
const actionsElement = document.getElementById("actions");
const copyButton = document.getElementById("copy-btn");
const downloadButton = document.getElementById("download-btn");

let currentUrl = null;

// Decode percent-encoded characters (e.g. %E4%B8%AD -> 中) so non-English
// URLs are readable. Only used for display; the QR code and copy button
// keep the raw URL so scanning always opens the real page.
function decodeUrlForDisplay(url) {
    try {
        return decodeURIComponent(url);
    } catch (error) {
        // Malformed percent-encoding — show the raw URL as-is.
        return url;
    }
}

function showError(message) {
    statusElement.textContent = message;
    statusElement.classList.add("visible");
}

function flashButton(button, text) {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 1500);
}

function generateQR(url) {
    const qr = qrcode(0, "M");
    qr.addData(url, "Byte");
    qr.make();
    return qr;
}

function renderQRCode(url) {
    currentUrl = url;
    const displayUrl = decodeUrlForDisplay(url);
    urlElement.textContent = displayUrl;
    urlElement.title = displayUrl;

    const qr = generateQR(url);
    let svg = qr.createSvgTag({
        cellSize: 6,
        margin: 24,
        alt: url,
        title: url
    });
    // Center the QR content inside the SVG viewport (the library uses
    // "xMinYMin", which would hug the top-left corner if the box is not
    // perfectly square — e.g. on iOS popups).
    svg = svg.replace('preserveAspectRatio="xMinYMin meet"', 'preserveAspectRatio="xMidYMid meet"');
    qrContainer.innerHTML = svg;
    qrContainer.hidden = false;
    actionsElement.hidden = false;
}

async function copyUrl() {
    if (!currentUrl) return;

    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(currentUrl);
            flashButton(copyButton, "已复制");
            return;
        }
        throw new Error("clipboard unavailable");
    } catch (error) {
        // Fallback for environments without the async Clipboard API.
        const textarea = document.createElement("textarea");
        textarea.value = currentUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();

        let copied = false;
        try {
            copied = document.execCommand("copy");
        } catch (ignored) {}

        textarea.remove();

        if (copied) {
            flashButton(copyButton, "已复制");
        } else {
            showError("复制失败，请手动复制下方网址。");
        }
    }
}

function downloadQRCode() {
    if (!currentUrl) return;

    const qr = generateQR(currentUrl);
    const count = qr.getModuleCount();
    const cellSize = 10;
    const margin = cellSize * 4;
    const size = count * cellSize + margin * 2;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    // White background plus the required 4-module quiet zone.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size, size);
    context.fillStyle = "#000000";
    for (let row = 0; row < count; row += 1) {
        for (let col = 0; col < count; col += 1) {
            if (qr.isDark(row, col)) {
                context.fillRect(
                    margin + col * cellSize,
                    margin + row * cellSize,
                    cellSize,
                    cellSize
                );
            }
        }
    }

    canvas.toBlob((blob) => {
        if (!blob) {
            showError("下载失败，请重试。");
            return;
        }

        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

        flashButton(downloadButton, "已下载");
    }, "image/png");
}

async function getActiveTabUrl() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs && tabs[0];
    return tab ? tab.url : null;
}

copyButton.addEventListener("click", copyUrl);
downloadButton.addEventListener("click", downloadQRCode);

(async function init() {
    try {
        const url = await getActiveTabUrl();

        if (!url) {
            showError("无法读取当前页面网址。");
            return;
        }

        // Only web pages can be meaningfully encoded; skip internal Safari pages.
        if (!/^https?:\/\//i.test(url)) {
            showError("此页面无法生成二维码。");
            return;
        }

        renderQRCode(url);
    } catch (error) {
        console.error("Failed to generate QR code:", error);
        showError("无法为此页面生成二维码。");
    }
})();
