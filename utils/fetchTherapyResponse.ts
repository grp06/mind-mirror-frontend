export async function fetchTherapyResponse(
	plugin: any,
	{
		prompt,
		userInput,
		noteRange,
		length,
		vibe,
	}: {
		prompt: string
		userInput: string
		noteRange: string
		length: string
		vibe: string
	},
	getAIMemoriesContent: () => Promise<string>,
): Promise<string> {
	try {
		let notesContent = userInput

		if (noteRange !== 'current') {
			const notes = await plugin.getRecentNotes(noteRange)
			notesContent = notes.join('\n\n')
		}

		const memoriesContent = await getAIMemoriesContent()

		const authToken = localStorage.getItem('authToken')
		const userApiKey = plugin.settings.apiKey

		const endpoint = userApiKey ? 'openai_with_user_api_key' : 'openai'
		const headers = {
			'Content-Type': 'application/json',
			...(userApiKey
				? { Authorization: `Bearer ${userApiKey}` }
				: { Authorization: `Bearer ${authToken}` }),
		}

		const response = await fetch(`http://127.0.0.1:8000/backend/${endpoint}/`, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({
				prompt: prompt,
				notes_content: notesContent,
				memories_content: memoriesContent,
				length: length,
				vibe: vibe,
				...(userApiKey && { user_api_key: userApiKey }),
			}),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error || 'Unknown error')
		}

		return data.choices[0].message.content
	} catch (error) {
		console.log('🚀 ~ fetchTherapyResponse ~ error:', error)
		throw error
	}
}
