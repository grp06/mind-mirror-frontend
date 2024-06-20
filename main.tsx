import { Plugin, MarkdownView, TFile } from 'obsidian'
import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import { ReactView } from './ReactView'
import DropdownContainer from './DropdownContainer'
import SettingsTab from './SettingsTab'
import './styles.css'
import { AppProvider } from './AppContext' // Import AppProvider

export default class MyPlugin extends Plugin {
	root: Root | null = null
	settings: any = {
		apiKey: '',
		length: 'one sentence',
		noteRange: 'current',
	}

	authMessage = ''

	async onload() {
		await this.loadSettings()
		this.addSettingTab(new SettingsTab(this.app, this))
		const reactContainer = document.createElement('div')
		document.body.appendChild(reactContainer)
		this.root = createRoot(reactContainer)
		this.root.render(
			<AppProvider plugin={this}>
				<ReactView />
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
