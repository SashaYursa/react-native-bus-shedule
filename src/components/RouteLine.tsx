import React from 'react';
import styled from 'styled-components/native';
type Props = {
	color: string;
	children?: React.JSX.Element;
};

const RouteVerticalLine = ({ color = '#fff', children }: Props) => {
	return (
		<Container>
			<Line style={{ borderColor: color }} />
			{children}
		</Container>
	);
};

const Container = styled.View`
	flex-direction: row;
	align-items: center;
`;
const Line = styled.View`
	align-items: center;
	min-height: 30px;
	background-color: #000;
	width: 2px;
	border-radius: 2px;
	margin: 0 5px;
`;

export default RouteVerticalLine;
