import React from 'react'
import { useAppContext } from './AppContext'
import EmotionsBar from './EmotionsBar'
import {
	ResponseModalContainer,
	ResponseContent,
	ResponseActions,
	ActionButton,
} from './StyledComponents'

const ResponseModal: React.FC = () => {
	const {
		result,
		handlePlusClick,
		handleHeartClick,
		toggleEmotionsBar,
		isEmotionsBarVisible,
	} = useAppContext()

	return (
		<ResponseModalContainer>
			<ResponseContent>
				{result ? result : 'Click refresh to get AI feedback'}
			</ResponseContent>
			<ResponseActions>
				<ActionButton onClick={() => handlePlusClick(result)}>➕</ActionButton>
				<ActionButton onClick={() => handleHeartClick(result)}>❤️</ActionButton>
				<ActionButton onClick={toggleEmotionsBar}>🫀</ActionButton>
			</ResponseActions>
			{isEmotionsBarVisible && <EmotionsBar />}
		</ResponseModalContainer>
	)
}

export default ResponseModal
