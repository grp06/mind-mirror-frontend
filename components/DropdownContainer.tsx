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
import { CustomInputWrapper, CustomInput } from './StyledComponents'

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
		isCustomTherapyType,
		isCustomInsightFilter,
		isCustomVibe,
		setIsCustomTherapyType,
		setIsCustomInsightFilter,
		setIsCustomVibe,
		handleCustomTherapyTypeChange,
		handleCustomInsightFilterChange,
		handleCustomVibeChange,
		submitCustomTherapyType,
		submitCustomInsightFilter,
		submitCustomVibe,
		customTherapyType,
		customInsightFilter,
		customVibe,
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

	const renderCustomInput = (
		value: string,
		onChange: (value: string) => void,
		onSubmit: () => void,
	) => (
		<CustomInputWrapper>
			<CustomInput
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
			/>
			<button onClick={onSubmit}>✓</button>
		</CustomInputWrapper>
	)

	return (
		<>
			{authMessage && <div>{authMessage}</div>}
			<TherapyModal>
				<InputItem>
					<Label htmlFor="therapy-type-dropdown">Type of Therapy</Label>
					{isCustomTherapyType ? (
						<CustomInputWrapper>
							<CustomInput
								value={customTherapyType}
								onChange={(e) => handleCustomTherapyTypeChange(e.target.value)}
								onKeyPress={(e) =>
									e.key === 'Enter' && submitCustomTherapyType()
								}
							/>
							<button onClick={submitCustomTherapyType}>✓</button>
						</CustomInputWrapper>
					) : (
						<Select
							id="therapy-type-dropdown"
							value={therapyType}
							onChange={(e) => {
								if (e.target.value === 'Add my own') {
									setIsCustomTherapyType(true)
								} else {
									handleTherapyTypeChange(e)
								}
							}}
						>
							{therapyTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
							{!therapyTypes.includes(therapyType) && (
								<option key={therapyType} value={therapyType}>
									{therapyType}
								</option>
							)}
						</Select>
					)}
				</InputItem>
				<InputItem>
					<Label htmlFor="insight-filters-dropdown">Insight Filters</Label>
					{isCustomInsightFilter ? (
						<CustomInputWrapper>
							<CustomInput
								value={customInsightFilter}
								onChange={(e) =>
									handleCustomInsightFilterChange(e.target.value)
								}
								onKeyPress={(e) =>
									e.key === 'Enter' && submitCustomInsightFilter()
								}
							/>
							<button onClick={submitCustomInsightFilter}>✓</button>
						</CustomInputWrapper>
					) : (
						<Select
							id="insight-filters-dropdown"
							value={insightFilter}
							onChange={(e) => {
								if (e.target.value === 'Add my own') {
									setIsCustomInsightFilter(true)
								} else {
									handleInsightFilterChange(e)
								}
							}}
						>
							{insightFilters.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
							{!insightFilters.includes(insightFilter) && (
								<option key={insightFilter} value={insightFilter}>
									{insightFilter}
								</option>
							)}
						</Select>
					)}
				</InputItem>
				<InputItem>
					<Label htmlFor="vibe-dropdown">Vibe</Label>
					{isCustomVibe ? (
						<CustomInputWrapper>
							<CustomInput
								value={customVibe}
								onChange={(e) => handleCustomVibeChange(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && submitCustomVibe()}
							/>
							<button onClick={submitCustomVibe}>✓</button>
						</CustomInputWrapper>
					) : (
						<Select
							id="vibe-dropdown"
							value={vibe}
							onChange={(e) => {
								if (e.target.value === 'Add my own') {
									setIsCustomVibe(true)
								} else {
									handleVibeChange(e)
								}
							}}
						>
							{vibeOptions.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
							{!vibeOptions.includes(vibe) && (
								<option key={vibe} value={vibe}>
									{vibe}
								</option>
							)}
						</Select>
					)}
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
