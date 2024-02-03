import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Region } from 'react-native-maps';
import styled from 'styled-components/native';
import { RouteStackParamList } from '../navigation/Navigation';
import {
	useAddBusStationLocationMutation,
	useUpdateBusStationPointForCurrentRouteMutation,
	useGetRouteQuery,
} from '../store/slices/stationsAPI';
import MapViewDirections from 'react-native-maps-directions';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { waypoint, waypoints } from './Route';
import MapMarker from '../components/MapMarker';
import MapRouteList from '../components/MapRouteList';
import ErrorLoad from '../components/ErrorLoad';
import { sliceWaypointsArrayToConstLength } from '../utils/helpers';
import Loading from '../components/Loading';
import { point } from '../store/types';
import CollapseError from '../components/CollapseError';

export type mapPoint = {
	isMissed: boolean;
	name: string;
	id: number;
};

type Props = {};

const Map = ({
	route,
	navigation,
}: NativeStackScreenProps<RouteStackParamList, 'Map'>) => {
	const { busId } = route.params;
	const { isLoading, isError, data: response } = useGetRouteQuery(busId);
	const [selectedMarker, setSelectedMarker] = useState<point | null>(null);
	const [points, setPoints] = useState<mapPoint[]>([]);
	const [newMapPointRegion, setNewMapPointRegion] = useState<Region | null>(
		null,
	);

	const [
		addBusStationLocation,
		{ data: addData, error: addError, isError: addHasError },
	] = useAddBusStationLocationMutation();
	const [
		updateBusStationLocationForCurrentRoute,
		{ data: updatePointData, error: updatePointError, isError: updateHasError },
	] = useUpdateBusStationPointForCurrentRouteMutation();
	const mapRef = useRef<MapView | null>(null);
	const data = response?.route;

	useEffect(() => {
		if (data?.route?.points) {
			setPoints(
				data.route?.points.map(point => {
					const isMissed = !point.station.latitude && !point.latitude;
					return {
						id: point.id,
						name: point.station.stationName,
						isMissed,
					};
				}),
			);
		}
	}, [data]);

	let waypoints: waypoints = null;

	if (data?.route?.points) {
		let res: waypoint[] = data.route.points
			.filter(i => i.fullAddress !== null)
			.map(point => {
				if (point.latitude && point.longitude) {
					return {
						id: point.id,
						name: point.station.stationName,
						type: 'current_point_position',
						position: {
							latitude: Number(point.latitude),
							longitude: Number(point.longitude),
						},
					};
				}
				return {
					id: point.id,
					name: point.station.stationName,
					type: 'station_position',
					position: {
						latitude: point?.station?.latitude
							? Number(point?.station.latitude)
							: 0,
						longitude: point?.station?.longitude
							? Number(point?.station?.longitude)
							: 0,
					},
				};
			});
		res = res.filter(
			wp => wp.position.latitude !== 0 && wp.position.longitude !== 0,
		);
		const first = res.shift();
		const last = res.pop();
		if (first && last) {
			waypoints = { first, middle: res, last };
		}
	}

	const setSelectedMarkerHandler = (id: number) => {
		const findMarker = data?.route?.points.find(point => point.id === id);
		if (findMarker) {
			setSelectedMarker(findMarker);
		}
	};

	const wayPointsForMiddleDirection: waypoint[] = waypoints?.middle
		? sliceWaypointsArrayToConstLength(waypoints.middle, 23)
		: [];

	const moveToMarker = (id: number) => {
		const findMarker = data?.route?.points.find(p => p.id === id);
		mapRef.current?.fitToSuppliedMarkers([String(findMarker?.id)]);
	};

	const updateMapPoint = () => {
		if (newMapPointRegion && selectedMarker) {
			if (!selectedMarker.latitude && !selectedMarker.station.latitude) {
				addBusStationLocation({
					id: selectedMarker.station.id,
					latitude: newMapPointRegion.latitude,
					longitude: newMapPointRegion.longitude,
				});
			} else {
				updateBusStationLocationForCurrentRoute({
					id: selectedMarker.id,
					latitude: newMapPointRegion.latitude,
					longitude: newMapPointRegion.longitude,
				});
			}
			setSelectedMarker(null);
		}
	};
	const cancelCreateMapPoint = () => {
		setNewMapPointRegion(null);
		setSelectedMarker(null);
	};

	if (isLoading) {
		return <Loading />;
	}

	if (isError) {
		return (
			<ErrorLoad
				actionHandler={() => navigation.goBack()}
				actionText="Назад"
				errorText="Помилка при отриманні даних"
			/>
		);
	}

	if (!waypoints?.first || !waypoints.last || !waypoints.middle) {
		return (
			<ErrorLoad
				actionHandler={() => navigation.goBack()}
				actionText="Назад"
				errorText="Помилка при отриманні маршруту"
			/>
		);
	}

	return (
		<Container>
			<CollapseError
				showError={!!addHasError || !!updateHasError}
				message={
					!!addHasError
						? 'Помилка, точку не додано'
						: 'Помилка, точку не оновлено'
				}
			/>
			{!selectedMarker ? (
				<MapRouteList
					addMarker={setSelectedMarkerHandler}
					moveToMarker={moveToMarker}
					points={points}
				/>
			) : (
				<>
					<ActionEditPointButton onPress={updateMapPoint}>
						<EditPointButtonText>Зберегти</EditPointButtonText>
					</ActionEditPointButton>
					<CancelEditPointButton onPress={cancelCreateMapPoint}>
						<Icon name="close-circle-outline" size={30} color="red" />
					</CancelEditPointButton>
					<EditPointContainer pointerEvents={'none'}>
						<Icon
							name="map-marker-down"
							style={{ transform: [{ translateY: -15 }] }}
							color={'red'}
							size={30}
						/>
					</EditPointContainer>
				</>
			)}
			<MapView
				style={{ width: '100%', height: '100%' }}
				initialRegion={{
					latitude: waypoints.first.position.latitude,
					longitude: waypoints?.first?.position.longitude,
					latitudeDelta: 0.2,
					longitudeDelta: 0.2,
				}}
				onRegionChangeComplete={region => setNewMapPointRegion(region)}
				onLayout={() => {
					if (waypoints?.first.position && waypoints.last.position) {
						mapRef.current?.fitToCoordinates([
							waypoints.first.position,
							waypoints.last.position,
						]);
					}
				}}
				ref={mapRef}>
				<MapViewDirections
					origin={waypoints?.first?.position}
					destination={waypoints?.last?.position}
					apikey={Config.GOGLE_MAPS_KEY}
					strokeColor="hotpink"
					strokeWidth={3}
					waypoints={wayPointsForMiddleDirection?.map(wp => wp.position)}
					tappable={true}
					onError={() => {}}
				/>

				<MapMarker
					id={waypoints.first.id}
					isSelected={selectedMarker?.id === waypoints.first.id}
					name={waypoints.first.name}
					setSelectedMarker={setSelectedMarkerHandler}
					removeSelectedMarker={() => setSelectedMarker(null)}
					position={waypoints.first.position}>
					<MarkerImage source={require('../assets/bus-station.png')} />
				</MapMarker>

				{waypoints?.middle?.map((waypoint, index) => (
					<MapMarker
						id={waypoint.id}
						name={waypoint.name}
						position={waypoint.position}
						isSelected={selectedMarker?.id === waypoint.id}
						setSelectedMarker={setSelectedMarkerHandler}
						removeSelectedMarker={() => setSelectedMarker(null)}
						key={index}>
						<MarkerImage source={require('../assets/pin.png')} />
					</MapMarker>
				))}

				<MapMarker
					id={waypoints.last.id}
					isSelected={selectedMarker?.id === waypoints.last.id}
					name={waypoints.last.name}
					setSelectedMarker={setSelectedMarkerHandler}
					removeSelectedMarker={() => setSelectedMarker(null)}
					position={waypoints.last.position}>
					<MarkerImage source={require('../assets/bus-station.png')} />
				</MapMarker>
			</MapView>
		</Container>
	);
};
const Container = styled.View`
	flex-grow: 1;
	position: relative;
`;

const CancelEditPointButton = styled.TouchableOpacity`
	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 2;
`;
const ActionEditPointButton = styled.TouchableOpacity`
	position: absolute;
	bottom: 30px;
	left: 10px;
	padding: 10px;
	border-radius: 12px;
	background-color: #0f0f0f;
	z-index: 2;
`;
const EditPointButtonText = styled.Text`
	text-align: center;
	font-size: 16px;
	font-weight: 700;
	color: #fff;
`;

const EditPointContainer = styled.View`
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 2;
	align-items: center;
	justify-content: center;
`;

const MarkerImage = styled.Image`
	width: 25px;
	height: 25px;
`;

export default Map;
