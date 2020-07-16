export function isKanji(c: string): boolean {
    return (c >= '\u4e00' && c <= '\u9faf') || (c >= '\u3400' && c <= '\u4dbf');
}
