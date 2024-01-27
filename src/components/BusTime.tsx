import React from 'react';
import styled from 'styled-components/native';
import { formattingTime } from '../utils/helpers';
import { busTime } from '../store/slices/stationsAPI';
import { ScrollView } from 'react-native';
import SpinnngText from './SpinnngText';
import { Header } from 'react-native/Libraries/NewAppScreen';

type Props = {
	bus: busTime;
	bgColor: string;
};

const BusTime = ({ bus, bgColor }: Props) => {
	const departure = new Date(Number(bus.departure));
	const date = formattingTime(departure);

	return (
		<Container style={{ backgroundColor: bgColor }}>
			<TimeContainer>
				<InfoText>{date}</InfoText>
			</TimeContainer>
			<InfoContainer>
				{bus.busRoute.length > 25 ? (
					<SpinnngText
						text={bus.busRoute}
						textStyle={{ fontWeight: '700', color: '#000', fontSize: 20 }}
					/>
				) : (
					<BusInfoContainer>
						<HeaderText>{bus.busRoute}</HeaderText>
					</BusInfoContainer>
				)}

				<BusInfoContainer>
					<InfoText>{bus.busInfo}</InfoText>
				</BusInfoContainer>
			</InfoContainer>
		</Container>
	);
};

const Container = styled.View`
	padding: 5px;
	border-radius: 12px;
	margin: 5px;
	flex-direction: row;
`;
const InfoContainer = styled.View`
	flex-direction: column;
	flex-shrink: 1;
`;
const TimeContainer = styled.View`
	align-items: center;
	justify-content: center;
	padding: 5px;
`;

const BusInfoContainer = styled.View`
	align-items: flex-start;
`;

const HeaderText = styled.Text`
	font-size: 20px;
	font-weight: 700;
	color: #000;
`;

const InfoText = styled.Text`
	font-size: 18px;
	font-weight: 400;
	color: #000;
`;
export default BusTime;
