import React, {
	useEffect,
	useState,
	MouseEvent as ReactMouseEvent,
} from 'react'
import { useAppContext } from '../context/AppContext'
import {
	InputItem,
	Label,
	Select,
	TherapyModal,
	UpdateMemoriesButton,
	RefreshButton,
	EmotionsActionButton,
	AdvancedSettingsToggle,
	AdvancedSettingsContainer,
	ArrowIcon,
	AdvancedText,
	ProgressBarContainer,
	ProgressBarFill,
	ProgressBarText,
} from './StyledComponents'
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import ResponseModal from './ResponseModal'
import { therapyTypes, insightFilters, vibeOptions } from '../data'
import CustomizableDropdown from './CustomizableDropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DropdownContainer: React.FC = () => {
	const {
		authMessage,
		authToken,
		generateTherapyResponse,
		handleInsightFilterChange,
		handleLengthChange,
		handleMemoryRangeChange,
		handleNoteRangeChange,
		handleTherapyTypeChange,
		handleVibeChange,
		insightFilter,
		length,
		memoryRange,
		noteRange,
		plugin,
		saveMemoriesToNote,
		setAuthMessage,
		therapyType,
		toggleEmotionsBar,
		vibe,
		remainingBudget,
		spendingLimit,
	} = useAppContext()

	const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

	const toggleAdvancedSettings = () => {
		setIsAdvancedOpen(!isAdvancedOpen)
	}

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

	const calculateBudgetPercentage = () => {
		console.log(
			'🚀 ~ calculateBudgetPercentage ~ remainingBudget:',
			remainingBudget
		)
		console.log(
			'🚀 ~ calculateBudgetPercentage ~ spendingLimit:',
			spendingLimit
		)
		if (
			typeof spendingLimit === 'number' &&
			typeof remainingBudget === 'number' &&
			spendingLimit !== 0
		) {
			return ((spendingLimit - remainingBudget) / spendingLimit) * 100
		}
		return 0 // Default to 0 if we can't calculate a valid percentage
	}

	const budgetPercentage = calculateBudgetPercentage()
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

				{isAdvancedOpen && (
					<AdvancedSettingsContainer>
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
						<UpdateMemoriesButton onClick={handleSaveMemories}>
							Update Memories
						</UpdateMemoriesButton>
					</AdvancedSettingsContainer>
				)}
				<RefreshButton onClick={generateTherapyResponse}>Refresh</RefreshButton>
				<ProgressBarContainer>
					<ProgressBarFill percentage={budgetPercentage} />
					<ProgressBarText>{budgetPercentage.toFixed(2)}% used</ProgressBarText>
				</ProgressBarContainer>
				<EmotionsActionButton onClick={toggleEmotionsBar}>
					🫀
				</EmotionsActionButton>
				<AdvancedText>
					{isAdvancedOpen ? 'hide' : 'show'} advanced options
				</AdvancedText>
				<ArrowIcon $isOpen={isAdvancedOpen} onClick={toggleAdvancedSettings}>
					<FontAwesomeIcon icon={isAdvancedOpen ? faCaretDown : faCaretRight} />
				</ArrowIcon>
			</TherapyModal>
			<ResponseModal />
		</>
	)
}

export default DropdownContainer
