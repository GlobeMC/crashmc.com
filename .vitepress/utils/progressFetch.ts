type ProgressCallback = (
	percent: number,
	downloaded: number,
	chunk: number,
) => void

export async function progressFetch(
	url: string,
	callback: ProgressCallback,
): Promise<Response> {
	const resp = await fetch(url)
	const contentLength =
		Number.parseInt(resp.headers.get("Content-Length") || "") * 2 || 1024 * 1024
	callback(0, 0, 0)

	if (!resp.body) {
		return resp
	}
	const reader = resp.body.getReader()
	const stream = new ReadableStream({
		async start(controller) {
			try {
				var downloaded = 0
				var chunk: Uint8Array | undefined
				while (!({ value: chunk } = await reader.read()).done) {
					chunk = chunk as Uint8Array
					downloaded += chunk.byteLength
					const percent = Math.min(downloaded / contentLength, 0.95)
					callback(percent, downloaded, chunk.byteLength)
					controller.enqueue(chunk)
				}
				callback(1, downloaded, 0)
				controller.close()
			} catch (err) {
				controller.error(err)
			}
		},
	})

	return new Response(stream, { headers: resp.headers })
}
