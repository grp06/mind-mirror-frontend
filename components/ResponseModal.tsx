import React, { useRef, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
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
		closeEmotionsBar,
		handleEmotionClick,
	} = useAppContext()

	const modalRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				closeEmotionsBar()
			}
		}

		if (isEmotionsBarVisible) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isEmotionsBarVisible, closeEmotionsBar])

	return (
		<ResponseModalContainer ref={modalRef}>
			<ResponseContent>
				{result ? result : 'Click refresh to get AI feedback'}
			</ResponseContent>
			<ResponseActions>
				<ActionButton onClick={() => handlePlusClick(result)}>➕</ActionButton>
				<ActionButton onClick={() => handleHeartClick(result)}>❤️</ActionButton>
				<ActionButton onClick={toggleEmotionsBar}>🫀</ActionButton>
			</ResponseActions>
			{isEmotionsBarVisible && (
				<EmotionsBar onEmotionClick={handleEmotionClick} />
			)}
		</ResponseModalContainer>
	)
}

export default ResponseModal