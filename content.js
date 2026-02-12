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
    
}