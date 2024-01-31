import React from 'react';
import styled from 'styled-components/native';
import RouteVerticalLine from './RouteLine';
import { View } from 'react-native';
import { IBusStations, ISheduleItem } from '../store/types';
import { formattingTime } from '../utils/helpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
	station: IBusStations;
	sheduleItem: ISheduleItem;
};

const BusRouteCard = ({ station, sheduleItem }: Props) => {
	const route = sheduleItem.busRoute
		.split(' - ')
		.map(str => str.trim().replace('#', '').replace('+', ''));
	const startPoint = route[0];
	const endPoint = route[1];
	const departure = new Date(Number(sheduleItem.departure));
	const arrival = new Date(Number(sheduleItem.arrival));
	const fromCurrentStation = startPoint === station.stationName.toUpperCase();
	const arrivalTime = formattingTime(arrival);
	const departureTime = formattingTime(departure);
	let different = arrival.getTime() - departure.getTime();
	let hours = Math.floor((different % 86400000) / 3600000);
	let minutes = Math.round(((different % 86400000) % 3600000) / 60000);
	const hoursOnTheRoad =
		(hours ? hours + 'год. ' : '') + (minutes ? minutes + 'хв.' : '');

	return (
		<Container>
			<RouteEndpointsContainer>
				<RouteEndpoint>
					<RouteEndpointText
						style={{ color: fromCurrentStation ? 'green' : '#000' }}>
						{startPoint}
					</RouteEndpointText>
					{fromCurrentStation && <RouteTime>{departureTime}</RouteTime>}
				</RouteEndpoint>
				{!fromCurrentStation && (
					<>
						<RouteVerticalLine color="#000">
							<View>
								<RouteTime style={{ fontSize: 14 }}>{hoursOnTheRoad}</RouteTime>
							</View>
						</RouteVerticalLine>
						<RouteEndpoint>
							<RouteEndpointText style={{ color: 'green' }}>
								{station.stationName.toUpperCase()}
							</RouteEndpointText>
							<RouteTime>{departureTime}</RouteTime>
						</RouteEndpoint>
					</>
				)}
				<RouteVerticalLine color="#000">
					<View>
						{fromCurrentStation && (
							<RouteTime style={{ fontSize: 14 }}>{hoursOnTheRoad}</RouteTime>
						)}
					</View>
				</RouteVerticalLine>
				<RouteEndpoint>
					<RouteEndpointText>{endPoint}</RouteEndpointText>
					<RouteTime>{arrivalTime}</RouteTime>
				</RouteEndpoint>
			</RouteEndpointsContainer>
			<RouteInfoContainer>
				<RouteInfoItem>
					<RouteInfoText>{sheduleItem.emptyPlaces}</RouteInfoText>
					<Icon
						name="car-seat"
						size={20}
						color={
							sheduleItem.emptyPlaces > 10
								? 'green'
								: sheduleItem.emptyPlaces > 0
								? '#FFB534'
								: 'red'
						}
					/>
				</RouteInfoItem>
				<RouteInfoItem>
					<RouteInfoTextContainer>
						<RouteInfoText>{sheduleItem.busOwner}</RouteInfoText>
						<RouteInfoText>{sheduleItem.busInfo}</RouteInfoText>
					</RouteInfoTextContainer>
					<Icon name="information" size={20} color="green" />
				</RouteInfoItem>
				<RouteInfoItem>
					<RouteInfoText>{sheduleItem.cost}</RouteInfoText>
					<Icon name="cash-multiple" size={20} color="green" />
				</RouteInfoItem>
			</RouteInfoContainer>
		</Container>
	);
};

const RouteInfoContainer = styled.View`
	flex-grow: 1;
	flex-shrink: 1;
	align-items: flex-end;
	text-overflow: clip;
`;

const Container = styled.View`
	flex-direction: row;
	flex-grow: 1;
	flex-shrink: 1;
	align-items: center;
`;

const RouteEndpointsContainer = styled.View`
	padding: 5px;
	border-radius: 12px;
	flex-direction: column;
	align-items: flex-start;
`;

const RouteEndpoint = styled.View`
	align-items: flex-start;
	justify-content: center;
`;
const RouteEndpointText = styled.Text`
	font-size: 14px;
	font-weight: 700;
	color: #000;
`;
const RouteTime = styled.Text`
	color: #171717;
	font-size: 12px;
`;

const RouteInfoItem = styled.View`
	flex-direction: row;
	align-items: flex-end;
	justify-content: center;
	padding: 2px;
	margin-top: 5px;
	align-items: center;
	justify-content: space-between;
	flex-grow: 1;
	text-overflow: clip;
`;

const RouteInfoTextContainer = styled.View`
	align-items: flex-end;
	flex-grow: 1;
	flex-shrink: 1;
`;

const RouteInfoText = styled.Text`
	color: #000;
	font-size: 14px;
	margin-right: 5px;
	text-align: right;
`;

export default BusRouteCard;
