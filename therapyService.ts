import { Plugin } from 'obsidian'

interface TherapyResponseParams {
	prompt: string
	userInput: string
	noteRange: string
	length: string
	vibe: string
}

export async function fetchTherapyResponse(
	plugin: Plugin,
	params: TherapyResponseParams,
	getAIMemoriesContent: () => Promise<string>,
): Promise<string> {
	try {
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
				prompt: params.prompt,
				notes_content: params.userInput,
				memories_content: memoriesContent,
				length: params.length,
				vibe: params.vibe,
				...(userApiKey && { user_api_key: userApiKey }),
			}),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error || 'Unknown error')
		}

		return data.choices[0].message.content
	} catch (error) {
		console.error('Error fetching therapy response:', error)
		throw error
	}
}

export async function fetchMemories(
	plugin: Plugin,
	userInput: string,
	getAIMemoriesContent: () => Promise<string>,
): Promise<string> {
	try {
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
				prompt: 'Retrieve relevant memories',
				notes_content: userInput,
				memories_content: memoriesContent,
				length: 'short',
				vibe: 'neutral',
				...(userApiKey && { user_api_key: userApiKey }),
			}),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error || 'Unknown error')
		}

		return data.choices[0].message.content
	} catch (error) {
		console.error('Error fetching memories:', error)
		throw error
	}
}
