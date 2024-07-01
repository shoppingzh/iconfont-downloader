import type { Readable } from 'node:stream'

export function stream2Buffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers: Uint8Array[] = []
    stream.on('error', reject)
    stream.on('data', data => buffers.push(data))
    stream.on('end', () => {
      resolve(Buffer.concat(buffers))
    })
  })
}
