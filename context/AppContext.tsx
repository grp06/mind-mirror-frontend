import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from 'react'
import { fetchTherapyResponse as fetchTherapyResponseAPI } from '../utils/fetchTherapyResponse'
import {
	fetchMemories,
	openAIMemoriesNote,
	saveMemoriesToNote,
	getAIMemoriesContent,
} from '../utils/memoryUtils'
import {
	AppContextProps,
	AppProviderProps,
	FetchTherapyResponseParams,
	ModalState,
} from '../types'

import {
	updateUserInput as updateUserInputUI,
	handlePlusClick as handlePlusClickUI,
	handleHeartClick as handleHeartClickUI,
} from '../utils/uiInteractions'

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
	const [modalState, setModalState] = useState<ModalState>(ModalState.Initial)

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
		setModalState(ModalState.Show)
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
			setModalState(ModalState.Show)
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

	const handleLengthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newLength = e.target.value
		setLength(newLength)
		plugin.settings.length = newLength
		plugin.saveSettings()
	}
	const handleCloseModal = useCallback(() => {
		setModalState(ModalState.Hide)
	}, [])

	const handleShowModal = useCallback(() => {
		setModalState(ModalState.Show)
	}, [])
	return (
		<AppContext.Provider
			value={{
				apiKey,
				authMessage,
				authToken,
				closeEmotionsBar,
				email,
				error,
				fetchMemories: (userInput: string) => fetchMemories(plugin, userInput),
				fetchTherapyResponse,
				generatePrompt,
				generateTherapyResponse,
				handleEmotionClick,
				handleHeartClick,
				handleCloseModal,
				handleShowModal,
				handleInsightFilterChange,
				handleLengthChange,
				handlePlusClick,
				handleTherapyTypeChange,
				handleVibeChange,
				insightFilter,
				isEmotionsBarVisible,
				length,
				modalState,
				noteRange,
				openAIMemoriesNote: () => openAIMemoriesNote(plugin),
				plugin,
				result,
				saveMemoriesToNote: (memories: string) => saveMemoriesToNote(plugin),
				setApiKey,
				setAuthMessage,
				setAuthToken,
				setEmail,
				setError,
				setInsightFilter,
				setLength,
				setModalState,
				setNoteRange,
				setResult,
				setTherapyType,
				setUserInput,
				setVibe,
				therapyType,
				toggleEmotionsBar,
				updateUserInput,
				userInput,
				vibe,
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
