import { Plugin, MarkdownView } from 'obsidian'
import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import { ReactView } from './ReactView'
import DropdownContainer from './DropdownContainer'
import SettingsTab from './SettingsTab'
import './styles.css'
import { AppProvider } from './AppContext'
import EmotionsBar from './EmotionsBar'

export default class MyPlugin extends Plugin {
	root: Root | null = null
	settings: any = {
		apiKey: '',
		length: 'one sentence',
		noteRange: 'current',
	}

	authMessage = ''

	async handleFeelingClick(feeling: string) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView)
		if (!view) return

		const editor = view.editor
		const currentContent = editor.getValue()
		const formattedFeeling = `- ${feeling}`

		let updatedContent
		if (currentContent.startsWith('# Daily Feelings')) {
			const lines = currentContent.split('\n')
			const index = lines.findIndex((line) =>
				line.startsWith('# Daily Feelings'),
			)
			lines.splice(index + 1, 0, formattedFeeling)
			updatedContent = lines.join('\n')
		} else {
			updatedContent = `# Daily Feelings\n${formattedFeeling}\n\n${currentContent}`
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
				<>
					<ReactView />
					<DropdownContainer />
					<EmotionsBar onFeelingClick={this.handleFeelingClick.bind(this)} />
				</>
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
