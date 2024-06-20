import { Plugin, MarkdownView, TFile } from 'obsidian'
import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import { ReactView } from './ReactView'
import DropdownContainer from './DropdownContainer'
import SettingsTab from './SettingsTab' // Ensure correct import
import './styles.css'
import { fetchAndDisplayResult, fetchMemories } from './apiHandler'

export default class MyPlugin extends Plugin {
	root: Root | null = null
	settings: any = {
		apiKey: '',
		length: 'one sentence',
		noteRange: 'current',
	}

	async onload() {
		await this.loadSettings()
		this.addSettingTab(new SettingsTab(this.app, this)) // Ensure correct usage
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

	async loadSettings() {
		this.settings = Object.assign({}, this.settings, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}

	async fetchAndDisplayResult({
		prompt,
		userInput,
		noteRange,
	}: {
		prompt: string
		userInput: string
		noteRange: string
	}): Promise<string> {
		return await fetchAndDisplayResult(this, {
			prompt,
			userInput,
			noteRange,
		})
	}

	async getAIMemoriesContent(): Promise<string> {
		const aiMemoriesPath = 'AI-memories.md'
		const aiMemoriesFile = this.app.vault.getAbstractFileByPath(aiMemoriesPath)
		if (aiMemoriesFile instanceof TFile) {
			return await this.app.vault.read(aiMemoriesFile)
		}
		return ''
	}

	async fetchMemories(userInput: string): Promise<string> {
		const aiMemoriesPath = 'AI-memories.md'
		const aiMemoriesFile = this.app.vault.getAbstractFileByPath(aiMemoriesPath)
		let aiMemoriesContent = ''

		if (aiMemoriesFile instanceof TFile) {
			aiMemoriesContent = await this.app.vault.read(aiMemoriesFile)
			console.log(
				'🚀 ~ MyPlugin ~ fetchMemories ~ aiMemoriesContent:',
				aiMemoriesContent,
			)
		}

		return await fetchMemories(this, userInput, aiMemoriesContent)
	}

	async openAIMemoriesNote() {
		const notePath = 'AI-memories.md'
		const memoryFile = this.app.vault.getAbstractFileByPath(notePath)

		if (memoryFile instanceof TFile) {
			const leaf = this.app.workspace.getLeaf(true)
			await leaf.openFile(memoryFile)
		}
	}

	generatePrompt(
		therapyType: string,
		insightFilter: string,
		length: string,
	): string {
		return `You are the world's top therapist, trained in ${therapyType}. Your only job is to ${insightFilter}. Your responses must always be ${length}.`
	}

	onunload() {
		this.root?.unmount()
	}
}
