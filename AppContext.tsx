import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from 'react'
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
	const [isEmotionsBarVisible, setIsEmotionsBarVisible] = useState(true)
	const [vibe, setVibe] = useState('Neutral')

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
		setIsEmotionsBarVisible((prev) => !prev)
	}, [])

	const closeEmotionsBar = useCallback(() => {
		setIsEmotionsBarVisible(false)
	}, [])

	const handleEmotionClick = useCallback(
		(emotion: string) => {
			const now = new Date()
			const formattedTime = now.toLocaleTimeString([], {
				hour: 'numeric',
				minute: '2-digit',
			})
			const formattedEmotion = `${emotion} - ${formattedTime}`
			plugin.handleEmotionClick(formattedEmotion)
		},
		[plugin],
	)

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

				vibe,
				setVibe,
				handleVibeChange,
				isEmotionsBarVisible,
				toggleEmotionsBar,
				closeEmotionsBar,
				handleEmotionClick,

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
