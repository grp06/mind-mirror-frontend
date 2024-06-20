import React from 'react'
import {
	ResponseModalContainer,
	Title,
	Content,
	CloseButton,
} from './StyledComponents'

interface ResponseModalProps {
	show: boolean
	result: string // Change this from 'response' to 'result'
	onClose: () => void
}

const ResponseModal: React.FC<ResponseModalProps> = ({
	show,
	result, // Change this from 'response' to 'result'
	onClose,
}) => {
	if (!show) return null

	return (
		<ResponseModalContainer>
			<Title>AI Response</Title>
			<Content>{result}</Content>{' '}
			{/* Change this from 'response' to 'result' */}
			<CloseButton onClick={onClose}>X</CloseButton>
		</ResponseModalContainer>
	)
}
export default ResponseModal
