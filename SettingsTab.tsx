import React, { useState, useEffect } from 'react'
import { App, PluginSettingTab, Notice } from 'obsidian'
import { createRoot, Root } from 'react-dom/client'
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
	EmailDisplay,
} from './StyledComponents'

interface SettingsTabProps {
	plugin: MyPlugin
}

const SettingsTabContent: React.FC<SettingsTabProps> = ({ plugin }) => {
	const [apiKey, setApiKey] = useState(plugin.settings.apiKey)
	const [length, setLength] = useState(plugin.settings.length)
	const [noteRange, setNoteRange] = useState(plugin.settings.noteRange)
	const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'))
	const [email, setEmail] = useState('') // Add email state
	const [password, setPassword] = useState('') // Add password state
	const [repeatPassword, setRepeatPassword] = useState('') // Add repeatPassword state
	const [error, setError] = useState('') // Add error state
	const [isModalOpen, setIsModalOpen] = useState(false)

	useEffect(() => {
		const saveSettings = async () => {
			plugin.settings.apiKey = apiKey
			plugin.settings.length = length
			plugin.settings.noteRange = noteRange
			await plugin.saveSettings()
		}
		saveSettings()
	}, [apiKey, length, noteRange, plugin])

	useEffect(() => {
		if (authToken) {
			const payload = JSON.parse(atob(authToken.split('.')[1]))
			setEmail(payload.email) // Set email from token payload
		}
	}, [authToken])

	const handleSaveButtonClick = async () => {
		await plugin.saveSettings()
		plugin.app.setting.close()
	}

	const handleAuthButtonClick = () => {
		if (authToken) {
			// Clear local storage and auth token state
			localStorage.removeItem('authToken')
			setAuthToken(null)
			setEmail('')
			new Notice('Signed out successfully')
			setIsModalOpen(false) // Close the modal if open
		} else {
			setIsModalOpen(true)
		}
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	const handleAuthSubmit = async (
		email: string,
		password: string,
		isSignUp: boolean,
	) => {
		try {
			const endpoint = isSignUp ? '/backend/signup/' : '/backend/signin/'
			const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username: email, password }),
			})
			if (response.ok) {
				const data = await response.json()
				localStorage.setItem('authToken', data.token)
				setAuthToken(data.token)
				new Notice('Authenticated successfully')
				handleCloseModal()
				return true
			} else {
				const errorText = await response.text()
				const error = JSON.parse(errorText)
				console.error('Authentication failed:', error)
				new Notice(error.error || 'Authentication failed')
				return false
			}
		} catch (error) {
			console.error('Authentication failed:', error)
			new Notice(error.message || 'Authentication failed')
			return false
		}
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
					{authToken ? 'Sign Out' : 'Sign up or Sign in'}
				</Button>
				<SaveButton onClick={handleSaveButtonClick}>Save Settings</SaveButton>
			</ButtonContainer>
			<EmailModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={handleAuthSubmit}
				resetFormFields={() => {
					setEmail('')
					setPassword('')
					setRepeatPassword('')
					setError('')
				}}
			/>
			{authToken && <EmailDisplay>Signed in as: {email}</EmailDisplay>}{' '}
		</Wrapper>
	)
}
export default class SettingsTab extends PluginSettingTab {
	plugin: MyPlugin
	root: Root | null = null // Add root property

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this
		containerEl.empty()
		if (!this.root) {
			this.root = createRoot(containerEl) // Create root only if it doesn't exist
		}
		this.root.render(<SettingsTabContent plugin={this.plugin} />)
	}
}
