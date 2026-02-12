// --- CONFIG ---
const FISH_WORD = "fish";
const FISH_EMOJI = "🐟";

// --- TEXT REPLACEMENT ---

function fishifyText(node) {
  // Only touch text nodes
  if (node.nodeType !== Node.TEXT_NODE) return;

  // Skip empty / whitespace-only text
  if (!node.textContent.trim()) return;

  node.textContent = node.textContent
    // Replace emojis with fish
    .replace(/\p{Extended_Pictographic}/gu, FISH_EMOJI)
    // Replace words with "fish"
    .replace(/\b\w+\b/g, FISH_WORD);
}

// Walk the DOM tree recursively
function walk(node) {
  fishifyText(node);
  node.childNodes.forEach(walk);
}

// --- IMAGE REPLACEMENT ---

function fishifyImages() {
  document.querySelectorAll("img").forEach(img => {
    // Save original src once
    if (!img.dataset.originalSrc) {
      img.dataset.originalSrc = img.src;
    }

    img.src = chrome.runtime.getURL("fish.png");
  });
}

// --- MAIN APPLY FUNCTION ---

function applyFishMode() {
  walk(document.body);
  fishifyImages();
}

// --- STORAGE LISTENER (TOGGLE REACTOR) ---

chrome.storage.onChanged.addListener((changes) => {
  if (!changes.fishMode) return;

  const enabled = changes.fishMode.newValue;

  if (enabled) {
    applyFishMode();
  } else {
    // Clean reset is easiest
    location.reload();
  }
});

// --- INITIAL STATE CHECK (PAGE LOAD) ---

chrome.storage.sync.get(["fishMode"], (res) => {
  if (res.fishMode) {
    applyFishMode();
  }
});

// --- MUTATION OBSERVER (DYNAMIC CONTENT) ---

const observer = new MutationObserver((mutations) => {
  chrome.storage.sync.get(["fishMode"], (res) => {
    if (!res.fishMode) return;

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
