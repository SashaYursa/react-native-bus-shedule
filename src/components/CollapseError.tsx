import React, { useEffect, useLayoutEffect, useState } from 'react';
import Collapsible from 'react-native-collapsible';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
	message: string;
	showError: boolean;
	timeToShowError?: number;
};

const CollapseError = ({
	message,
	showError,
	timeToShowError = 5000,
}: Props) => {
	const [showCollapsedMessage, setShowCollapsedMessage] =
		useState<boolean>(false);

	useLayoutEffect(() => {
		if (showError) {
			setShowCollapsedMessage(true);
			setTimeout(() => {
				setShowCollapsedMessage(false);
			}, timeToShowError);
		}
	}, [showError]);
	return (
		<ErrorMessageContainer pointerEvents="none">
			<Collapsible collapsed={!showCollapsedMessage}>
				<ErrorMessage>
					<Icon name="alert-circle-outline" color="red" size={25} />
					<ErrorText numberOfLines={5}>{message}</ErrorText>
				</ErrorMessage>
			</Collapsible>
		</ErrorMessageContainer>
	);
};

const ErrorMessageContainer = styled.View`
	position: absolute;
	top: 10px;
	left: 10px;
	right: 10px;
	z-index: 5;
`;
const ErrorMessage = styled.View`
	background-color: #fff;
	border-radius: 12px;
	padding: 5px 10px;
	flex-direction: row;
	align-items: center;
`;
const ErrorText = styled.Text`
	font-size: 16px;
	font-weight: 700;
	color: red;
	flex-shrink: 1;
	margin-left: 10px;
`;

export default CollapseError;
