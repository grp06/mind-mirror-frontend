import React, { useEffect } from 'react'
import { useAppContext } from './AppContext'
import {
	InputItem,
	Label,
	Select,
	TherapyModal,
	UpdateMemoriesButton,
	RefreshButton,
} from './StyledComponents'
import ResponseModal from './ResponseModal'
import { therapyTypes, insightFilters } from './data'

const DropdownContainer: React.FC = () => {
	const {
		plugin,
		authToken,
		authMessage,
		setAuthMessage,
		therapyType,
		insightFilter,
		updateUserInput,
		handleFetchResult,
		handleRefresh,
		handleTherapyTypeChange,
		handleInsightFilterChange,
		saveMemoriesToNote,
		getMemoriesContent, // Add this line
	} = useAppContext()

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

	const handleSaveMemories = async () => {
		const memories = await getMemoriesContent() // Fetch actual memories content
		console.log('🚀 ~ handleSaveMemories ~ memories:', memories)
		await saveMemoriesToNote(memories)
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
				<button onClick={handleSaveMemories}>Save Memories</button>
			</TherapyModal>
			<ResponseModal />
		</>
	)
}

export default DropdownContainer
