import { css } from '@emotion/core'

const scrollStyles = whiteSpace => css`
	overflow: auto;
	height: inherit;
	width: inherit;
	scrollbar-width: thin;
	-webkit-overflow-scrolling: inherit;
	white-space: ${whiteSpace};
	cursor: pointer;
	&::-webkit-scrollbar {
		width: 10px; // effects vertical height
		height: 10px;
		scrollbar-width: thin;
	}

	&::-webkit-scrollbar-corner {
		backgroud: 'transparent';
	}

	&::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
		border-radius: 10px;
	}

	&::-webkit-scrollbar-thumb {
		background: rgb(46, 46, 46);
		border-radius: 5px;
	}

	&::-webkit-scrollbar-thumb:hover {
		background: rgb(1, 83, 132);
	}
`
export default scrollStyles
