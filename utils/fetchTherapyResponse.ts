import { FetchTherapyResponseParams } from '../types'
import MyPlugin from '../main'

export async function fetchTherapyResponse({
	prompt,
	userInput,
	noteRange,
	length,
	vibe,
	plugin,
	getAIMemoriesContent,
}: FetchTherapyResponseParams): Promise<string> {
	try {
		const notes = await plugin.getRecentNotes(noteRange)
		console.log('🚀 ~ notes:', notes)
		const notesContent = notes.join('\n\n')
		console.log('🚀 ~ notesContent:', notesContent)

		const memoriesContent = await getAIMemoriesContent()

		const authToken = localStorage.getItem('authToken')
		const userApiKey = (plugin as MyPlugin).settings.apiKey

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
			// Handle 401 Unauthorized error
			if (response.status === 401) {
				throw new Error('Unauthorized: ' + (data.error || 'Unknown error'))
			}
			throw new Error(data.error || 'Unknown error')
		}

		return data.choices[0].message.content
	} catch (error) {
		console.log('🚀 ~ fetchTherapyResponse ~ error:', error)
		throw error
	}
}
