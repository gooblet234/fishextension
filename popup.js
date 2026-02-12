const toggle = document.getElementById("FiSHToggle");

chrome.storage.sync.get(["FiSHMode"], (res) => {
    toggle.checked = !!res.FiSHMode;
});  // 10/10 code btw

toggle.addEventListener("change", () => {
    chrome.storage.sync.set({ FiSHMode: toggle.checked });
});