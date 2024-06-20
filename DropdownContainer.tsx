import React, { useEffect } from 'react'
import { useAppContext } from './AppContext'
import { therapyTypes, insightFilters } from './data'
import {
	InputItem,
	Label,
	Select,
	TherapyModal,
	UpdateMemoriesButton,
	RefreshButton,
} from './StyledComponents'
import ResponseModal from './ResponseModal'
import { MarkdownView } from 'obsidian'

const DropdownContainer: React.FC = () => {
	const {
		plugin,
		authToken,
		authMessage,
		setAuthMessage,
		length,
		noteRange,
		fetchAndDisplayResult,
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
	} = useAppContext()

	const updateUserInput = () => {
		const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
		if (view) {
			setUserInput(view.editor.getValue())
		} else {
			setUserInput('')
		}
	}

	useEffect(() => {
		updateUserInput()
		const onActiveLeafChange = () => updateUserInput()
		plugin.app.workspace.on('active-leaf-change', onActiveLeafChange)
		return () => {
			plugin.app.workspace.off('active-leaf-change', onActiveLeafChange)
		}
	}, [plugin])

	useEffect(() => {
		if (!authToken) {
			setAuthMessage('Please authenticate')
		}
	}, [authToken, setAuthMessage])

	const handleFetchResult = async () => {
		try {
			const prompt = plugin.generatePrompt(therapyType, insightFilter, length)
			const result = await fetchAndDisplayResult({
				prompt,
				userInput,
				noteRange,
			})
			setResult(result)
			setShowModal(true)
		} catch (error) {
			console.error('Error fetching result:', error)
			// Handle the error appropriately (e.g., show an error message)
		}
	}

	const handleRefresh = async () => {
		try {
			updateUserInput()
			const prompt = plugin.generatePrompt(therapyType, insightFilter, length)
			const result = await fetchAndDisplayResult({
				prompt,
				userInput,
				noteRange,
			})
			setResult(result)
			setShowModal(true)
		} catch (error) {
			console.error('Error refreshing result:', error)
			// Handle the error appropriately (e.g., show an error message)
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

	return (
		<>
			{authMessage && <div>{authMessage}</div>}
			<TherapyModal>
				<InputItem>
					<Label htmlFor="therapy-type-dropdown">Type of Therapy</Label>
					<Select
						id="therapy-type-dropdown"
						value={therapyType}
						onChange={handleTherapyTypeChange}
					>
						{therapyTypes.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</Select>
				</InputItem>
				<InputItem>
					<Label htmlFor="insight-filter-dropdown">Insight Filter</Label>
					<Select
						id="insight-filter-dropdown"
						value={insightFilter}
						onChange={handleInsightFilterChange}
					>
						{insightFilters.map((filter) => (
							<option key={filter} value={filter}>
								{filter}
							</option>
						))}
					</Select>
				</InputItem>
				<UpdateMemoriesButton onClick={handleFetchResult}>
					Update Memories
				</UpdateMemoriesButton>
				<RefreshButton onClick={handleRefresh}>Refresh</RefreshButton>
			</TherapyModal>
			{showModal && (
				<ResponseModal
					show={showModal}
					result={result}
					onClose={handleCloseModal}
				/>
			)}
		</>
	)
}

export default DropdownContainer
