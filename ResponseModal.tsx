import React from 'react'
import {
	ResponseModalContainer,
	Title,
	Content,
	CloseButton,
	PlusButton, // Import PlusButton styled component
	HeartButton, // Import HeartButton styled component
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
			<PlusButton onClick={() => handlePlusClick(result)}>+</PlusButton>{' '}
			{/* Pass result to handlePlusClick */}
			<HeartButton onClick={() => handleHeartClick(result)}>
				❤️
			</HeartButton>{' '}
			{/* Pass result to handleHeartClick */}
			<CloseButton onClick={handleCloseModal}>X</CloseButton>
		</ResponseModalContainer>
	)
}

export default ResponseModal
