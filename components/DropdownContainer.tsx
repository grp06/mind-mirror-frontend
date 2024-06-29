import React, { useEffect, MouseEvent as ReactMouseEvent } from 'react'
import { useAppContext } from '../context/AppContext'
import {
	InputItem,
	Label,
	Select,
	TherapyModal,
	UpdateMemoriesButton,
	RefreshButton,
	EmotionsActionButton,
} from './StyledComponents'
import ResponseModal from './ResponseModal'
import { therapyTypes, insightFilters, vibeOptions } from '../data'
import CustomizableDropdown from './CustomizableDropdown'

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
		handleNoteRangeChange,
		toggleEmotionsBar,
		memoryRange,
		handleMemoryRangeChange,
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
	const handleCustomSubmit =
		(type: 'therapy' | 'insight' | 'vibe') => (value: string) => {
			switch (type) {
				case 'therapy':
					handleTherapyTypeChange({
						target: { value },
					} as React.ChangeEvent<HTMLSelectElement>)
					break
				case 'insight':
					handleInsightFilterChange({
						target: { value },
					} as React.ChangeEvent<HTMLSelectElement>)
					break
				case 'vibe':
					handleVibeChange({
						target: { value },
					} as React.ChangeEvent<HTMLSelectElement>)
					break
			}
		}

	const handleSaveMemories = (event: ReactMouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		saveMemoriesToNote()
	}
	return (
		<>
			{authMessage && <div>{authMessage}</div>}
			<TherapyModal>
				<CustomizableDropdown
					label="Type of Therapy"
					options={therapyTypes}
					value={therapyType}
					onChange={(value) =>
						handleTherapyTypeChange({
							target: { value },
						} as React.ChangeEvent<HTMLSelectElement>)
					}
					onCustomSubmit={handleCustomSubmit('therapy')}
					placeholder="Enter your own therapy type"
				/>
				<CustomizableDropdown
					label="Insight Filters"
					options={insightFilters}
					value={insightFilter}
					onChange={(value) =>
						handleInsightFilterChange({
							target: { value },
						} as React.ChangeEvent<HTMLSelectElement>)
					}
					onCustomSubmit={handleCustomSubmit('insight')}
					placeholder="Enter the insight you want"
				/>
				<CustomizableDropdown
					label="Vibe"
					options={vibeOptions}
					value={vibe}
					onChange={(value) =>
						handleVibeChange({
							target: { value },
						} as React.ChangeEvent<HTMLSelectElement>)
					}
					onCustomSubmit={handleCustomSubmit('vibe')}
					placeholder="Enter the therapist's vibe"
				/>
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
						<option value="as long as possible">As Long As Possible</option>
					</Select>
				</InputItem>
				<InputItem>
					<Label htmlFor="note-range-dropdown">Note Range</Label>
					<Select
						id="note-range-dropdown"
						value={noteRange}
						onChange={handleNoteRangeChange}
					>
						<option value="current">Just this note</option>
						<option value="last2">Last 2 notes</option>
						<option value="last3">Last 3 notes</option>
						<option value="last5">Last 5 notes</option>
						<option value="last10">Last 10 notes</option>
						<option value="last20">Last 20 notes</option>
					</Select>
				</InputItem>
				<InputItem>
					<Label htmlFor="memory-range-dropdown">Memory Range</Label>
					<Select
						id="memory-range-dropdown"
						value={memoryRange}
						onChange={handleMemoryRangeChange}
					>
						<option value="all">All Memories</option>
						<option value="last5">Last 5 days</option>
						<option value="last10">Last 10 days</option>
						<option value="last30">Last 30 days</option>
						<option value="none">Don't use memories</option>
					</Select>
				</InputItem>
				<RefreshButton onClick={generateTherapyResponse}>Refresh</RefreshButton>
				<UpdateMemoriesButton onClick={handleSaveMemories}>
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
