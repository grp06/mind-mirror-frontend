export async function fetchAndDisplayResult(
	plugin: any,
	{
		prompt,
		userInput,
		noteRange,
	}: {
		prompt: string
		userInput: string
		noteRange: string
	},
): Promise<string> {
	try {
		let notesContent = userInput

		if (noteRange !== 'current') {
			const notes = await plugin.getRecentNotes(noteRange)
			notesContent = notes.join('\n\n')
		}

		const memoriesContent = await plugin.getAIMemoriesContent()

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
				...(userApiKey && { user_api_key: userApiKey }),
			}),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error || 'Unknown error')
		}

		return data.choices[0].message.content // Return the response content
	} catch (error) {
		console.log('🚀 ~ fetchAndDisplayResult ~ error:', error)
		throw error // Rethrow the error to handle it in the calling function
	}
}

export async function fetchMemories(
	plugin: any,
	userInput: string,
	aiMemories: string,
): Promise<string> {
	try {
		const authToken = localStorage.getItem('authToken')
		const userApiKey = plugin.settings.apiKey

		const memoriesContent = await plugin.getAIMemoriesContent()
		const fullNotesContent = `${memoriesContent}\n\n${userInput}\n\n${aiMemories}`

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
				prompt:
					"You are an LLM optimized to detect important memories. Your job is to parse the user's past memories and current journal entry for the most important life events to remember. The memories should be facts about the user or things that they experienced. Only come up 1-3 bullet points. Do not duplicate memories from the current note if they're already stored. Only IMPORTANT memories. Write them concisely. Don't include any formatting, just markdown bullet points. Just return the bullet points. Ignore the emotions they list at the top if a bulleted list of emotions is present. If there are no important memories, just return an empty string.",
				notes_content: fullNotesContent,
				...(userApiKey && { user_api_key: userApiKey }),
			}),
		})

		const data = await response.json()
		return data.choices[0].message.content
	} catch (error) {
		console.error('Error fetching memories:', error)
		return ''
	}
}
