import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import SearchByRoute from '../components/SearchByRoute';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusFindStackParamList } from '../navigation/Navigation';
import { IBusStations, ISheduleItem } from '../store/types';
import SearchByStation from '../components/SearchByStation';
import { useGetAllStationsQuery } from '../store/slices/stationsAPI';
import Loading from '../components/Loading';
import ErrorLoad from '../components/ErrorLoad';
import BusRouteCard from '../components/BusRouteCard';
import Collapsible from 'react-native-collapsible';

const Search = ({
	navigation,
	route,
}: NativeStackScreenProps<BusFindStackParamList, 'SearchScreen'>) => {
	const {
		data: allStations,
		isLoading: stationsIsLoading,
		error: stationsError,
	} = useGetAllStationsQuery();
	const [selectedSearchType, setSelectedSearchType] = useState<
		'byStations' | 'byRoute'
	>('byRoute');
	const [resultData, setResultData] = useState<
		{ sheduleItem: ISheduleItem; station: IBusStations }[]
	>([]);
	const [collapsed, setIsCollapsed] = useState<boolean>(true);
	const moveToRoute = (bus: ISheduleItem) => {
		navigation.navigate('Route', { screen: 'BusRoute', params: bus });
	};

	const changeScreen = () => {
		setIsCollapsed(true);
		setResultData([]);
		setSelectedSearchType(
			selectedSearchType === 'byRoute' ? 'byStations' : 'byRoute',
		);
	};
	useEffect(() => {
		if (selectedSearchType === 'byStations') {
			setIsCollapsed(true);
		}
	}, [resultData]);

	if (stationsIsLoading) {
		return <Loading color="#000" />;
	}
	if (!allStations) {
		return (
			<ErrorLoad
				actionHandler={() => navigation.goBack()}
				actionText="На головну"
				errorText="Помилка при завантаженні"
			/>
		);
	}

	const _renderItem = (item: {
		sheduleItem: ISheduleItem;
		station: IBusStations;
	}) => {
		return (
			<RouteButton onPress={() => moveToRoute(item.sheduleItem)}>
				<BusRouteCard station={item.station} sheduleItem={item.sheduleItem} />
			</RouteButton>
		);
	};

	return (
		<Container>
			<Collapsible collapsed={collapsed} style={{ backgroundColor: '#eaeaea' }}>
				<Main>
					{selectedSearchType === 'byRoute' ? (
						<SearchByRoute
							allStations={allStations.filter(
								station => !!station.linkToSheduleBoard,
							)}
							setResultsData={setResultData}
							navigateToMain={() => navigation.goBack()}
						/>
					) : (
						<SearchByStation
							allStations={allStations}
							setResultsData={setResultData}
						/>
					)}
				</Main>
			</Collapsible>
			<ChangeCollapsibleButton onPress={() => setIsCollapsed(coll => !coll)}>
				<CollapsibleButtonLine />
				<CollapsibleButtonLine />
				<CollapsibleButtonLine style={{ marginBottom: 0 }} />
			</ChangeCollapsibleButton>
			<SearchTypes>
				<SearchType
					onPress={() => selectedSearchType !== 'byRoute' && changeScreen()}
					style={
						selectedSearchType === 'byRoute' && { backgroundColor: '#000' }
					}>
					<SearchTypeText
						style={selectedSearchType === 'byRoute' && { color: '#fff' }}>
						По маршрутах
					</SearchTypeText>
				</SearchType>
				<SearchType
					onPress={() => selectedSearchType !== 'byStations' && changeScreen()}
					style={
						selectedSearchType === 'byStations' && { backgroundColor: '#000' }
					}>
					<SearchTypeText
						style={selectedSearchType === 'byStations' && { color: '#fff' }}>
						По станціях
					</SearchTypeText>
				</SearchType>
			</SearchTypes>

			<FlatList
				contentContainerStyle={{
					padding: 5,
				}}
				data={resultData}
				renderItem={({ item }) => _renderItem(item)}
			/>
		</Container>
	);
};

const Container = styled.View`
	flex-shrink: 1;
`;
const SearchTypes = styled.View`
	flex-direction: row;
	margin-top: 5px;
	padding: 5px;
	justify-content: space-evenly;
	z-index: 10;
`;
const SearchType = styled.TouchableOpacity`
	overflow: hidden;
	border: 1px;
	border-color: #000;
	border-radius: 12px;
	margin: 0 2px;
	width: 48%;
	padding: 5px;
`;
const SearchTypeText = styled.Text`
	font-size: 16px;
	font-weight: 700;
	text-align: center;
	color: #000;
`;
const Main = styled.View`
	padding-bottom: 10px;
	border-radius: 0 0 10px 10px;
	overflow: hidden;
	background-color: #ffffff;
`;
const RouteButton = styled.TouchableOpacity`
	padding: 10px;
	border-radius: 12px;
	background-color: rgba(127, 17, 224, 0.2);
	overflow: hidden;
	margin-bottom: 5px;
`;

const ChangeCollapsibleButton = styled.TouchableOpacity`
	width: 100px;
	border-bottom-right-radius: 12px;
	border-bottom-left-radius: 12px;
	align-self: center;
	height: 25px;
	opacity: 1;
	justify-content: center;
	align-items: center;
	background-color: #000;
`;
const CollapsibleButtonLine = styled.View`
	width: 30px;
	height: 1.5px;
	margin-bottom: 3px;
	background-color: #fff;
`;

export default Search;
