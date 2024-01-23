import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Animated } from 'react-native';
import { useGetStationsQuery } from '../store/slices/stationsAPI';
import styled from 'styled-components/native';
import { IBusStations } from '../store/types';
import Search from '../components/Search';
import { BusStackParamList } from '../navigation/Navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo';
import BusStation from '../components/busStation';
import Loading from '../components/Loading';
import { FlashList } from '@shopify/flash-list';

const HEADER_HEIGHT = 60;

const BusStations = ({
	navigation,
}: NativeStackScreenProps<BusStackParamList, 'BusStations'>) => {
	const netInfo = useNetInfo();
	const {
		data: stations,
		isLoading: stationsLoading,
		error,
		refetch,
	} = useGetStationsQuery();
	const [filteredStations, setFilteredStations] = useState(stations);
	const [searchFieldIsFocused, setSearchFieldIsFocused] =
		useState<boolean>(false);
	const scrollY = useRef(new Animated.Value(0));
	const scrollDiffClamp = useRef(
		Animated.diffClamp(scrollY.current, 0, HEADER_HEIGHT),
	);
	const translateY = useRef(
		scrollDiffClamp.current.interpolate({
			inputRange: [0, HEADER_HEIGHT],
			outputRange: [0, -HEADER_HEIGHT],
		}),
	).current;

	useEffect(() => {
		if (netInfo.isConnected) {
			refetch();
		}
	}, [netInfo.isConnected]);

	useEffect(() => {
		console.log('error', error);
	}, [error]);

	useEffect(() => {
		if (stations) {
			setFilteredStations(stations);
		}
	}, [stations]);

	const updateFilter = (value: string) => {
		setFilteredStations(
			stations?.filter(station => station.stationName.includes(value)),
		);
	};

	const moveToStationShedule = (station: IBusStations) => {
		navigation.navigate('StationShedule', { station });
	};

	const _renderItem = (item: IBusStations) => {
		return (
			<BusStation station={item} moveToStationShedule={moveToStationShedule} />
		);
	};

	if (stationsLoading) {
		return <Loading />;
	}

	return stations?.length ? (
		<Container>
			<Animated.View
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					transform: [{ translateY: translateY }],
					zIndex: 1,
				}}>
				<Search
					isFocused={searchFieldIsFocused}
					setIsFocused={setSearchFieldIsFocused}
					updateFilter={updateFilter}
				/>
			</Animated.View>
			<FlashList
				onScrollBeginDrag={() => {
					if (searchFieldIsFocused) {
						setSearchFieldIsFocused(false);
					}
				}}
				contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
				onScroll={e => {
					const yOffset = e.nativeEvent.contentOffset.y;
					const itemsScrolledPast = yOffset / HEADER_HEIGHT;

					if (itemsScrolledPast <= 0) scrollY.current.setValue(0);
					else scrollY.current.setValue(yOffset);
				}}
				estimatedItemSize={101}
				data={filteredStations}
				renderItem={({ item }) => _renderItem(item)}
			/>
		</Container>
	) : (
		<View>
			<Text>No data</Text>
		</View>
	);
};

const Container = styled.View`
	flex-grow: 1;
	flex-shrink: 1;
	background-color: #fff;
`;

export default BusStations;
