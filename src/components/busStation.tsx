import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formattingDate } from '../utils/helpers';
import { IBusStations } from '../store/types';
import { Text, View } from 'react-native';

type Props = {
	station: IBusStations;
	moveToStationShedule: (station: IBusStations) => void;
	searchValue?: string;
};

const BusStation = ({ station, moveToStationShedule, searchValue }: Props) => {
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
				<BusStationTitle>
					{searchValue ? (
						<StationName name={station.stationName} searchValue={searchValue} />
					) : (
						<BusStationTitle>{station.stationName}</BusStationTitle>
					)}
				</BusStationTitle>
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
const StationName = ({
	name,
	searchValue,
}: {
	name: string;
	searchValue: string;
}) => {
	const nameArray = name.toUpperCase().split('');
	const searchArray = searchValue.toUpperCase().split('');
	const startIndex = nameArray.findIndex((letter, index, arr) => {
		if (letter === searchArray[0]) {
			for (let i = 1; i < searchArray.length; i++) {
				if (searchArray[i] !== arr[index + i]) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	});
	return (
		<BusStationTitle>
			{nameArray.map((nameLetter, index) => {
				return (
					<BusStationTitle
						key={index}
						style={
							index >= startIndex && index < startIndex + searchArray.length
								? {
										backgroundColor: '#41b874',
								  }
								: {}
						}>
						{nameLetter}
					</BusStationTitle>
				);
			})}
		</BusStationTitle>
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
