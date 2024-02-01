import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Animated } from 'react-native';
import {
	useGetStationsQuery,
	useLazyGetStationsQuery,
} from '../store/slices/stationsAPI';
import styled from 'styled-components/native';
import { IBusStations } from '../store/types';
import Search from '../components/Search';
import { BusStackParamList } from '../navigation/Navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo';
import BusStation from '../components/busStation';
import Loading from '../components/Loading';
import { FlashList } from '@shopify/flash-list';
import { useAppSelector } from '../store';

const HEADER_HEIGHT = 60;

const BusStations = ({
	navigation,
}: NativeStackScreenProps<BusStackParamList, 'BusStations'>) => {
	const netInfo = useNetInfo();
	const {
		isError: fiserr,
		isFetching: fdata,
		error: ferr,
	} = useGetStationsQuery();

	const stations = useAppSelector(state => state.busStations);

	const [getStations, { isError, isFetching, error }] =
		useLazyGetStationsQuery();
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
		console.log(fdata, 'data');
		console.log(fiserr, 'isError');
		console.log(ferr, 'err');
	}, [fdata, ferr, fiserr]);

	useEffect(() => {
		if (netInfo.isConnected && !stations.length) {
			console.log('need to fetch');
			getStations();
		}
	}, [netInfo.isConnected]);

	if (isError) {
		console.log('error ---> ', error);
	}

	const updateFilter = (value: string) => {
		setFilteredStations(
			stations?.filter(station =>
				station.stationName.toUpperCase().includes(value.toUpperCase()),
			),
		);
	};

	const moveToStationShedule = (station: IBusStations) => {
		navigation.navigate(
			netInfo.isConnected ? 'StationShedule' : 'StationTimes',
			{ station },
		);
	};

	const _renderItem = (item: IBusStations) => {
		return (
			<BusStation station={item} moveToStationShedule={moveToStationShedule} />
		);
	};

	if (isFetching) {
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
