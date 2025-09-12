export function generatePass() {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}