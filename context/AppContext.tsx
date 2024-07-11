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
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem('authToken'),
  )
  const [apiKey, setApiKey] = useState(plugin.settings.apiKey)
  const [authMessage, setAuthMessage] = useState('')
  const [customInsightFilter, setCustomInsightFilter] = useState('')
  const [customTherapyType, setCustomTherapyType] = useState('')
  const [customVibe, setCustomVibe] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [insightFilter, setInsightFilter] = useState('Give Feedback')
  const [isCustomInsightFilter, setIsCustomInsightFilter] = useState(false)
  const [isCustomTherapyType, setIsCustomTherapyType] = useState(false)
  const [isCustomVibe, setIsCustomVibe] = useState(false)
  const [isEmotionsBarVisible, setIsEmotionsBarVisible] = useState(true)
  const [isTherapistThinking, setIsTherapistThinking] = useState(false)
  const [length, setLength] = useState('one sentence')
  const [memoryRange, setMemoryRange] = useState('none')
  const [modalState, setModalState] = useState<ModalState>(ModalState.Initial)
  const [noteRange, setNoteRange] = useState('')
  const [remainingBudget, setRemainingBudget] = useState<number | null>(null)
  const [result, setResult] = useState('')
  const [spendingLimit, setSpendingLimit] = useState<number | null>(null)
  const [therapyType, setTherapyType] = useState('Cognitive Behavioral Therapy')
  const [vibe, setVibe] = useState('Neutral')

  const fetchInitialBudgetData = useCallback(async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/backend/get_token_usage/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error('Failed to fetch budget data')
      }

      const data = await response.json()
      setRemainingBudget(data.remaining_budget)
      setSpendingLimit(data.spending_limit)
    } catch (error) {
      console.error('Error fetching initial budget data:', error)
      setErrorMessage('Failed to fetch budget data')
    }
  }, [authToken])

  useEffect(() => {
    if (authToken) {
      fetchInitialBudgetData()
    }
  }, [authToken, fetchInitialBudgetData])
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

      console.log('🚀 ~ generateTherapyResponse ~ result:', result)
      setRemainingBudget(result.remaining_budget)
      setSpendingLimit(result.spending_limit)
      setResult(result.content)
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
        errorMessage,
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
        handleMemoryRangeChange,
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
        memoryRange,
        modalState,
        noteRange,
        openAIMemoriesNote: () => openAIMemoriesNote(plugin),
        plugin,
        remainingBudget,
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
        setErrorMessage,
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
        spendingLimit,
        submitCustomInsightFilter,
        submitCustomTherapyType,
        submitCustomVibe,
        therapyType,
        toggleEmotionsBar,
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
