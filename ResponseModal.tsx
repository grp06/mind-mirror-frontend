import React from 'react'
import { ResponseModalContainer, Title, Content } from './StyledComponents'

interface ResponseModalProps {
	show: boolean
	response: string
}

const ResponseModal: React.FC<ResponseModalProps> = ({ show, response }) => {
	if (!show) return null // Conditionally render the modal

	return (
		<ResponseModalContainer>
			<Title>AI Response</Title>
			<Content>{response}</Content>
		</ResponseModalContainer>
	)
}

export default ResponseModal
