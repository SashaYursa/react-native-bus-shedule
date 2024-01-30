import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { BusStackParamList } from '../navigation/Navigation';
import {
	busTime,
	useGetStationTimesQuery,
	useLazyGetStationTimesQuery,
} from '../store/slices/stationsAPI';
import BusRouteCard from '../components/BusRouteCard';
import { FlashList } from '@shopify/flash-list';
import BusTime from '../components/BusTime';
import Loading from '../components/Loading';
import ErrorLoad from '../components/ErrorLoad';
import { useNetInfo } from '@react-native-community/netinfo';
import { useAppSelector } from '../store';

type Props = {};

const StationTimes = ({
	navigation,
	route,
}: NativeStackScreenProps<BusStackParamList, 'StationTimes'>) => {
	const netInfo = useNetInfo();
	const stationTimes = useAppSelector(
		state =>
			state.stationTimes.find(
				station => station.stationId === route.params.station.id,
			)?.routes,
	);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	// // const { data, isError, error, isLoading, refetch } = useGetStationTimesQuery(
	// 	route.params.station.id,
	// );

	const [getTimes, { isLoading, isError, data }] =
		useLazyGetStationTimesQuery();

	useEffect(() => {
		if (route.params.station) {
			navigation.setOptions({
				headerTitle: route.params.station.stationName,
			});
		}
	}, [route.params.station]);

	useEffect(() => {
		if (!stationTimes?.length && netInfo.isConnected) {
			getTimes(route.params.station.id);
		}
	}, [route.params, netInfo]);

	console.log(stationTimes?.length);

	useEffect(() => {
		if (isRefreshing) {
			getTimes(route.params.station.id);
			setIsRefreshing(false);
		}
	}, [isRefreshing]);

	const moveToRoute = (params: { id: number; busRoute: string }) => {
		navigation.navigate('Route', { screen: 'BusRoute', params });
	};

	const _renderItem = (item: busTime, index: number) => {
		const bgColor = index % 2 === 0 ? '#dbff9a' : '#41b874';
		return (
			<TouchableOpacity
				onPress={() => moveToRoute({ id: item.id, busRoute: item.busRoute })}>
				<BusTime bus={item} bgColor={bgColor} />
			</TouchableOpacity>
		);
	};

	if (isLoading) {
		return <Loading />;
	}
	if (isError) {
		return (
			<ErrorLoad
				actionText="На головну"
				actionHandler={() => {
					navigation.pop();
					navigation.pop();
				}}
				errorText="Помилка при отриманні даних"
			/>
		);
	}

	return stationTimes?.length ? (
		<FlashList
			estimatedItemSize={81}
			renderItem={({ item, index }) => _renderItem(item, index)}
			data={stationTimes}
			refreshing={isRefreshing}
			onRefresh={() => setIsRefreshing(true)}
		/>
	) : (
		<ScrollView
			refreshControl={
				<RefreshControl
					onRefresh={() => setIsRefreshing(true)}
					refreshing={isRefreshing}
				/>
			}>
			<ErrorLoad
				actionText="На головну"
				actionHandler={() => {
					navigation.pop();
					if (navigation.canGoBack()) navigation.pop();
				}}
				errorText="Дані відсутні"
			/>
		</ScrollView>
	);
};

export default StationTimes;
