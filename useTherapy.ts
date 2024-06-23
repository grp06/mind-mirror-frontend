import { useState, useCallback } from 'react'
import { useAppContext } from '../AppContext'
import { fetchTherapyResponse, fetchMemories } from '../api/therapyService'

export const useTherapy = () => {
	const { plugin, getAIMemoriesContent } = useAppContext()
	const [result, setResult] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const generateTherapyResponse = useCallback(
		async (params: FetchTherapyResponseParams) => {
			setIsLoading(true)
			setError(null)
			try {
				const response = await fetchTherapyResponse(
					plugin,
					params,
					getAIMemoriesContent,
				)
				setResult(response)
			} catch (err) {
				setError(err.message)
			} finally {
				setIsLoading(false)
			}
		},
		[plugin, getAIMemoriesContent],
	)

	const retrieveMemories = useCallback(
		async (userInput: string) => {
			setIsLoading(true)
			setError(null)
			try {
				const memories = await fetchMemories(
					plugin,
					userInput,
					getAIMemoriesContent,
				)
				return memories
			} catch (err) {
				setError(err.message)
			} finally {
				setIsLoading(false)
			}
		},
		[plugin, getAIMemoriesContent],
	)

	return { result, isLoading, error, generateTherapyResponse, retrieveMemories }
}
