import React from 'react'
import {
	ResponseModalContainer,
	Title,
	Content,
	CloseButton,
	PlusButton,
	HeartButton,
} from './StyledComponents'
import { useAppContext } from './AppContext'

const ResponseModal: React.FC = () => {
	const {
		showModal,
		result,
		handleCloseModal,
		handlePlusClick,
		handleHeartClick,
	} = useAppContext()

	if (!showModal) return null

	return (
		<ResponseModalContainer>
			<Title>AI Response</Title>
			<Content>{result}</Content>
			<PlusButton onClick={() => handlePlusClick(result)}>+</PlusButton>
			<HeartButton onClick={() => handleHeartClick(result)}>❤️</HeartButton>
			<CloseButton onClick={handleCloseModal}>X</CloseButton>
		</ResponseModalContainer>
	)
}

export default ResponseModal
