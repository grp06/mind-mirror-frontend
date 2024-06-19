import React, { useEffect, useState } from 'react'
import { MarkdownView, Notice } from 'obsidian'
import MyPlugin from './main'

interface DropdownContainerProps {
	plugin: MyPlugin
}

const therapyTypes = [
	{
		value: 'cognitive-behavioral-therapy',
		label: 'Cognitive Behavioral Therapy',
	},
	{
		value: 'solution-focused-brief-therapy',
		label: 'Solution-Focused Brief Therapy',
	},
	{ value: 'gestalt-therapy', label: 'Gestalt Therapy' },
	{
		value: 'mindfulness-based-cognitive-therapy',
		label: 'Mindfulness-Based Cognitive Therapy',
	},
	{ value: 'psychodynamic-therapy', label: 'Psychodynamic Therapy' },
	{ value: 'humanistic-therapy', label: 'Humanistic Therapy' },
	{ value: 'existential-therapy', label: 'Existential Therapy' },
	{ value: 'interpersonal-therapy', label: 'Interpersonal Therapy' },
	{ value: 'family-systems-therapy', label: 'Family Systems Therapy' },
	{ value: 'somatic-experience', label: 'Somatic Experience' },
]

const insightFilters = [
	{ value: 'find-blindspots', label: 'Find Blindspots' },
	{ value: 'give-feedback', label: 'Give Feedback' },
	{ value: 'challenge-assumptions', label: 'Challenge Assumptions' },
	{ value: 'identify-patterns', label: 'Identify Patterns' },
	{ value: 'give-journaling-prompt', label: 'Give Journaling Prompt' },
	{ value: 'detect-sentiment', label: 'Detect Sentiment' },
	{ value: 'detect-underlying-emotions', label: 'Detect Underlying Emotions' },
	{ value: 'generate-insights', label: 'Generate Insights' },
	{ value: 'narrative-reframing', label: 'Narrative Reframing' },
	{ value: 'action-planning', label: 'Action Planning' },
]

const DropdownContainer: React.FC<DropdownContainerProps> = ({ plugin }) => {
	const [therapyType, setTherapyType] = useState('')
	const [insightFilter, setInsightFilter] = useState('')

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

	return (
		<div id="dropdown-container">
			<div className="therapy-label-wrapper">
				<label htmlFor="therapy-type-dropdown">Type of Therapy</label>
				<select
					id="therapy-type-dropdown"
					value={therapyType}
					onChange={handleTherapyTypeChange}
				>
					{therapyTypes.map((type) => (
						<option key={type.value} value={type.value}>
							{type.label}
						</option>
					))}
				</select>
			</div>
			<label htmlFor="insight-filter-dropdown">Insight Filter</label>
			<select
				id="insight-filter-dropdown"
				value={insightFilter}
				onChange={handleInsightFilterChange}
			>
				{insightFilters.map((filter) => (
					<option key={filter.value} value={filter.value}>
						{filter.label}
					</option>
				))}
			</select>
			<button id="update-memories-button">Update Memories</button>
		</div>
	)
}

export default DropdownContainer
