import React, { useState } from 'react'
import { Notice } from 'obsidian'

interface EmailModalProps {
	onSubmit: (
		username: string,
		password: string,
		isSignUp: boolean,
	) => Promise<boolean>
	isSignUp: boolean
	onClose: () => void
}

const EmailModal: React.FC<EmailModalProps> = ({
	onSubmit,
	isSignUp: initialIsSignUp,
	onClose,
}) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [isSignUp, setIsSignUp] = useState(initialIsSignUp)

	const handleSubmit = async () => {
		if (isSignUp && password !== confirmPassword) {
			setErrorMessage('Passwords do not match')
			return
		}

		const success = await onSubmit(email, password, isSignUp)
		if (success) {
			new Notice('Authenticated successfully')
			onClose()
		} else {
			setErrorMessage('Authentication failed')
		}
	}

	return (
		<div>
			<h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
			<div>
				<label>Email</label>
				<input
					type="text"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div>
				<label>Password</label>
				<input
					type="password"
					placeholder="Enter your password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			{isSignUp && (
				<div>
					<label>Confirm Password</label>
					<input
						type="password"
						placeholder="Confirm your password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
			)}
			{errorMessage && <div className="error-message">{errorMessage}</div>}
			<div className="button-container">
				<button onClick={handleSubmit}>
					{isSignUp ? 'Sign Up' : 'Sign In'}
				</button>
				<button onClick={() => setIsSignUp(!isSignUp)}>
					{isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
				</button>
			</div>
		</div>
	)
}

export default EmailModal
