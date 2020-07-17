export function isKanji(c: string): boolean {
    return (c >= '\u4e00' && c <= '\u9faf') || (c >= '\u3400' && c <= '\u4dbf');
}

export function extractKanjis(text: string): string[] {
    if (!text) return [];
    return text.split('').filter(isKanji);
}
