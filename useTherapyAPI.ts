import { useState, useCallback } from 'react'
import { apiHandler } from './apiHandler'

export const useTherapyApi = (authToken: string) => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const generateTherapyResponse = useCallback(
		async (therapyType: string, insightFilter: string, vibe: string) => {
			setIsLoading(true)
			setError(null)
			try {
				const response = await apiHandler.generateTherapyResponse(
					authToken,
					therapyType,
					insightFilter,
					vibe,
				)
				setIsLoading(false)
				return response
			} catch (err) {
				setError(err.message)
				setIsLoading(false)
			}
		},
		[authToken],
	)

	const saveMemoriesToNote = useCallback(
		async (memories: string) => {
			setIsLoading(true)
			setError(null)
			try {
				await apiHandler.saveMemoriesToNote(authToken, memories)
				setIsLoading(false)
			} catch (err) {
				setError(err.message)
				setIsLoading(false)
			}
		},
		[authToken],
	)

	return {
		isLoading,
		error,
		generateTherapyResponse,
		saveMemoriesToNote,
	}
}
