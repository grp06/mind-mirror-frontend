import { Plugin, MarkdownView } from 'obsidian'
import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import DropdownContainer from './components/DropdownContainer'
import SettingsTab from './components/SettingsTab'
import { AppProvider } from './context/AppContext'

export default class MyPlugin extends Plugin {
	root: Root | null = null
	settings: any = {
		apiKey: '',
		length: 'one sentence',
		noteRange: 'current',
	}

	authMessage = ''

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
		this.addSettingTab(new SettingsTab(this.app, this))
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
