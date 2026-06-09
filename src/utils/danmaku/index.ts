const graphemeSegmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' })

function isEmojiGrapheme(grapheme: string): boolean {
    return /\p{Extended_Pictographic}/u.test(grapheme)
}

export function getDanmakuLength(str: string): number {
    let count = 0
    for (const { segment } of graphemeSegmenter.segment(str)) {
        if (segment === '\n') continue
        count += isEmojiGrapheme(segment) ? 2 : 1
    }
    return count
}

export function sliceDanmaku(msg: string, maxLength: number): string[] {
    if (getDanmakuLength(msg) <= maxLength) return [msg]

    const result: string[] = []
    let current = ''
    let currentLength = 0

    for (const { segment } of graphemeSegmenter.segment(msg)) {
        const charLen = isEmojiGrapheme(segment) ? 2 : 1
        if (currentLength + charLen > maxLength) {
            result.push(current)
            current = segment
            currentLength = charLen
        } else {
            current += segment
            currentLength += charLen
        }
    }

    if (current) result.push(current)
    return result
}
