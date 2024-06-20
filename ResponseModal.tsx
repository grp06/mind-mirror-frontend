import React from 'react'
import {
	ResponseModalContainer,
	Title,
	Content,
	CloseButton,
} from './StyledComponents'
import { useAppContext } from './AppContext'

const ResponseModal: React.FC = () => {
	const { showModal, result, handleCloseModal } = useAppContext()

	if (!showModal) return null

	return (
		<ResponseModalContainer>
			<Title>AI Response</Title>
			<Content>{result}</Content>
			<CloseButton onClick={handleCloseModal}>X</CloseButton>
		</ResponseModalContainer>
	)
}

export default ResponseModal
