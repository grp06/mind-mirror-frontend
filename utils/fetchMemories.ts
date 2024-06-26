export async function fetchMemoriesFromAPI(
	plugin: any,
	userInput: string,
	memoryNotesDate: string,
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
					memory_notes_date: memoryNotesDate,
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
