import React, { useState, useEffect, useRef } from 'react'
import { feelingCategories } from './data'
import { useAppContext } from './AppContext'
import {
	BarContainer,
	ButtonWrapper,
	SecondaryPane,
	CloseEmotionsButton,
} from './StyledComponents'

interface EmotionsBarProps {
	onFeelingClick: (feeling: string) => void
}

const EmotionsBar: React.FC<EmotionsBarProps> = ({ onFeelingClick }) => {
	const { closeEmotionsBar, handleFeelingClick } = useAppContext()
	const [activeCategory, setActiveCategory] = useState<string | null>(null)
	const barRef = useRef<HTMLDivElement>(null)

	const getCategoryColor = (category: string, isLevel2 = false): string => {
		const colors: { [key: string]: string } = {
			Happy: '#b48484',
			Sad: '#CE7C87',
			Disgusted: '#AB7BB4',
			Angry: '#7572B3',
			Fearful: '#00A3B9',
			Bad: '#35B99F',
			Surprised: '#E4A44B',
		}

		let color = colors[category] || '#FFFFFF'

		if (isLevel2) {
			const rgb = parseInt(color.slice(1), 16)
			const r = Math.floor(((rgb >> 16) & 255) * 0.7)
			const g = Math.floor(((rgb >> 8) & 255) * 0.7)
			const b = Math.floor((rgb & 255) * 0.7)
			color = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
		}

		return color
	}

	const handleCategoryClick = (category: string) => {
		setActiveCategory(activeCategory === category ? null : category)
	}

	return (
		<div ref={barRef}>
			<BarContainer>
				<CloseEmotionsButton onClick={closeEmotionsBar}>➡️</CloseEmotionsButton>

				{feelingCategories.map((category) => (
					<ButtonWrapper
						key={category.level0}
						$backgroundColor={getCategoryColor(category.level0)}
						$isActive={activeCategory === category.level0}
						onClick={() => handleCategoryClick(category.level0)}
					>
						{category.level0}
					</ButtonWrapper>
				))}
			</BarContainer>
			{feelingCategories.map((category) => (
				<SecondaryPane
					key={category.level0}
					$isVisible={activeCategory === category.level0}
					$category={category.level0}
				>
					{category.level1.map((feeling) => (
						<ButtonWrapper
							key={feeling}
							$backgroundColor={getCategoryColor(category.level0)}
							onClick={() => handleFeelingClick(feeling)}
						>
							{feeling}
						</ButtonWrapper>
					))}
					{category.level2.map((feeling) => (
						<ButtonWrapper
							key={feeling}
							$backgroundColor={getCategoryColor(category.level0, true)}
							onClick={() => handleFeelingClick(feeling)}
						>
							{feeling}
						</ButtonWrapper>
					))}
				</SecondaryPane>
			))}
		</div>
	)
}

export default EmotionsBar
