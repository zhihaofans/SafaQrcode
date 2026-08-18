// Get the URL of the currently active tab and render it as a QR code.

const qrContainer = document.getElementById("qrcode");
const urlElement = document.getElementById("url");
const statusElement = document.getElementById("status");

function showError(message) {
    statusElement.textContent = message;
    statusElement.classList.add("visible");
}

function renderQRCode(url) {
    urlElement.textContent = url;
    urlElement.title = url;

    const qr = qrcode(0, "M");
    qr.addData(url, "Byte");
    qr.make();

    qrContainer.innerHTML = qr.createSvgTag({
        cellSize: 8,
        margin: 4,
        scalable: true,
        alt: url,
        title: url
    });
    qrContainer.hidden = false;
}

async function getActiveTabUrl() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs && tabs[0];
    return tab ? tab.url : null;
}

(async function init() {
    try {
        const url = await getActiveTabUrl();

        if (!url) {
            showError("Could not read the current page URL.");
            return;
        }

        // Only web pages can be meaningfully encoded; skip internal Safari pages.
        if (!/^https?:\/\//i.test(url)) {
            showError("This page type cannot be converted to a QR code.");
            return;
        }

        renderQRCode(url);
    } catch (error) {
        console.error("Failed to generate QR code:", error);
        showError("Could not generate a QR code for this page.");
    }
})();
