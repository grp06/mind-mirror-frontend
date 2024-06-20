import React, { useState, useEffect } from 'react'
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
	const { plugin, authToken, authMessage, setAuthMessage, length, noteRange } =
		useAppContext()
	const [therapyType, setTherapyType] = useState('Cognitive Behavioral Therapy')
	const [insightFilter, setInsightFilter] = useState('Give Feedback')
	const [userInput, setUserInput] = useState('')
	const [result, setResult] = useState('')
	const [showModal, setShowModal] = useState(false)

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
			setAuthMessage('Click settings to sign in or use your OpenAI API key')
		}
	}, [authToken, setAuthMessage])

	const handleTherapyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setTherapyType(e.target.value)
	}

	const handleInsightFilterChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		setInsightFilter(e.target.value)
	}

	const handleRefresh = async () => {
		const prompt = plugin.generatePrompt(therapyType, insightFilter, length)

		try {
			const response = await plugin.fetchAndDisplayResult({
				prompt,
				userInput,
				noteRange,
			})
			setResult(response)
			setShowModal(true)
		} catch (error) {
			setResult('Error: ' + error.message)
		}
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
				<RefreshButton onClick={handleRefresh}>Refresh</RefreshButton>
				<UpdateMemoriesButton>Update Memories</UpdateMemoriesButton>
			</TherapyModal>
			<ResponseModal
				show={showModal}
				response={result}
				onClose={handleCloseModal}
			/>
		</>
	)
}

export default DropdownContainer
