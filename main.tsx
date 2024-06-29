import { Plugin, MarkdownView, TFile } from 'obsidian'
import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import DropdownContainer from './components/DropdownContainer'
import SettingsTab from './components/SettingsTab'
import { AppProvider } from './context/AppContext'
import { PluginSettings, ExtendedApp } from './types'

export default class MyPlugin extends Plugin {
	root: Root | null = null
	settings: PluginSettings = {
		apiKey: '',
		length: 'one sentence',
		noteRange: 'current',
	}

	authMessage = ''
	async getFilteredMemories(range: string): Promise<string> {
		if (range === 'none') {
			return ''
		}

		const aiMemoriesFile =
			this.app.vault.getAbstractFileByPath('AI-memories.md')
		if (!(aiMemoriesFile instanceof TFile)) {
			return ''
		}

		const content = await this.app.vault.read(aiMemoriesFile)
		const lines = content.split('\n').filter((line) => line.trim() !== '')

		if (range === 'all') {
			return content
		}

		const currentDate = new Date()
		console.log(
			'🚀 ~ MyPlugin ~ getFilteredMemories ~ currentDate:',
			currentDate,
		)
		currentDate.setHours(0, 0, 0, 0)
		const [, count] = range.match(/last(\d+)/) || []
		const daysToInclude = parseInt(count, 10) || 0
		console.log(
			'🚀 ~ MyPlugin ~ getFilteredMemories ~ daysToInclude:',
			daysToInclude,
		)

		const cutoffDate = new Date(currentDate)
		cutoffDate.setDate(currentDate.getDate() - daysToInclude)

		const filteredLines = lines.filter((line) => {
			const dateMatch = line.match(/(\d{4}-\d{2}-\d{2})$/)
			if (dateMatch) {
				const memoryDate = new Date(dateMatch[1] + 'T00:00:00')
				return memoryDate >= cutoffDate && memoryDate < currentDate
			}
			return false
		})

		console.log('Cutoff date:', cutoffDate.toISOString().split('T')[0])
		console.log('Filtered memories:', filteredLines.length)

		return filteredLines.join('\n')
	}

	async getRecentNotes(range: string): Promise<string[]> {
		const files = this.app.vault.getMarkdownFiles()
		const currentFile = this.app.workspace.getActiveFile()
		if (!currentFile) return []

		const dateRegex = /^\d{4}-\d{2}-\d{2}/
		const filteredFiles = files.filter(
			(file) => file.name.startsWith('2024') && dateRegex.test(file.name),
		)

		filteredFiles.sort((a, b) => b.stat.mtime - a.stat.mtime)

		let notesToInclude: TFile[] = []

		if (range === 'current' || range === 'just this note') {
			notesToInclude = [currentFile]
		} else {
			const [, count] = range.match(/last(\d+)/) || []
			const numNotes = parseInt(count, 10) || 1

			notesToInclude = [currentFile]
			let foundNotes = 0

			for (const file of filteredFiles) {
				if (file.path !== currentFile.path) {
					notesToInclude.push(file)
					foundNotes++
					if (foundNotes >= numNotes - 1) break
				}
			}
		}

		const noteContents = await Promise.all(
			notesToInclude.map(async (file) => {
				const content = await this.app.vault.read(file)
				return `# ${file.basename}\n\n${content}`
			}),
		)

		return noteContents
	}
	async handleEmotionClick(emotion: string) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView)
		if (!view) return

		const editor = view.editor
		const currentContent = editor.getValue()
		const formattedEmotion = `- ${emotion}`

		let updatedContent
		if (currentContent.startsWith('# Daily Emotions')) {
			const lines = currentContent.split('\n')
			const index = lines.findIndex((line) =>
				line.startsWith('# Daily Emotions'),
			)
			lines.splice(index + 1, 0, formattedEmotion)
			updatedContent = lines.join('\n')
		} else {
			updatedContent = `# Daily Emotions\n${formattedEmotion}\n\n${currentContent}`
		}

		editor.setValue(updatedContent)
		editor.setCursor({ line: 0, ch: 0 })
		editor.scrollIntoView({ from: { line: 0, ch: 0 }, to: { line: 0, ch: 0 } })
	}

	async onload() {
		await this.loadSettings()
		this.addSettingTab(new SettingsTab(this.app as ExtendedApp, this))
		const reactContainer = document.createElement('div')
		document.body.appendChild(reactContainer)
		this.root = createRoot(reactContainer)
		this.root.render(
			<AppProvider plugin={this}>
				<DropdownContainer />
			</AppProvider>,
		)
	}

	async loadSettings() {
		this.settings = Object.assign({}, this.settings, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}

	setAuthMessage(message: string) {
		this.authMessage = message
	}
}
