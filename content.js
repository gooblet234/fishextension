const FiSHWord = "fish";
const FiSHEmoji = "🐟";

function FiSHifyText(node) {
  if (node.nodeType !== Node.TEXT_NODE) return;
  if (!node.textContent.trim()) return;

  const parent = node.parentElement;
  if (!parent) return;

  const forbidden = ["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "TEMPLATE"];
  if (forbidden.includes(parent.tagName)) return;

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
    if (img.dataset.FiSHified) return;
    img.dataset.FiSHified = "true";
    img.dataset.originalSrc = img.currentSrc || img.src;
    const FiSHUrl = chrome.runtime.getURL("fish.gif");
    img.loading = "eager";
    img.decoding = "sync";
    img.src = FiSHUrl;
    img.srcset = FiSHUrl;
    img.addEventListener(
      "load",
      () => {
        if (img.src !== FiSHUrl) {
          img.src = FiSHUrl;
          img.srcset = FiSHUrl;
        }
      },
      { once: true }
    );
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