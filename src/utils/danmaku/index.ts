const graphemeSegmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' })

const isEmojiGrapheme = (grapheme: string): boolean => {
    return /\p{Extended_Pictographic}/u.test(grapheme)
}

export const getDanmakuLength = (str: string): number => {
    let count = 0
    for (const { segment } of graphemeSegmenter.segment(str)) {
        count += isEmojiGrapheme(segment) ? 2 : 1
    }
    return count
}

export const sliceDanmaku = (msg: string, maxLength: number): string[] => {
    const result: string[] = []
    let current = ''
    let currentLength = 0

    for (const { segment } of graphemeSegmenter.segment(msg)) {
        const charLen = isEmojiGrapheme(segment) ? 2 : 1
        if (currentLength + charLen > maxLength) {
            if (current) result.push(current)
            current = segment
            currentLength = charLen
        } else {
            current += segment
            currentLength += charLen
        }
    }

    if (result.length === 0) return [msg]
    if (current) result.push(current)
    return result
}
