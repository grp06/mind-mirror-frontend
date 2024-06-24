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
		console.log('🚀 ~ endpoint:', endpoint)
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
		console.log('🚀 ~ data:', data)

		if (!response.ok) {
			throw new Error(data.error || 'Unknown error')
		}

		return data.choices[0].message.content
	} catch (error) {
		console.log('🚀 ~ fetchTherapyResponse ~ error:', error)
		throw error
	}
}

export async function fetchMemories(
	plugin: any,
	userInput: string,
	todaysDate: string,
	getAIMemoriesContent: () => Promise<string>,
): Promise<string> {
	try {
		const memoriesContent = await getAIMemoriesContent()
		const authToken = localStorage.getItem('authToken')
		const userApiKey = plugin.settings.apiKey

		const headers = {
			'Content-Type': 'application/json',
			...(userApiKey ? {} : { Authorization: `Bearer ${authToken}` }),
		}

		const response = await fetch(
			`http://127.0.0.1:8000/backend/update_memories/`,
			{
				method: 'POST',
				headers: headers,
				body: JSON.stringify({
					current_note_content: userInput,
					memories_content: memoriesContent,
					todays_date: todaysDate,
					...(userApiKey && { user_api_key: userApiKey }),
				}),
			},
		)

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error || 'Unknown error')
		}

		return data.updated_memory
	} catch (error) {
		console.log('🚀 ~ fetchMemories ~ error:', error)
		throw error
	}
}
