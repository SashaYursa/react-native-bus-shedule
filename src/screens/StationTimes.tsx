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
import { busTime, useGetStationTimesQuery } from '../store/slices/stationsAPI';
import BusRouteCard from '../components/BusRouteCard';
import { FlashList } from '@shopify/flash-list';
import BusTime from '../components/BusTime';
import Loading from '../components/Loading';
import ErrorLoad from '../components/ErrorLoad';

type Props = {};

const StationTimes = ({
	navigation,
	route,
}: NativeStackScreenProps<BusStackParamList, 'StationTimes'>) => {
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const { data, isError, error, isLoading, refetch } = useGetStationTimesQuery(
		route.params.station.id,
	);

	useEffect(() => {
		if (route.params.station) {
			navigation.setOptions({
				headerTitle: route.params.station.stationName,
			});
		}
	}, [route.params.station]);

	useEffect(() => {
		console.log('data', data);
	}, [data]);

	useEffect(() => {
		if (isRefreshing) {
			refetch();
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

	return data?.length ? (
		<FlashList
			estimatedItemSize={81}
			renderItem={({ item, index }) => _renderItem(item, index)}
			data={data}
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
					navigation.pop();
				}}
				errorText="Дані відсутні"
			/>
		</ScrollView>
	);
};

export default StationTimes;
