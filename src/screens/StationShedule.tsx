import React, { useEffect } from 'react';
import {
	Vibration,
	Animated,
	Easing,
	TouchableOpacity,
	View,
	ScrollView,
	Text,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusStackParamList } from '../navigation/Navigation';
import { useGetSheduleQuery } from '../store/slices/stationsAPI';
import styled from 'styled-components/native';
import { ISheduleItem } from '../store/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ErrorLoad from '../components/ErrorLoad';
import BusRouteCard from '../components/BusRouteCard';
import { formattingDate, getTicketsStatusColor } from '../utils/helpers';
import { FlashList } from '@shopify/flash-list';
import Loading from '../components/Loading';
import SpinnngText from '../components/SpinnngText';
const StationShedule = ({
	navigation,
	route,
}: NativeStackScreenProps<BusStackParamList, 'StationShedule'>) => {
	const rotateAnim = new Animated.Value(0);
	Animated.loop(
		Animated.timing(rotateAnim, {
			toValue: 1,
			duration: 1500,
			easing: Easing.bezier(1, 1, 1, 1),
			useNativeDriver: true,
		}),
	).start();
	const spin = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});
	const station = route.params.station;
	const {
		data: res,
		error: sheduleError,
		isLoading: sheduleIsLoading,
	} = useGetSheduleQuery(station.id);
	const sheduleData = res?.shedule?.buses;

	useEffect(() => {
		if (res?.shedule) {
			const lastUpdateDate = new Date(res.lastUpdate);
			const lastUpdate = formattingDate(lastUpdateDate);
			navigation.setOptions({
				headerTitleAlign: 'left',
				headerTitle: () => (
					<View style={{ width: res.isLoading ? 160 : 190, marginLeft: -20 }}>
						<SpinnngText
							text={station.stationName}
							textStyle={{ color: '#000' }}
						/>
					</View>
				),
				headerRight: () => {
					return (
						<>
							<HeaderRightContainer>
								{res.isLoading && (
									<HeaderUpdateContainer style={{ paddingRight: 5 }}>
										<Animated.View style={{ transform: [{ rotate: spin }] }}>
											<Icon name="loading" size={25} color="#000" />
										</Animated.View>
									</HeaderUpdateContainer>
								)}
								{res.error ? (
									<HeaderUpdateContainer>
										<HeaderUpdateText style={{ color: 'red' }}>
											Помилка{' '}
										</HeaderUpdateText>
										<HeaderUpdateText style={{ color: 'red' }}>
											не оновлено
										</HeaderUpdateText>
									</HeaderUpdateContainer>
								) : (
									<HeaderUpdateContainer>
										<HeaderUpdateText>Оновлено:</HeaderUpdateText>
										<HeaderUpdateText>{lastUpdate}</HeaderUpdateText>
									</HeaderUpdateContainer>
								)}
							</HeaderRightContainer>
							<TouchableOpacity
								style={{ marginLeft: 10 }}
								onPress={() => {
									navigation.navigate('StationTimes', { station });
								}}>
								<Icon
									name="clock-time-three-outline"
									size={25}
									color="#41b874"
								/>
							</TouchableOpacity>
						</>
					);
				},
			});
		}
	}, [res]);

	const moveToRoute = (bus: ISheduleItem) => {
		Vibration.vibrate(15);
		navigation.navigate('Route', {
			screen: 'BusRoute',
			params: { id: bus.id, busRoute: bus.busRoute },
		});
	};

	const _renderItem = (item: ISheduleItem) => {
		const ticketsStatus = item.ticketsStatus.includes('продаж')
			? 'У продажі'
			: item.ticketsStatus;
		let cardBackgroud = getTicketsStatusColor(ticketsStatus);
		return (
			<BusRouteButton
				onPress={() => moveToRoute(item)}
				style={{
					backgroundColor: cardBackgroud || 'rgba(134, 134, 134, 0.6)',
				}}>
				<BusRouteCard station={station} sheduleItem={item} />
				<BusRouteStatus>
					<BusRouteStatusText>{ticketsStatus}</BusRouteStatusText>
				</BusRouteStatus>
			</BusRouteButton>
		);
	};

	if (sheduleError) {
		return (
			<ErrorLoad
				actionHandler={() => navigation.goBack()}
				actionText="На головну"
				errorText="Помилка при завантаженні даних"
			/>
		);
	}
	if (sheduleIsLoading) {
		return <Loading />;
	}

	return (
		<Container>
			{sheduleData?.length === 0 ? (
				<NoDataContainer>
					<BusRouteStatusText>
						Наразі інформації щодо розкладу немає
					</BusRouteStatusText>
				</NoDataContainer>
			) : (
				<FlashList
					estimatedItemSize={175}
					contentContainerStyle={{ padding: 5 }}
					data={sheduleData}
					renderItem={({ item }) => _renderItem(item)}
				/>
			)}
		</Container>
	);
};
const Container = styled.View`
	flex-grow: 1;
	flex-shrink: 1;
	background-color: #fff;
`;
const BusRouteButton = styled.TouchableOpacity`
	padding: 10px;
	border-radius: 12px;
	background-color: rgba(127, 17, 224, 0.2);
	overflow: hidden;
	margin-bottom: 5px;
`;
const BusRouteStatus = styled.View`
	flex-grow: 1;
	flex-direction: row;
`;
const BusRouteStatusText = styled.Text`
	font-size: 16px;
	color: #000;
	font-weight: 700;
`;
const HeaderUpdateContainer = styled.View``;
const HeaderUpdateText = styled.Text`
	font-size: 14px;
	color: #000;
`;
const NoDataContainer = styled.View`
	flex-grow: 1;
	align-items: center;
	justify-content: center;
`;
const HeaderRightContainer = styled.View`
	flex-direction: row;
	align-items: center;
`;

export default StationShedule;
