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
`

export const UpdateMemoriesButton = styled(RefreshButton)`
	padding: 2px 8px;
	font-size: 8px;
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

// New TherapyModal component
export const TherapyModal = styled(Wrapper)`
	position: absolute;
	bottom: 35px;
	right: 15px;
	width: 300px;
	background-color: #2c2c2c;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`
