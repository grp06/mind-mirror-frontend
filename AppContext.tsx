import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from 'react'
import MyPlugin from './main'
import {
	fetchAndDisplayResult as fetchAndDisplayResultAPI,
	fetchMemories as fetchMemoriesAPI,
} from './apiHandler'
import { TFile, MarkdownView } from 'obsidian'

interface AppContextProps {
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
	updateUserInput: () => void
	handleFetchResult: () => Promise<void>
	handleRefresh: () => Promise<void>
	handleTherapyTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	handleInsightFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	handleCloseModal: () => void
	handlePlusClick: (advice: string) => Promise<void>
	handleHeartClick: (advice: string) => Promise<void>
	saveMemoriesToNote: (memories: string) => Promise<void>
	getMemoriesContent: () => Promise<string>
}

const AppContext = createContext<AppContextProps | undefined>(undefined)
interface AppProviderProps {
	plugin: MyPlugin
	children: ReactNode
}
export const AppProvider: React.FC<AppProviderProps> = ({
	plugin,
	children,
}) => {
	const [apiKey, setApiKey] = useState(plugin.settings.apiKey)

	const [noteRange, setNoteRange] = useState(plugin.settings.noteRange)
	const [authToken, setAuthToken] = useState<string | null>(
		localStorage.getItem('authToken'),
	)
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')

	const [therapyType, setTherapyType] = useState('Cognitive Behavioral Therapy')
	const [insightFilter, setInsightFilter] = useState('Give Feedback')
	const [userInput, setUserInput] = useState('')
	const [result, setResult] = useState('')
	const [showModal, setShowModal] = useState(false)
	const [authMessage, setAuthMessage] = useState('')

	const [length, setLength] = useState(plugin.settings.length)

	useEffect(() => {
		plugin.settings.length = length
		plugin.saveSettings()
	}, [length, plugin])

	const fetchAndDisplayResult = async (params: {
		prompt: string
		userInput: string
		noteRange: string
	}): Promise<string> => {
		const response = await fetchAndDisplayResultAPI(
			plugin,
			{ ...params, length },
			getAIMemoriesContent,
		)
		setResult(response)
		setShowModal(true)
		return response
	}

	useEffect(() => {
		const loadSettings = () => {
			setApiKey(plugin.settings.apiKey)
			setLength(plugin.settings.length)
			setNoteRange(plugin.settings.noteRange)
		}

		loadSettings()
	}, [plugin])

	const getAIMemoriesContent = async (): Promise<string> => {
		const aiMemoriesPath = 'AI-memories.md'
		const aiMemoriesFile =
			plugin.app.vault.getAbstractFileByPath(aiMemoriesPath)
		if (aiMemoriesFile instanceof TFile) {
			return await plugin.app.vault.read(aiMemoriesFile)
		}
		return ''
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

	const generatePrompt = (): string => {
		return `You are the world's top therapist, trained in ${therapyType}. Your only job is to ${insightFilter}. Your responses must always be ${length}.`
	}

	const updateUserInput = () => {
		const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
		if (view) {
			setUserInput(view.editor.getValue())
		} else {
			setUserInput('')
		}
	}

	const handleFetchResult = async () => {
		try {
			const prompt = generatePrompt()
			const result = await fetchAndDisplayResult({
				prompt,
				userInput,
				noteRange,
			})
			setResult(result)
			setShowModal(true)
		} catch (error) {
			console.error('Error fetching result:', error)
		}
	}

	const handleRefresh = async () => {
		try {
			updateUserInput()
			const prompt = generatePrompt()
			const result = await fetchAndDisplayResult({
				prompt,
				userInput,
				noteRange,
			})
			setResult(result)
			setShowModal(true)
		} catch (error) {
			console.error('Error refreshing result:', error)
		}
	}

	const handleTherapyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setTherapyType(e.target.value)
	}

	const handleInsightFilterChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		setInsightFilter(e.target.value)
	}

	const handleCloseModal = () => {
		setShowModal(false)
	}
	const handlePlusClick = async (advice: string) => {
		const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
		if (!view) return

		const editor = view.editor
		const currentContent = editor.getValue()
		const updatedContent = `${currentContent}\n\n### AI:\n- ${advice}\n### Me:\n- `
		editor.setValue(updatedContent)

		const lastLine = editor.lineCount() - 1
		editor.setCursor({ line: lastLine, ch: 0 })
		editor.scrollIntoView({
			from: { line: lastLine, ch: 0 },
			to: { line: lastLine, ch: 0 },
		})
	}

	const handleHeartClick = async (advice: string) => {
		const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
		if (!view) return

		const currentNoteFile = view.file
		const currentNoteDate = currentNoteFile?.basename

		const feedbackFile =
			plugin.app.vault.getAbstractFileByPath('ai-feedback.md')

		if (feedbackFile instanceof TFile) {
			const content = await plugin.app.vault.read(feedbackFile)
			const updatedContent = `### ${currentNoteDate}\n${advice}\n\n${content}`
			await plugin.app.vault.modify(feedbackFile, updatedContent)
		} else {
			const newContent = `### ${currentNoteDate}\n${advice}`
			await plugin.app.vault.create('ai-feedback.md', newContent)
		}
	}
	const saveMemoriesToNote = async (memories: string) => {
		const notePath = 'AI-memories.md'
		const memoryFile = plugin.app.vault.getAbstractFileByPath(notePath)

		const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
		if (!view) return
		const currentNoteFile = view.file
		const currentNoteDate = currentNoteFile?.basename
		const memoriesWithDate = memories
			.split('\n')
			.map((memory) => `${memory} - ${currentNoteDate}`)
			.join('\n')

		if (memoryFile instanceof TFile) {
			const content = await plugin.app.vault.read(memoryFile)
			const updatedContent = `${memoriesWithDate}\n\n${content}`
			await plugin.app.vault.modify(memoryFile, updatedContent)
		} else {
			await plugin.app.vault.create(notePath, memoriesWithDate)
		}

		await openAIMemoriesNote()
	}

	const getMemoriesContent = async (): Promise<string> => {
		const aiMemoriesPath = 'AI-memories.md'
		const aiMemoriesFile =
			plugin.app.vault.getAbstractFileByPath(aiMemoriesPath)
		if (aiMemoriesFile instanceof TFile) {
			console.log('🚀 ~ getMemoriesContent ~ aiMemoriesFile:', aiMemoriesFile)
			return await plugin.app.vault.read(aiMemoriesFile)
		}
		return ''
	}

	return (
		<AppContext.Provider
			value={{
				plugin,
				generatePrompt,
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
				updateUserInput,
				handleFetchResult,
				handleRefresh,
				handleTherapyTypeChange,
				handleInsightFilterChange,
				handleCloseModal,
				handlePlusClick,
				handleHeartClick,
				saveMemoriesToNote,
				getMemoriesContent,
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

export { AppContext }
