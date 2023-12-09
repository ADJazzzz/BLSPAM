import { promises as fs } from 'fs'
import { minify } from 'terser'

async function minifyUserscript(inputPath, outputPath) {
    const code = await fs.readFile(inputPath, 'utf-8')

    const metadataMatch = code.match(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/)
    const metadata = metadataMatch ? metadataMatch[0] : ''

    const minified = await minify(code, {
        format: {
            comments: false
        }
    })

    const result = `${metadata}\n${minified.code}`

    await fs.writeFile(outputPath, result, 'utf-8')

    console.log(`\n压缩完成: ${inputPath} -> ${outputPath}`)
}

minifyUserscript('dist/bilibili-live-spamer.user.js', 'dist/bilibili-live-spamer.min.user.js')
