import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, Region } from 'react-native-maps';
import styled from 'styled-components/native';
import { RouteStackParamList } from '../navigation/Navigation';
import {
	useAddBusStationLocationMutation,
	useUpdateBusStationPointMutation,
	useGetRouteQuery,
} from '../store/slices/stationsAPI';
import MapViewDirections from 'react-native-maps-directions';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { waypoint, waypoints } from './Route';
import MapMarker from '../components/MapMarker';
import MapRouteList from '../components/MapRouteList';
import { IBusRoute } from '../store/types';
import ErrorLoad from '../components/ErrorLoad';
import { sliceWaypointsArrayToConstLength } from '../utils/helpers';

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
	const { isLoading, error, isError, data: response } = useGetRouteQuery(busId);
	const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
	const [points, setPoints] = useState<mapPoint[]>([]);
	const [currentAddPointId, setCurrentAddPointId] = useState<number | null>(
		null,
	);
	const [createMapPosition, setCreateMapPosition] = useState<Region | null>(
		null,
	);
	const [addBusStationLocation, { data: addData, error: addError }] =
		useAddBusStationLocationMutation();
	const [updateBusPoint, { data: updatePointData, error: updatePointError }] =
		useUpdateBusStationPointMutation();
	const mapRef = useRef<MapView | null>(null);
	const [data, setData] = useState<IBusRoute | null>(null);
	useEffect(() => {
		if (response?.res) {
			setData(response?.res);
		}
	}, [response]);

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

	let wayPointsForMiddleDirection: waypoint[] = [];
	if (waypoints?.middle) {
		console.log('rerender map');
		wayPointsForMiddleDirection = sliceWaypointsArrayToConstLength(
			waypoints?.middle,
			23,
		);
	}

	useEffect(() => {
		if (data?.route) {
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

	const moveToMarker = (id: number) => {
		const findMarker = data?.route?.points.find(p => p.id === id);
		mapRef.current?.fitToSuppliedMarkers([String(findMarker?.id)]);
	};

	if (!waypoints?.first || !waypoints?.last) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: '#fff',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				<Text style={{ fontSize: 16, color: '#000', fontWeight: '700' }}>
					Помилка
				</Text>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{
						marginTop: 10,
						borderRadius: 12,
						backgroundColor: '#000',
						padding: 10,
					}}>
					<Text style={{ fontSize: 14, color: '#fff' }}>Назад</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const updateMapPoint = (newPosition: LatLng, pointId: number) => {
		if (!currentAddPointId) {
			updateBusPoint({
				id: pointId,
				latitude: newPosition.latitude,
				longitude: newPosition.longitude,
			});
			setSelectedMarker(null);
		}
	};

	const addMapPointAction = (id: number) => {
		setSelectedMarker(id);
		setCurrentAddPointId(id);
	};

	const createMapPoint = () => {
		const findStation = data?.route?.points.find(p => p.id === selectedMarker);
		if (findStation && createMapPosition) {
			addBusStationLocation({
				id: findStation?.station.id,
				latitude: createMapPosition?.latitude,
				longitude: createMapPosition?.longitude,
			});
		}
		setCurrentAddPointId(null);
		setCreateMapPosition(null);
		setSelectedMarker(null);
	};
	const cancelCreateMapPoint = () => {
		setCurrentAddPointId(null);
		setCreateMapPosition(null);
		setSelectedMarker(null);
	};

	const setCreateMapPointRegion = (region: Region) => {
		if (currentAddPointId) {
			setCreateMapPosition(region);
		}
	};

	const handleSetSelectedMarker = (marker: number) => {
		if (!currentAddPointId) {
			setSelectedMarker(marker);
		}
	};

	if (!waypoints?.first || !waypoints.last || !waypoints.middle) {
		return (
			<ErrorLoad
				actionHandler={() => navigation.goBack()}
				actionText="Назад"
				errorText="Помилка при отриманні маршруту"
			/>
		);
	}
	if (isError) {
		return (
			<ErrorLoad
				actionHandler={() => navigation.goBack()}
				actionText="Назад"
				errorText="Помилка при даних"
			/>
		);
	}

	return (
		<Container>
			{!currentAddPointId ? (
				<MapRouteList
					addMarker={addMapPointAction}
					moveToMarker={moveToMarker}
					points={points}
				/>
			) : (
				<>
					<TouchableOpacity
						style={{
							position: 'absolute',
							bottom: 30,
							left: 10,
							padding: 10,
							zIndex: 10,
							borderRadius: 12,
							backgroundColor: '#0F0F0F',
						}}
						onPress={createMapPoint}>
						<Text
							style={{
								textAlign: 'center',
								fontSize: 16,
								fontWeight: '700',
								color: '#fff',
							}}>
							Зберегти
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
						onPress={cancelCreateMapPoint}>
						<Icon name="close-circle-outline" size={30} color="red" />
					</TouchableOpacity>
				</>
			)}
			{currentAddPointId !== null && (
				<View
					pointerEvents={'none'}
					style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						zIndex: 5,
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<Icon
						name="map-marker-down"
						style={{ transform: [{ translateY: -15 }] }}
						color={'red'}
						size={30}
					/>
				</View>
			)}
			<MapView
				style={{ width: '100%', height: '100%' }}
				initialRegion={{
					latitude: waypoints.first.position.latitude,
					longitude: waypoints?.first?.position.longitude,
					latitudeDelta: 0.2,
					longitudeDelta: 0.2,
				}}
				onRegionChangeComplete={region => setCreateMapPointRegion(region)}
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
					onError={() => {
						console.log('erorr in map view direction');
					}}
				/>

				<MapMarker
					id={waypoints.first.id}
					isSelected={selectedMarker === waypoints.first.id}
					name={waypoints.first.name}
					setSelectedMarker={handleSetSelectedMarker}
					savePosition={updateMapPoint}
					position={waypoints.first.position}
					icon={require('../assets/bus-station.png')}
				/>

				{waypoints?.middle?.map((waypoint, index) => (
					<MapMarker
						id={waypoint.id}
						name={waypoint.name}
						position={waypoint.position}
						isSelected={selectedMarker === waypoint.id}
						setSelectedMarker={handleSetSelectedMarker}
						savePosition={updateMapPoint}
						key={index}
						icon={require('../assets/pin.png')}
					/>
				))}

				<MapMarker
					id={waypoints.last.id}
					isSelected={selectedMarker === waypoints.last.id}
					name={waypoints.last.name}
					setSelectedMarker={handleSetSelectedMarker}
					savePosition={updateMapPoint}
					position={waypoints.last.position}
					icon={require('../assets/bus-station.png')}
				/>
			</MapView>
		</Container>
	);
};
const Container = styled.View`
	flex-grow: 1;
	position: relative;
`;

export default Map;
