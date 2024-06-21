import styled from 'styled-components'

export const Wrapper = styled.div`
	color: #f0f0f0;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

export const InputItem = styled.div`
	margin-bottom: 10px;
	width: 100%;
`

export const Label = styled.label`
	color: #f0f0f0;
	font-weight: bold;
	font-size: 1rem;
`
export const Input = styled.input`
	background-color: #3a3a3a;
	color: #f0f0f0;
	border: 1px solid #555;
	padding: 6px 10px;
	border-radius: 4px;
	width: 100%;
	transition: border-color 0.3s ease;
	margin: 5px 0;
	&:focus {
		border-color: #4caf50;
		outline: none;
	}
`

export const Select = styled.select`
	background-color: #3a3a3a;
	color: #f0f0f0;
	border: 1px solid #555;
	padding: 6px 10px;
	border-radius: 4px;
	width: 100%;
	transition: border-color 0.3s ease;
	margin: 5px 0;
	&:focus {
		border-color: #4caf50;
		outline: none;
	}
`

export const ButtonContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-top: 20px;
`

export const Button = styled.button`
	background-color: #4caf50;
	color: #f0f0f0;
	border: none;
	padding: 8px 16px;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s ease;
	font-weight: bold;
	&:hover {
		background-color: #45a049;
	}
`

export const RefreshButton = styled(Button)`
	margin: 5px 0;
	background-color: #45a049 !important;
`

export const UpdateMemoriesButton = styled(RefreshButton)`
	padding: 2px 8px;
	font-size: 0.5rem;
	height: 20px;
	background: #f0f0f0 !important;
	color: #3a3a3a;
`

export const SaveButton = styled.button`
	background-color: #2196f3;
	color: #f0f0f0;
	border: none;
	padding: 8px 16px;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s ease;
	margin-top: 20px;

	&:hover {
		background-color: #1e88e5;
	}
`

export const TherapyModal = styled(Wrapper)`
	position: absolute;
	bottom: 35px;
	max-height: 30vh;
	overflow-y: auto;
	right: 15px;
	width: 300px;
	background-color: #2c2c2c;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`

export const ResponseModalContainer = styled.div`
	position: absolute;
	top: 45px;
	max-height: 70vh;
	overflow-y: auto;
	right: 14px;
	background-color: #2c2c2c;
	border: 1px solid #555;
	padding: 20px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
	font-family: Arial, sans-serif;
	color: #f0f0f0;
	width: 300px;
	z-index: 1000;
`
export const Title = styled.h2`
	margin-top: 0;
	font-size: 1.1rem;
	color: #f0f0f0;
`

export const Content = styled.p`
	margin: 10px 0;
	font-size: 0.9rem;
	line-height: 1.5;
`

export const ModalWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
`

export const ModalContent = styled.div`
	background: #2c2c2c;
	color: #f0f0f0;
	padding: 15px;
	border-radius: 8px;
	width: 300px;
	position: relative;
`

export const CloseButton = styled.button`
	position: absolute;
	top: 10px;
	right: 10px;
	background: none;
	border: none;
	font-size: 12px;
	cursor: pointer;
`

export const EmailDisplay = styled.div`
	color: #f0f0f0;
	margin-top: 10px;
	font-size: 0.9rem;
`

export const ErrorMessage = styled.div`
	color: red;
	margin-bottom: 10px;
`

export const PlusButton = styled.button`
	background-color: transparent;
	border: none;
	font-size: 24px;
	cursor: pointer;
	margin-left: 10px;
	color: #000; /* Adjust color as needed */
`

export const HeartButton = styled.button`
	background-color: transparent;
	border: none;
	color: red;
	font-size: 1.5em;
	cursor: pointer;
	margin: 0 5px;

	&:hover {
		color: darkred;
	}
`
