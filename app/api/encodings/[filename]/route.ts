import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
    request: NextRequest,
    { params }: { params: { filename: string } }
) {
    try {
        const filename = params.filename
        const filePath = join(process.cwd(), 'encodings', filename)

        const content = await readFile(filePath, 'utf-8')

        return new NextResponse(content, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'public, max-age=3600',
            },
        })
    } catch (error) {
        console.error('Error reading encoding file:', error)
        return new NextResponse('File not found', { status: 404 })
    }
} 