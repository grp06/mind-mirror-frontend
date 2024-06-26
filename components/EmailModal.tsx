import React, { useState } from 'react'
import {
	ModalWrapper,
	ModalContent,
	Input,
	CloseButton,
	Button,
	ButtonContainer,
	ErrorMessage,
} from './StyledComponents'

interface EmailModalProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (
		username: string,
		password: string,
		isSignUp: boolean,
	) => Promise<boolean>
	resetFormFields: () => void
}

const EmailModal: React.FC<EmailModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	resetFormFields,
}) => {
	const [isSignUp, setIsSignUp] = useState(true)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [repeatPassword, setRepeatPassword] = useState('')
	const [error, setError] = useState('')

	if (!isOpen) return null

	const handleSubmit = async () => {
		if (isSignUp && password !== repeatPassword) {
			setError('Passwords do not match')
			return
		}
		try {
			const success = await onSubmit(email, password, isSignUp)
			if (!success) {
				return
			} else {
				setError('')
				resetFormFields()
				onClose()
			}
		} catch (error) {
			setError(error.message || 'An error occurred. Please try again.')
		}
	}

	const handleClose = () => {
		resetFormFields()
		onClose()
	}

	const isSignUpDisabled =
		isSignUp &&
		(!email || !password || !repeatPassword || password !== repeatPassword)

	return (
		<ModalWrapper>
			<ModalContent>
				<CloseButton onClick={handleClose}>X</CloseButton>
				<h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
				{error && <ErrorMessage>{error}</ErrorMessage>}
				<Input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Input
					type="password"
					placeholder="Enter your password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{isSignUp && (
					<Input
						type="password"
						placeholder="Repeat your password"
						value={repeatPassword}
						onChange={(e) => setRepeatPassword(e.target.value)}
					/>
				)}
				<ButtonContainer>
					<Button onClick={handleSubmit} disabled={isSignUpDisabled}>
						{isSignUp ? 'Sign Up' : 'Sign In'}
					</Button>
					<Button onClick={() => setIsSignUp(!isSignUp)}>
						Switch to {isSignUp ? 'Sign In' : 'Sign Up'}
					</Button>
				</ButtonContainer>
			</ModalContent>
		</ModalWrapper>
	)
}

export default EmailModal
