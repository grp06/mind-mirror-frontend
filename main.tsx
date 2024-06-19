import { Plugin } from 'obsidian'
import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import { ReactView } from './ReactView'
import DropdownContainer from './DropdownContainer'
import './styles.css'

export default class MyPlugin extends Plugin {
	root: Root | null = null

	async onload() {
		// Mount React component
		const reactContainer = document.createElement('div')
		document.body.appendChild(reactContainer)
		this.root = createRoot(reactContainer)
		this.root.render(
			<>
				<ReactView />
				<DropdownContainer plugin={this} />
			</>,
		)
	}

	async fetchAndDisplayResult({
		prompt,
		userInput,
		resultElementId,
		noteRange,
	}: {
		prompt: string
		userInput: string
		resultElementId: string
		noteRange: string
	}) {
		await fetchAndDisplayResult(this, {
			prompt,
			userInput,
			resultElementId,
			noteRange,
		})
	}

	generatePrompt(
		therapyType: string,
		insightFilter: string,
		length: string,
		userFeelings: string[],
	): string {
		const feelingsString =
			userFeelings.length > 0
				? `Keep in mind, the user has gone through these feelings today: ${userFeelings.join(', ')}. You don't have to mention them. Just keep them in mind`
				: ''
		return `You are the world's top therapist, trained in ${therapyType}. Your only job is to ${insightFilter}. Your responses must always be ${length}. Don't include any formatting or bullet points.`
	}

	onunload() {
		this.root?.unmount()
	}
}
