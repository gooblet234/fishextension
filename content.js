const FiSHWord = "fish";
const FiSHEmoji = "🐟";

function FiSHifyText(node) {

    if (node.nodeType !== Node.TEXT_NODE) return;

    if (!node.textContent.trim()) return;

    node.textContent = node.textContent
        .replace(/\p{Extended_Pictographic}/gu, FiSHEmoji)
        .replace(/\b\w+\b/g, FiSHWord);
}

function walk(node) {
    FiSHifyText(node);
    node.childNodes.forEach(walk);
}

function FiSHifyImages() {
    document.querySelectorAll("img").forEach(img => {
        if (!img.dataset.originalSrc) {
            img.dataset.originalSrc = img.src;
        }
        img.src = chrome.runtime.getURL("fish.gif");
    });
}

function applyFiSHMode() {
    walk(document.body);
    FiSHifyImages();
}

chrome.storage.onChanged.addListener((changes) => {
    if (!changes.FiSHMode) return;

    const enabled = changes.FiSHMode.newValue;

    if (enabled) {
        applyFiSHMode();
    }
});

const observer = new MutationObserver((mutations) => {
    chrome.storage.sync.get(["FiSHMode"], (res) => {
        if (!res.FiSHMode) return;
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                walk(node);
            });
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});