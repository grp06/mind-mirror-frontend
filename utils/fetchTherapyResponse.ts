import { FetchTherapyResponseParams, TherapyResponse } from '../types'
import MyPlugin from '../main'

export async function fetchTherapyResponse({
  prompt,
  noteRange,
  length,
  vibe,
  plugin,
}: FetchTherapyResponseParams): Promise<TherapyResponse> {
  try {
    const notes = await plugin.getRecentNotes(noteRange)
    const notesContent = notes.join('\n\n')

    const authToken = localStorage.getItem('authToken')
    const userApiKey = (plugin as MyPlugin).settings.apiKey

    const endpoint = userApiKey ? 'openai_with_api_key' : 'openai'
    const headers = {
      'Content-Type': 'application/json',
      Authorization: authToken ? `Bearer ${authToken}` : `Bearer ${userApiKey}`,
    }

    const response = await fetch(`http://127.0.0.1:8000/backend/${endpoint}/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        prompt: prompt,
        notes_content: notesContent,
        length: length,
        vibe: vibe,
        user_api_key: userApiKey,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: ' + (data.error || 'Unknown error'))
      }
      throw new Error(data.error || 'Unknown error')
    }

    return {
      content: data.choices[0].message.content,
      remaining_budget: data.remaining_budget,
      spending_limit: data.spending_limit,
    }
  } catch (error) {
    console.error('Error in fetchTherapyResponse:', error)
    throw error
  }
}
