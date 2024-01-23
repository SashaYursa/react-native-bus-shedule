import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formattingDate } from '../utils/helpers';
import { IBusStations } from '../store/types';

type Props = {
	station: IBusStations;
	moveToStationShedule: (station: IBusStations) => void;
};

const BusStation = ({ station, moveToStationShedule }: Props) => {
	const lastUpdate = formattingDate(new Date(station.last_updated_at));
	return (
		<BusStationButton
			onPress={() => {
				moveToStationShedule(station);
			}}>
			<BusStationIcon>
				<Icon name="bus-multiple" size={50} />
			</BusStationIcon>
			<BusStationInfo>
				<BusStationTitle>{station.stationName}</BusStationTitle>
				<BusStationInfoContainer>
					<Icon name="update" size={18} />
					<LastUpdateStationText>Оновлено: {lastUpdate}</LastUpdateStationText>
				</BusStationInfoContainer>
				{station.stationAddress && (
					<BusStationInfoContainer>
						<Icon name="map-marker" size={18} />
						<BusStationStreet numberOfLines={1}>
							{station.stationAddress}
						</BusStationStreet>
					</BusStationInfoContainer>
				)}
			</BusStationInfo>
		</BusStationButton>
	);
};

const BusStationButton = styled.TouchableOpacity`
	flex-direction: row;
	justify-content: space-between;
	margin: 5px;
	background-color: #eaeaea;
	border-radius: 12px;
	padding: 5px;
	overflow: hidden;
`;
const BusStationIcon = styled.View`
	overflow: hidden;
	border-radius: 12px;
	background-color: #fff;
	align-items: center;
	justify-content: center;
	margin-top: auto;
	margin-bottom: auto;
	padding: 10px;
`;
const BusStationInfo = styled.View`
	flex-grow: 1;
`;
const BusStationTitle = styled.Text`
	color: #000;
	font-size: 16px;
	font-weight: 700;
	justify-content: center;
	align-items: center;
	flex-direction: row;
	text-align: center;
`;

const BusStationStreet = styled.Text`
	font-size: 16px;
	font-weight: 700;
	color: #000;
	overflow: hidden;
	flex-shrink: 1;
	flex-grow: 1;
	flex-basis: 0;
`;
const BusStationInfoContainer = styled.View`
	flex-direction: row;
	margin: 0 5px;
	align-items: center;
`;
const LastUpdateStationText = styled.Text`
	font-size: 14px;
	font-weight: 400;
`;

export default BusStation;
