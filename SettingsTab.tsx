import React, { useState, useEffect } from 'react'
import { App, PluginSettingTab, Notice } from 'obsidian'
import { createRoot } from 'react-dom/client'
import MyPlugin from './main'
import EmailModalWrapper from './EmailModalWrapper'
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
	console.log('🚀 ~ authToken:', authToken)

	useEffect(() => {
		const saveSettings = async () => {
			plugin.settings.apiKey = apiKey
			plugin.settings.length = length
			plugin.settings.noteRange = noteRange
			await plugin.saveSettings()
		}
		saveSettings()
	}, [apiKey, length, noteRange, plugin])

	const handleAuthButtonClick = async () => {
		if (authToken) {
			try {
				const response = await fetch('http://127.0.0.1:8000/backend/signout/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${authToken}`,
					},
				})
				if (response.ok) {
					localStorage.removeItem('authToken')
					setAuthToken(null)
					new Notice('Signed out successfully')
				} else {
					const error = await response.json()
					console.error('Sign out failed:', error)
					new Notice('Sign out failed')
				}
			} catch (error) {
				console.error('Sign out failed:', error)
				new Notice('Sign out failed')
			}
		} else {
			const modalContainer = document.createElement('div')
			document.body.appendChild(modalContainer)

			const handleClose = () => {
				document.body.removeChild(modalContainer)
			}

			createRoot(modalContainer).render(
				<EmailModalWrapper
					onSubmit={async (username, password, isSignUp) => {
						try {
							const endpoint = isSignUp
								? '/backend/signup/'
								: '/backend/signin/'
							const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({ username, password }),
							})
							if (response.ok) {
								const data = await response.json()
								localStorage.setItem('authToken', data.token)
								setAuthToken(data.token)
								new Notice('Authenticated successfully')
								handleClose()
								return true
							} else {
								const error = await response.json()
								console.error('Authentication failed:', error)
								new Notice('Authentication failed')
								return false
							}
						} catch (error) {
							console.error('Authentication failed:', error)
							new Notice('Authentication failed')
							return false
						}
					}}
					isSignUp={false} // Set to true for sign-up, false for sign-in
					onClose={handleClose}
				/>,
			)
		}
	}

	const handleSaveButtonClick = async () => {
		await plugin.saveSettings()
		plugin.app.setting.close()
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
				<Input
					type="number"
					value={length}
					onChange={(e) => setLength(parseInt(e.target.value))}
					placeholder="Enter the length"
				/>
			</InputItem>
			<InputItem>
				<Label>Note Range</Label>
				<Select
					value={noteRange}
					onChange={(e) => setNoteRange(e.target.value)}
				>
					<option value="all">All Notes</option>
					<option value="current">Current Note</option>
				</Select>
			</InputItem>
			<ButtonContainer>
				<Button onClick={handleAuthButtonClick}>
					{authToken ? 'Sign Out' : 'Authenticate'}
				</Button>
				<SaveButton onClick={handleSaveButtonClick}>Save Settings</SaveButton>
			</ButtonContainer>
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
