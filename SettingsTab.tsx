import React, { useState, useEffect } from 'react'
import { App, PluginSettingTab, Notice } from 'obsidian'
import { createRoot } from 'react-dom/client'
import MyPlugin from './main'
import EmailModal from './EmailModal'
import {
	Wrapper,
	InputItem,
	Label,
	Input,
	Select,
	ButtonContainer,
	Button,
	SaveButton,
} from './StyledComponents'

interface SettingsTabProps {
	plugin: MyPlugin
}

const SettingsTabContent: React.FC<SettingsTabProps> = ({ plugin }) => {
	const [apiKey, setApiKey] = useState(plugin.settings.apiKey)
	const [length, setLength] = useState(plugin.settings.length)
	const [noteRange, setNoteRange] = useState(plugin.settings.noteRange)
	const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'))
	const [isModalOpen, setIsModalOpen] = useState(false) // Modal state

	useEffect(() => {
		const saveSettings = async () => {
			plugin.settings.apiKey = apiKey
			plugin.settings.length = length
			plugin.settings.noteRange = noteRange
			await plugin.saveSettings()
		}
		saveSettings()
	}, [apiKey, length, noteRange, plugin])

	const handleSaveButtonClick = async () => {
		await plugin.saveSettings()
		plugin.app.setting.close()
	}

	const handleAuthButtonClick = () => {
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	return (
		<Wrapper>
			<h2>Mind Mirror Settings</h2>
			<InputItem>
				<Label>API Key</Label>
				<Input
					type="text"
					value={apiKey}
					onChange={(e) => setApiKey(e.target.value)}
					placeholder="Enter your API key"
				/>
			</InputItem>
			<InputItem>
				<Label>Length</Label>
				<Select value={length} onChange={(e) => setLength(e.target.value)}>
					<option value="one sentence">One Sentence</option>
					<option value="three sentences">Three Sentences</option>
					<option value="one paragraph">One Paragraph</option>
				</Select>
			</InputItem>
			<InputItem>
				<Label>Note Range</Label>
				<Select
					value={noteRange}
					onChange={(e) => setNoteRange(e.target.value)}
				>
					<option value="current">Just this note</option>
					<option value="last2">Last 2 notes</option>
					<option value="last3">Last 3 notes</option>
					<option value="last5">Last 5 notes</option>
					<option value="last10">Last 10 notes</option>
					<option value="last20">Last 20 notes</option>
				</Select>
			</InputItem>
			<ButtonContainer>
				<Button onClick={handleAuthButtonClick}>
					{authToken ? 'Sign Out' : 'Authenticate'}
				</Button>
				<SaveButton onClick={handleSaveButtonClick}>Save Settings</SaveButton>
			</ButtonContainer>
			<EmailModal isOpen={isModalOpen} onClose={handleCloseModal} />
		</Wrapper>
	)
}

export default class SettingsTab extends PluginSettingTab {
	plugin: MyPlugin

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this
		containerEl.empty()
		createRoot(containerEl).render(<SettingsTabContent plugin={this.plugin} />)
	}
}
