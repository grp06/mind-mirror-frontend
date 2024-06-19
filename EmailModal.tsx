import React, { useState } from 'react'
import {
	ModalWrapper,
	ModalContent,
	Input,
	CloseButton,
	Button,
	ButtonContainer,
} from './StyledComponents'

interface EmailModalProps {
	isOpen: boolean
	onClose: () => void
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose }) => {
	const [isSignUp, setIsSignUp] = useState(true)

	if (!isOpen) return null

	const handleSubmit = () => {
		console.log(isSignUp ? 'Sign Up' : 'Sign In')
	}

	return (
		<ModalWrapper>
			<ModalContent>
				<CloseButton onClick={onClose}>X</CloseButton>
				<h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
				<Input type="email" placeholder="Enter your email" />
				<Input type="password" placeholder="Enter your password" />
				{isSignUp && (
					<Input type="password" placeholder="Repeat your password" />
				)}
				<ButtonContainer>
					<Button onClick={handleSubmit}>
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
