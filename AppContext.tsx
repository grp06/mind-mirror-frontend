import React, { createContext, useContext, useState, useEffect } from 'react'
import MyPlugin from './main'
import {
	fetchAndDisplayResult as fetchAndDisplayResultAPI,
	fetchMemories as fetchMemoriesAPI,
} from './apiHandler'
import { TFile } from 'obsidian'
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
	fetchAndDisplayResult: (params: {
		prompt: string
		userInput: string
		noteRange: string
	}) => Promise<string>
	fetchMemories: (userInput: string) => Promise<string>
	openAIMemoriesNote: () => Promise<void>
	therapyType: string
	setTherapyType: (therapyType: string) => void
	insightFilter: string
	setInsightFilter: (insightFilter: string) => void
	userInput: string
	setUserInput: (userInput: string) => void
	result: string
	setResult: (result: string) => void
	showModal: boolean
	setShowModal: (showModal: boolean) => void
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
	const [authMessage, setAuthMessage] = useState('')
	const [therapyType, setTherapyType] = useState('Cognitive Behavioral Therapy')
	const [insightFilter, setInsightFilter] = useState('Give Feedback')
	const [userInput, setUserInput] = useState('')
	const [result, setResult] = useState('')
	const [showModal, setShowModal] = useState(false)

	const getAIMemoriesContent = async (): Promise<string> => {
		const aiMemoriesPath = 'AI-memories.md'
		const aiMemoriesFile =
			plugin.app.vault.getAbstractFileByPath(aiMemoriesPath)
		if (aiMemoriesFile instanceof TFile) {
			return await plugin.app.vault.read(aiMemoriesFile)
		}
		return ''
	}

	const fetchAndDisplayResult = async (params: {
		prompt: string
		userInput: string
		noteRange: string
	}): Promise<string> => {
		const response = await fetchAndDisplayResultAPI(
			plugin,
			params,
			getAIMemoriesContent,
		)
		setResult(response) // Update the result state
		setShowModal(true) // Show the modal
		return response
	}

	const fetchMemories = async (userInput: string): Promise<string> => {
		return await fetchMemoriesAPI(plugin, userInput, getAIMemoriesContent)
	}

	const openAIMemoriesNote = async (): Promise<void> => {
		const notePath = 'AI-memories.md'
		const memoryFile = plugin.app.vault.getAbstractFileByPath(notePath)

		if (memoryFile instanceof TFile) {
			const leaf = plugin.app.workspace.getLeaf(true)
			await leaf.openFile(memoryFile)
		}
	}

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
				fetchAndDisplayResult,
				fetchMemories,
				openAIMemoriesNote,
				therapyType,
				setTherapyType,
				insightFilter,
				setInsightFilter,
				userInput,
				setUserInput,
				result,
				setResult,
				showModal,
				setShowModal,
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

// Export AppContext to fix the import error
export { AppContext }
