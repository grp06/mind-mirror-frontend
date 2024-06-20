import React from 'react'
import {
	ResponseModalContainer,
	Title,
	Content,
	CloseButton,
} from './StyledComponents'

interface ResponseModalProps {
	show: boolean
	response: string
	onClose: () => void
}

const ResponseModal: React.FC<ResponseModalProps> = ({
	show,
	response,
	onClose,
}) => {
	if (!show) return null

	return (
		<ResponseModalContainer>
			<Title>AI Response</Title>
			<Content>{response}</Content>
			<CloseButton onClick={onClose}>X</CloseButton>
		</ResponseModalContainer>
	)
}

export default ResponseModal
