import React, { createContext, useContext, useState, useEffect } from 'react'
import MyPlugin from './main'

interface AppContextProps {
	plugin: MyPlugin
	apiKey: string
	setApiKey: (apiKey: string) => void
	length: string
	setLength: (length: string) => void
	noteRange: string
	setNoteRange: (noteRange: string) => void
	authToken: string | null
	setAuthToken: (authToken: string | null) => void
	email: string
	setEmail: (email: string) => void
	error: string
	setError: (error: string) => void
	authMessage: string
	setAuthMessage: (message: string) => void
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

export const AppProvider: React.FC<{ plugin: MyPlugin }> = ({
	plugin,
	children,
}) => {
	const [apiKey, setApiKey] = useState(plugin.settings.apiKey)
	const [length, setLength] = useState(plugin.settings.length)
	const [noteRange, setNoteRange] = useState(plugin.settings.noteRange)
	const [authToken, setAuthToken] = useState<string | null>(
		localStorage.getItem('authToken'),
	)
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [authMessage, setAuthMessage] = useState(plugin.authMessage)

	useEffect(() => {
		const saveSettings = async () => {
			plugin.settings.apiKey = apiKey
			plugin.settings.length = length
			plugin.settings.noteRange = noteRange
			await plugin.saveSettings()
		}
		saveSettings()
	}, [apiKey, length, noteRange, plugin])

	useEffect(() => {
		if (authToken) {
			const payload = JSON.parse(atob(authToken.split('.')[1]))
			setEmail(payload.email)
			setAuthMessage('')
		}
	}, [authToken, plugin])

	return (
		<AppContext.Provider
			value={{
				plugin,
				apiKey,
				setApiKey,
				length,
				setLength,
				noteRange,
				setNoteRange,
				authToken,
				setAuthToken,
				email,
				setEmail,
				error,
				setError,
				authMessage,
				setAuthMessage,
			}}
		>
			{children}
		</AppContext.Provider>
	)
}

export const useAppContext = () => {
	const context = useContext(AppContext)
	if (!context) {
		throw new Error('useAppContext must be used within an AppProvider')
	}
	return context
}
