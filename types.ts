import { ReactNode } from 'react'
import MyPlugin from './main'

export interface FetchTherapyResponseParams {
	prompt: string
	userInput: string
	noteRange: string
	vibe: string
}

export interface AppContextProps {
	plugin: MyPlugin
	apiKey: string
	generatePrompt: () => string
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
	fetchTherapyResponse: (params: FetchTherapyResponseParams) => Promise<string>
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
	updateUserInput: () => void
	generateTherapyResponse: () => Promise<void>
	handleTherapyTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	handleInsightFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	handleCloseModal: () => void
	handlePlusClick: (advice: string) => Promise<void>
	handleHeartClick: (advice: string) => Promise<void>
	saveMemoriesToNote: (memories: string) => Promise<void>
	getMemoriesContent: () => Promise<string>
	toggleEmotionsBar: () => void
	isEmotionsBarVisible: boolean
	emotionsBarRef: React.RefObject<HTMLDivElement>
	vibe: string
	setVibe: (vibe: string) => void
	handleVibeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	closeEmotionsBar: () => void
}

export interface AppProviderProps {
	plugin: MyPlugin
	children: ReactNode
}
