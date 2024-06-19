import React, { useState, useEffect } from 'react'
import { MarkdownView } from 'obsidian'
import MindMirror from './main'

interface RefreshHandlerProps {
	plugin: MindMirror
}

const RefreshHandler: React.FC<RefreshHandlerProps> = ({ plugin }) => {
	const [userInput, setUserInput] = useState('')
	const [therapyType, setTherapyType] = useState('')
	const [insightFilter, setInsightFilter] = useState('')
	const [result, setResult] = useState('')

	useEffect(() => {
		const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
		if (view) {
			setUserInput(view.editor.getValue())
			setTherapyType(
				(document.getElementById('therapy-type-dropdown') as HTMLSelectElement)
					.value,
			)
			setInsightFilter(
				(
					document.getElementById(
						'insight-filter-dropdown',
					) as HTMLSelectElement
				).value,
			)
		}
	}, [plugin])

	const handleRefresh = async () => {
		const length = plugin.settings.length
		const noteRange = plugin.settings.noteRange

		const prompt = plugin.generatePrompt(therapyType, insightFilter, length)

		const resultDiv = document.getElementById('result')
		const popup = document.getElementById('popup')
		if (resultDiv && popup) {
			resultDiv.innerText = 'Fetching feedback...'
			popup.style.display = 'block'
		}

		await plugin.fetchAndDisplayResult({
			prompt,
			userInput,
			resultElementId: 'result',
			noteRange,
		})
	}

	return (
		<div>
			<button onClick={handleRefresh}>Refresh</button>
			<div id="result">{result}</div>
			<div id="popup" style={{ display: 'none' }}>
				Popup content
			</div>
		</div>
	)
}

export default RefreshHandler
