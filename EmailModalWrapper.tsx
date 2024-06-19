import { Modal } from 'obsidian'
import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import EmailModal from './EmailModal'

interface EmailModalWrapperProps {
	onSubmit: (
		username: string,
		password: string,
		isSignUp: boolean,
	) => Promise<boolean>
	isSignUp: boolean
	onClose: () => void
}

const EmailModalWrapper: React.FC<EmailModalWrapperProps> = ({
	onSubmit,
	isSignUp,
	onClose,
}) => {
	const contentEl = document.createElement('div')
	const root = createRoot(contentEl)

	useEffect(() => {
		root.render(
			<EmailModal onSubmit={onSubmit} isSignUp={isSignUp} onClose={onClose} />,
		)

		return () => {
			root.unmount()
		}
	}, [onSubmit, isSignUp, onClose])

	return null
}

export default EmailModalWrapper
