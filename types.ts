import { ReactNode } from 'react'
import MyPlugin from './main'

import { App as ObsidianApp } from 'obsidian'

export interface ExtendedApp extends ObsidianApp {
  setting: {
    close: () => void
  }
}

export enum ModalState {
  Initial,
  Show,
  Hide,
}
export interface AppContextProps {
  apiKey: string
  authMessage: string
  authToken: string | null
  closeEmotionsBar: () => void
  customInsightFilter: string
  customTherapyType: string
  customVibe: string
  email: string
  error: string
  fetchMemories: (userInput: string) => Promise<string>
  generatePrompt: () => string
  handleCloseModal: () => void
  handleCustomInsightFilterChange: (value: string) => void
  handleCustomTherapyTypeChange: (value: string) => void
  handleCustomVibeChange: (value: string) => void
  handleEmotionClick: (emotion: string) => void
  handleHeartClick: (advice: string) => Promise<void>
  handleInsightFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  handleLengthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  handleNoteRangeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  handlePlusClick: (advice: string) => Promise<void>
  handleShowModal: () => void
  handleTherapyTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  handleVibeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  insightFilter: string
  isCustomInsightFilter: boolean
  isCustomTherapyType: boolean
  isCustomVibe: boolean
  isEmotionsBarVisible: boolean
  isTherapistThinking: boolean
  length: string
  modalState: ModalState
  noteRange: string
  openAIMemoriesNote: () => Promise<void>
  plugin: MyPlugin
  result: string
  saveMemoriesToNote: () => Promise<void>
  setApiKey: (apiKey: string) => void
  setAuthMessage: (message: string) => void
  setAuthToken: (authToken: string | null) => void
  setCustomInsightFilter: (value: string) => void
  setCustomTherapyType: (value: string) => void
  setCustomVibe: (value: string) => void
  setEmail: (email: string) => void
  setError: (error: string) => void
  setInsightFilter: (insightFilter: string) => void
  setIsCustomInsightFilter: (isCustom: boolean) => void
  setIsCustomTherapyType: (isCustom: boolean) => void
  setIsCustomVibe: (isCustom: boolean) => void
  setLength: (length: string) => void
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>
  setNoteRange: (noteRange: string) => void
  setResult: (result: string) => void
  setTherapyType: (therapyType: string) => void
  setVibe: (vibe: string) => void
  submitCustomInsightFilter: () => void
  submitCustomTherapyType: () => void
  submitCustomVibe: () => void
  therapyType: string
  toggleEmotionsBar: () => void
  vibe: string
  memoryRange: string
  handleMemoryRangeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  errorMessage: string
  setErrorMessage: (message: string) => void
  remainingBudget: number | null
  spendingLimit: number | null
  generateTherapyResponse: () => Promise<void>
}

export interface AppProviderProps {
  plugin: MyPlugin
  children: ReactNode
}

export interface PluginSettings {
  apiKey: string
}

export interface FetchTherapyResponseParams {
  prompt: string
  userInput: string
  noteRange: string
  length: string
  vibe: string
  plugin: MyPlugin
  getAIMemoriesContent: () => Promise<string>
}

export interface TherapyResponse {
  content: string
  remaining_budget: number
  spending_limit: number
}
