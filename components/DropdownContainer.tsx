import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import {
	InputItem,
	Label,
	Select,
	TherapyModal,
	UpdateMemoriesButton,
	RefreshButton,
	ActionButton,
	EmotionsActionButton,
} from './StyledComponents'
import ResponseModal from './ResponseModal'
import { therapyTypes, insightFilters, vibeOptions } from '../data'

const DropdownContainer: React.FC = () => {
	const {
		plugin,
		authToken,
		authMessage,
		setAuthMessage,
		therapyType,
		insightFilter,
		updateUserInput,
		generateTherapyResponse,
		handleTherapyTypeChange,
		handleInsightFilterChange,
		saveMemoriesToNote,
		vibe,
		handleVibeChange,
		length,
		handleLengthChange,
		noteRange,
		setNoteRange,
		toggleEmotionsBar,
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
				<InputItem>
					<Label htmlFor="vibe-dropdown">Vibe</Label>
					<Select id="vibe-dropdown" value={vibe} onChange={handleVibeChange}>
						{vibeOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</Select>
				</InputItem>
				<InputItem>
					<Label htmlFor="length-dropdown">Length</Label>
					<Select
						id="length-dropdown"
						value={length}
						onChange={handleLengthChange}
					>
						<option value="one sentence">One Sentence</option>
						<option value="three sentences">Three Sentences</option>
						<option value="one paragraph">One Paragraph</option>
					</Select>
				</InputItem>
				<InputItem>
					<Label htmlFor="note-range-dropdown">Note Range</Label>
					<Select
						id="note-range-dropdown"
						value={noteRange}
						onChange={(e) => setNoteRange(e.target.value)}
					>
						<option value="current">Just this note</option>
						<option value="last2">Last 2 notes</option>
						<option value="last3">Last 3 notes</option>
						<option value="last5">Last 5 notes</option>
						<option value="last10">Last 10 notes</option>
						<option value="last20">Last 20 notes</option>
					</Select>
				</InputItem>
				<RefreshButton onClick={generateTherapyResponse}>Refresh</RefreshButton>
				<UpdateMemoriesButton onClick={saveMemoriesToNote}>
					Update Memories
				</UpdateMemoriesButton>
				<EmotionsActionButton onClick={toggleEmotionsBar}>
					🫀
				</EmotionsActionButton>
			</TherapyModal>
			<ResponseModal />
		</>
	)
}

export default DropdownContainer
