import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from 'react'
import { fetchTherapyResponse } from '../utils/fetchTherapyResponse'
import {
	fetchMemories,
	openAIMemoriesNote,
	saveMemoriesToNote,
} from '../utils/memoryUtils'
import { AppContextProps, AppProviderProps, ModalState } from '../types'

import {
	handlePlusClick as handlePlusClickUI,
	handleHeartClick as handleHeartClickUI,
} from '../utils/uiInteractions'

import { MarkdownView } from 'obsidian'

const AppContext = createContext<AppContextProps | undefined>(undefined)

export const AppProvider: React.FC<AppProviderProps> = ({
	plugin,
	children,
}) => {
	const [apiKey, setApiKey] = useState(plugin.settings.apiKey)
	const [noteRange, setNoteRange] = useState(plugin.settings.noteRange)
	const [authToken, setAuthToken] = useState<string | null>(
		localStorage.getItem('authToken')
	)
	const [memoryRange, setMemoryRange] = useState('all')
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [therapyType, setTherapyType] = useState('Cognitive Behavioral Therapy')
	const [insightFilter, setInsightFilter] = useState('Give Feedback')
	const [result, setResult] = useState('')
	const [modalState, setModalState] = useState<ModalState>(ModalState.Initial)
	const [authMessage, setAuthMessage] = useState('')
	const [length, setLength] = useState(plugin.settings.length)
	const [isEmotionsBarVisible, setIsEmotionsBarVisible] = useState(true)
	const [vibe, setVibe] = useState('Neutral')
	const [customTherapyType, setCustomTherapyType] = useState('')
	const [customInsightFilter, setCustomInsightFilter] = useState('')
	const [customVibe, setCustomVibe] = useState('')
	const [isCustomTherapyType, setIsCustomTherapyType] = useState(false)
	const [isCustomInsightFilter, setIsCustomInsightFilter] = useState(false)
	const [isCustomVibe, setIsCustomVibe] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [isTherapistThinking, setIsTherapistThinking] = useState(false)

	useEffect(() => {
		plugin.settings.length = length
		plugin.saveSettings()
	}, [length, plugin])

	const generateTherapyResponse = async () => {
		try {
			const prompt = generatePrompt()
			setIsTherapistThinking(true)
			setModalState(ModalState.Show)
			setErrorMessage('')

			const result = await fetchTherapyResponse({
				prompt,
				noteRange,
				vibe,
				length,
				plugin,
				memoryRange,
			})
			setResult(result)
			setModalState(ModalState.Show)
		} catch (error) {
			console.error('Error generating therapy response:', error)
			setErrorMessage(error.message || 'Failed to generate response')
		} finally {
			setIsTherapistThinking(false)
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
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		setInsightFilter(e.target.value)
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
		[plugin]
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

	const handleCustomTherapyTypeChange = (value: string) => {
		setCustomTherapyType(value)
	}

	const submitCustomTherapyType = () => {
		if (customTherapyType.trim() !== '') {
			setTherapyType(customTherapyType)
			setIsCustomTherapyType(false)
		}
	}

	const handleCustomInsightFilterChange = (value: string) => {
		setCustomInsightFilter(value)
	}

	const handleCustomVibeChange = (value: string) => {
		setCustomVibe(value)
	}

	const submitCustomInsightFilter = () => {
		setInsightFilter(customInsightFilter)
		setIsCustomInsightFilter(false)
	}

	const submitCustomVibe = () => {
		setVibe(customVibe)
		setIsCustomVibe(false)
	}

	const handleNoteRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newNoteRange = e.target.value
		setNoteRange(newNoteRange)
		plugin.settings.noteRange = newNoteRange
		plugin.saveSettings()
	}

	const handleMemoryRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setMemoryRange(e.target.value)
	}

	return (
		<AppContext.Provider
			value={{
				apiKey,
				authMessage,
				authToken,
				closeEmotionsBar,
				customInsightFilter,
				customTherapyType,
				customVibe,
				email,
				error,
				fetchMemories: (userInput: string) => fetchMemories(plugin, userInput),
				generatePrompt,
				generateTherapyResponse,
				handleCloseModal,
				handleCustomInsightFilterChange,
				handleCustomTherapyTypeChange,
				handleCustomVibeChange,
				handleEmotionClick,
				handleHeartClick,
				handleInsightFilterChange,
				handleLengthChange,
				handleNoteRangeChange,
				handlePlusClick,
				handleShowModal,
				handleTherapyTypeChange,
				handleVibeChange,
				insightFilter,
				isCustomInsightFilter,
				isCustomTherapyType,
				isCustomVibe,
				isEmotionsBarVisible,
				isTherapistThinking,
				length,
				modalState,
				noteRange,
				openAIMemoriesNote: () => openAIMemoriesNote(plugin),
				plugin,
				result,
				saveMemoriesToNote: () => saveMemoriesToNote(plugin),
				setApiKey,
				setAuthMessage,
				setAuthToken,
				setCustomInsightFilter,
				setCustomTherapyType,
				setCustomVibe,
				setEmail,
				setError,
				setInsightFilter,
				setIsCustomInsightFilter,
				setIsCustomTherapyType,
				setIsCustomVibe,
				setLength,
				setModalState,
				setNoteRange,
				setResult,
				setTherapyType,
				setVibe,
				submitCustomInsightFilter,
				submitCustomTherapyType,
				submitCustomVibe,
				therapyType,
				toggleEmotionsBar,
				vibe,
				memoryRange,
				handleMemoryRangeChange,
				errorMessage,
				setErrorMessage,
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
