import React, { useState, useEffect } from 'react'
import { App, PluginSettingTab, Notice } from 'obsidian'
import { createRoot, Root } from 'react-dom/client'
import { useAppContext, AppProvider } from '../context/AppContext'
import EmailModal from './EmailModal'
import {
  Wrapper,
  InputItem,
  Label,
  Input,
  ButtonContainer,
  Button,
  SaveButton,
  EmailDisplay,
} from './StyledComponents'
import { fetchUserEmail } from '../utils/fetchUserEmail'
import MyPlugin from '../main'
import { ExtendedApp } from '../types'

const SettingsTabContent: React.FC = () => {
  const {
    apiKey,
    setApiKey,
    authToken,
    setAuthToken,
    email,
    setEmail,
    setError,
    plugin,
    removeApiKey,
  } = useAppContext()

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchUserEmail(authToken, setAuthToken, setEmail)
  }, [authToken, setAuthToken, setEmail])

  const handleSaveButtonClick = async () => {
    plugin.settings.apiKey = apiKey
    await plugin.saveSettings()
    ;(plugin.app as ExtendedApp).setting.close()
  }

  const handleRemoveApiKey = () => {
    removeApiKey()
    new Notice('API key removed successfully')
  }

  const handleAuthButtonClick = async () => {
    if (authToken) {
      try {
        await fetch('http://127.0.0.1:8000/backend/logout/', {
          method: 'POST',
          headers: {
            Authorization: `Token ${authToken}`,
          },
        })
        localStorage.removeItem('authToken')
        setAuthToken(null)
        setEmail('')
        new Notice('Signed out successfully')
        setIsModalOpen(false)
      } catch (error) {
        console.error('Logout failed:', error)
        new Notice('Logout failed')
      }
    } else {
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    if (storedToken) {
      setAuthToken(storedToken)
      fetchUserEmail(storedToken, setAuthToken, setEmail)
    }
  }, [])

  const handleAuthSubmit = async (
    email: string,
    password: string,
    isSignUp: boolean,
  ) => {
    try {
      const endpoint = isSignUp ? '/backend/registration/' : '/backend/login/'
      const body = isSignUp
        ? { email, password1: password, password2: password }
        : { email, password }
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (response.ok) {
        const data = await response.json()
        console.log('🚀 ~ data:', data)
        localStorage.setItem('authToken', data.access)
        setAuthToken(data.access_token)
        setEmail(email)
        new Notice('Authenticated successfully')
        handleCloseModal()
        return true
      } else {
        const errorData = await response.json()
        console.error('Authentication failed:', errorData)
        const errorMessage = Object.values(errorData).flat().join(', ')
        new Notice(errorMessage || 'Authentication failed')
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
        <Label>OpenAI API Key</Label>
        <Input
          type="text"
          value={apiKey}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setApiKey(e.target.value)
          }
          placeholder="Enter your API key"
        />
      </InputItem>
      <ButtonContainer>
        <Button onClick={handleAuthButtonClick}>
          {authToken ? 'Sign Out' : 'Sign up or Sign in'}
        </Button>
        <SaveButton onClick={handleSaveButtonClick}>Save Settings</SaveButton>
        {apiKey && <Button onClick={removeApiKey}>Remove API Key</Button>}
      </ButtonContainer>
      <EmailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAuthSubmit}
        resetFormFields={() => {
          setEmail('')
          setError('')
        }}
      />
      {authToken && <EmailDisplay>Signed in as: {email}</EmailDisplay>}
    </Wrapper>
  )
}

export default class SettingsTab extends PluginSettingTab {
  plugin: MyPlugin
  root: Root | null = null

  constructor(app: ExtendedApp, plugin: MyPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this
    if (this.root) {
      this.root.unmount()
    }
    containerEl.empty()
    this.root = createRoot(containerEl)
    this.root.render(
      <AppProvider plugin={this.plugin}>
        <SettingsTabContent />
      </AppProvider>,
    )
  }
}
