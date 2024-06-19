export async function fetchAndDisplayResult(
	plugin: any,
	{
		prompt,
		userInput,
		resultElementId,
		noteRange,
	}: {
		prompt: string
		userInput: string
		resultElementId: string
		noteRange: string
	},
) {
	try {
		let notesContent = userInput
		if (noteRange !== 'current') {
			const notes = await plugin.getRecentNotes(noteRange)
			notesContent = notes.join('\n\n')
		}

		const memoriesContent = await plugin.getAIMemoriesContent()

		const authToken = localStorage.getItem('authToken')

		const response = await fetch('http://127.0.0.1:8000/backend/openai/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
			body: JSON.stringify({
				prompt: prompt,
				notes_content: notesContent,
				memories_content: memoriesContent,
			}),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error || 'Unknown error')
		}

		const resultDiv = document.getElementById(resultElementId)

		const heartEmoji = document.getElementById('heart-emoji')
		const plusEmoji = document.getElementById('plus-emoji')

		if (heartEmoji) {
			heartEmoji.addEventListener('click', () => {
				plugin.handleHeartClick()
			})
		}

		if (resultDiv) {
			resultDiv.innerText = data.choices[0].message.content
			if (heartEmoji && plusEmoji) {
				heartEmoji.style.display = 'block'
				plusEmoji.style.display = 'block'
			}
		}
	} catch (error) {
		console.log('🚀 ~ fetchAndDisplayResult ~ error:', error)
		const resultDiv = document.getElementById(resultElementId)
		const heartEmoji = document.getElementById('heart-emoji')
		const plusEmoji = document.getElementById('plus-emoji')

		if (resultDiv) {
			if (error.message.includes('COST_LIMIT_EXCEEDED')) {
				resultDiv.innerText = 'Error: You have exceeded your token limit.'
			} else {
				resultDiv.innerText = 'Error: ' + error.message
			}
			if (heartEmoji && plusEmoji) {
				heartEmoji.style.display = 'none'
				plusEmoji.style.display = 'none'
			}
		}
	}
}

export async function fetchMemories(
	plugin: any,
	userInput: string,
	aiMemories: string,
): Promise<string> {
	try {
		const authToken = localStorage.getItem('authToken')

		const memoriesContent = await plugin.getAIMemoriesContent()
		const fullNotesContent = `${memoriesContent}\n\n${userInput}\n\n${aiMemories}`

		const response = await fetch('http://127.0.0.1:8000/backend/openai/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
			body: JSON.stringify({
				prompt:
					"You are an LLM optimized to detect important memories. Your job is to parse the user's past memories and current journal entry for the most important life events to remember. The memories should be facts about the user or things that they experienced. Only come up 1-3 bullet points. Do not duplicate memories from the current note if they're already stored. Only IMPORTANT memories. Write them concisely. Don't include any formatting, just markdown bullet points. Just return the bullet points. Ignore the emotions they list at the top if a bulleted list of emotions is present. If there are no important memories, just return an empty string.",
				notes_content: fullNotesContent,
			}),
		})

		const data = await response.json()
		return data.choices[0].message.content
	} catch (error) {
		console.error('Error fetching memories:', error)
		return ''
	}
}
