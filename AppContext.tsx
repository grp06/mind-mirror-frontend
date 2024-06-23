import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	useCallback,
} from 'react'
import { TFile, MarkdownView } from 'obsidian'
import { fetchTherapyResponse as fetchTherapyResponseAPI } from './apiHandler'
import {
	fetchMemories,
	openAIMemoriesNote,
	saveMemoriesToNote,
	getMemoriesContent,
	getAIMemoriesContent,
} from './memoryUtils'
import {
	AppContextProps,
	AppProviderProps,
	FetchTherapyResponseParams,
} from './types'

import {
	updateUserInput as updateUserInputUI,
	handlePlusClick as handlePlusClickUI,
	handleHeartClick as handleHeartClickUI,
} from './uiInteractions'

const AppContext = createContext<AppContextProps | undefined>(undefined)

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
	const [isEmotionsBarVisible, setIsEmotionsBarVisible] = useState(false)
	const [vibe, setVibe] = useState('Neutral')

	const emotionsBarRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		plugin.settings.length = length
		plugin.saveSettings()
	}, [length, plugin])

	const fetchTherapyResponse = async (
		params: FetchTherapyResponseParams,
	): Promise<string> => {
		const response = await fetchTherapyResponseAPI(
			plugin,
			{ ...params, length },
			() => getAIMemoriesContent(plugin),
		)
		setResult(response)
		setShowModal(true)
		return response
	}

	const generateTherapyResponse = async () => {
		try {
			updateUserInput()
			const prompt = generatePrompt()
			const result = await fetchTherapyResponse({
				prompt,
				userInput,
				noteRange,
				vibe,
			})
			setResult(result)
			setShowModal(true)
		} catch (error) {
			console.error('Error generating therapy response:', error)
		}
	}

	useEffect(() => {
		const loadSettings = () => {
			setApiKey(plugin.settings.apiKey)
			setLength(plugin.settings.length)
			setNoteRange(plugin.settings.noteRange)
		}

		loadSettings()
	}, [plugin])

	const closeEmotionsBar = useCallback(() => {
		setIsEmotionsBarVisible(false)
	}, [])

	const handleVibeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setVibe(e.target.value)
	}

	const generatePrompt = (): string => {
		return `You are the world's top therapist, trained in ${therapyType}. Your only job is to ${insightFilter}. Your responses must always be ${length}. Your response must have the vibe of ${vibe}.`
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

	const updateUserInput = () => {
		setUserInput(updateUserInputUI(plugin))
	}

	const handlePlusClick = async (advice: string) => {
		await handlePlusClickUI(plugin, advice)
	}

	const handleHeartClick = async (advice: string) => {
		await handleHeartClickUI(plugin, advice)
	}

	const toggleEmotionsBar = useCallback(() => {
		setIsEmotionsBarVisible((prev) => {
			const newValue = !prev
			console.log('Toggling emotions bar:', newValue)
			return newValue
		})
	}, [])

	useEffect(() => {
		console.log('isEmotionsBarVisible updated:', isEmotionsBarVisible)
	}, [isEmotionsBarVisible])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				emotionsBarRef.current &&
				!emotionsBarRef.current.contains(event.target as Node)
			) {
				setIsEmotionsBarVisible(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const styleExcludedText = useCallback(() => {
		const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
		if (!view) return

		const editor = view.editor
		const content = editor.getValue()
		const styledContent = content.replace(
			/<excluded>(.*?)<\/excluded>/g,
			(match, p1) =>
				`<span style="background-color: rgba(255, 255, 0, 0.3);">${p1}</span>`,
		)

		editor.setValue(styledContent)
	}, [plugin])

	useEffect(() => {
		const interval = setInterval(styleExcludedText, 1000) // Check every second
		return () => clearInterval(interval)
	}, [styleExcludedText])

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
				generateTherapyResponse,
				fetchTherapyResponse,
				handleTherapyTypeChange,
				handleInsightFilterChange,
				handleCloseModal,
				handlePlusClick,
				handleHeartClick,
				isEmotionsBarVisible,
				toggleEmotionsBar,
				emotionsBarRef,
				vibe,
				setVibe,
				handleVibeChange,
				closeEmotionsBar,
				styleExcludedText,

				fetchMemories: (userInput: string) => fetchMemories(plugin, userInput),
				openAIMemoriesNote: () => openAIMemoriesNote(plugin),
				saveMemoriesToNote: (memories: string) =>
					saveMemoriesToNote(plugin, memories),
				getMemoriesContent: () => getMemoriesContent(plugin),
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
