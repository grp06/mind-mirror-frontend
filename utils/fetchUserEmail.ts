import { Notice } from 'obsidian'

export async function fetchUserEmail(
	authToken: string | null,
	setAuthToken: (token: string | null) => void,
	setEmail: (email: string) => void,
): Promise<void> {
	if (authToken) {
		try {
			const response = await fetch('http://127.0.0.1:8000/backend/user_info/', {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			})
			if (response.ok) {
				const data = await response.json()
				console.log('🚀 ~ data:', data)
				setEmail(data.email)
			} else {
				console.error('Failed to fetch user email')
				setAuthToken(null)
				setEmail('')
				new Notice('Failed to fetch user email')
			}
		} catch (error) {
			console.error('Error fetching user email:', error)
			setAuthToken(null)
			setEmail('')
			new Notice('Error fetching user email')
		}
	}
}
