import React, { useState, useEffect } from 'react'
import MyPlugin from './main'
import { therapyTypes, insightFilters } from './data'
import {
	InputItem,
	Label,
	Select,
	TherapyModal,
	UpdateMemoriesButton,
	RefreshButton,
} from './StyledComponents'
import { MarkdownView } from 'obsidian'
import ResponseModal from './ResponseModal' // Import ResponseModal

interface DropdownContainerProps {
	plugin: MyPlugin
}

const DropdownContainer: React.FC<DropdownContainerProps> = ({ plugin }) => {
	const [therapyType, setTherapyType] = useState('')
	const [insightFilter, setInsightFilter] = useState('')
	const [userInput, setUserInput] = useState('')
	const [result, setResult] = useState('')
	const [showModal, setShowModal] = useState(false) // State to manage modal visibility

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

	const handleTherapyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedTherapyType = e.target.value
		setTherapyType(selectedTherapyType)
		console.log(`Therapy Type selected: ${selectedTherapyType}`)
	}

	const handleInsightFilterChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const selectedInsightFilter = e.target.value
		setInsightFilter(selectedInsightFilter)
		console.log(`Insight Filter selected: ${selectedInsightFilter}`)
	}

	const handleRefresh = async () => {
		console.log('Refreshing...')
		if (!plugin.settings || typeof plugin.settings.length !== 'string') {
			console.log('Error: Plugin settings not loaded or length is not a string')
			setResult('Error: Plugin settings not loaded or length is not a string')
			return
		}

		const length = plugin.settings.length
		console.log('🚀 ~ handleRefresh ~ length:', length)
		const noteRange = plugin.settings.noteRange
		console.log('🚀 ~ handleRefresh ~ noteRange:', noteRange)

		const prompt = plugin.generatePrompt(therapyType, insightFilter, length)
		console.log('🚀 ~ handleRefresh ~ prompt:', prompt)

		setResult('Fetching feedback...')

		try {
			const response = await plugin.fetchAndDisplayResult({
				prompt,
				userInput,
				noteRange,
			})
			setResult(response)
			setShowModal(true) // Show the modal when there is a response
			console.log('API Response:', response) // Log the response
		} catch (error) {
			setResult('Error: ' + error.message)
		}
	}

	return (
		<>
			<TherapyModal>
				<InputItem>
					<Label htmlFor="therapy-type-dropdown">Type of Therapy</Label>
					<Select
						id="therapy-type-dropdown"
						value={therapyType}
						onChange={handleTherapyTypeChange}
					>
						{therapyTypes.map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
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
							<option key={filter.value} value={filter.value}>
								{filter.label}
							</option>
						))}
					</Select>
				</InputItem>
				<RefreshButton onClick={handleRefresh}>Refresh</RefreshButton>
				<UpdateMemoriesButton>Update Memories</UpdateMemoriesButton>
			</TherapyModal>
			<ResponseModal show={showModal} response={result} />{' '}
			{/* Add ResponseModal */}
		</>
	)
}

export default DropdownContainer
