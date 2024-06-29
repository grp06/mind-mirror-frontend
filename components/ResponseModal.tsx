import React, { useRef, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import EmotionsBar from './EmotionsBar'
import {
	ResponseModalContainer,
	ResponseContent,
	ResponseActions,
	ActionButton,
	CloseButton,
} from './StyledComponents'
import { ModalState } from '../types' // Add this import

const ResponseModal: React.FC = () => {
	const {
		result,
		handlePlusClick,
		handleHeartClick,
		isEmotionsBarVisible,
		closeEmotionsBar,
		handleEmotionClick,
		handleCloseModal,
		modalState,
		isTherapistThinking,
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
	if (modalState === ModalState.Hide) return null

	return (
		<ResponseModalContainer ref={modalRef}>
			<CloseButton onClick={handleCloseModal}>×</CloseButton>
			<ResponseContent>
				{modalState === ModalState.Initial
					? 'Click refresh to get AI feedback'
					: isTherapistThinking
						? 'Your therapist is pondering your situation...'
						: result}
			</ResponseContent>
			<ResponseActions>
				<ActionButton onClick={() => handlePlusClick(result)}>➕</ActionButton>
				<ActionButton onClick={() => handleHeartClick(result)}>❤️</ActionButton>
			</ResponseActions>
			{isEmotionsBarVisible && (
				<EmotionsBar onEmotionClick={handleEmotionClick} />
			)}
		</ResponseModalContainer>
	)
}

export default ResponseModal
