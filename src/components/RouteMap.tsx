import { View, Text, Image } from 'react-native';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { waypoint, waypoints } from '../screens/Route';
import Config from 'react-native-config';
import { sliceWaypointsArrayToConstLength } from '../utils/helpers';
import MapMarker from './MapMarker';

type Props = {
	waypoints: waypoints;
	navigateToMapScreen: () => void;
};

const RouteMap = ({ waypoints, navigateToMapScreen }: Props) => {
	if (!waypoints?.last || !waypoints.first) {
		return (
			<View>
				<Text>Error</Text>
			</View>
		);
	}
	let middleWayPointsForDirection: waypoint[] = [];
	if (waypoints.middle) {
		middleWayPointsForDirection = sliceWaypointsArrayToConstLength(
			waypoints.middle,
			23,
		);
	}

	return (
		<MapContainer>
			<MapView
				style={{
					width: '100%',
					height: '100%',
				}}
				onPress={() => {
					navigateToMapScreen();
				}}
				initialRegion={{
					latitude: waypoints.first.position.latitude,
					longitude: waypoints.first.position.longitude,
					latitudeDelta: 0.2,
					longitudeDelta: 0.2,
				}}>
				<MapViewDirections
					origin={waypoints?.first?.position}
					destination={waypoints?.last?.position}
					apikey={Config.GOGLE_MAPS_KEY}
					optimizeWaypoints={true}
					strokeColor="hotpink"
					strokeWidth={3}
					onError={error => {
						console.log('error', error);
					}}
					waypoints={middleWayPointsForDirection.map(
						(wp: waypoint) => wp.position,
					)}
					tappable={true}
					// precision='high'
				/>
				<MapMarker
					id={waypoints.first.id}
					name={waypoints.first.name}
					position={waypoints.first.position}>
					<MarkerImage source={require('../assets/bus-station.png')} />
				</MapMarker>
				{waypoints?.middle?.map((waypoint, index) => {
					return (
						<MapMarker
							key={`${waypoint.position.latitude}${waypoint.position.longitude}${index}`}
							id={waypoint.id}
							name={waypoint.name}
							position={waypoint.position}>
							<MarkerImage source={require('../assets/pin.png')} />
						</MapMarker>
					);
				})}
				<MapMarker
					id={waypoints.last.id}
					name={waypoints.last.name}
					position={waypoints.last.position}>
					<MarkerImage source={require('../assets/bus-station.png')} />
				</MapMarker>
			</MapView>
		</MapContainer>
	);
};

const MapContainer = styled.View`
	margin: 0 auto;
	width: 98%;
	height: 400px;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	overflow: hidden;
	border-color: 1px;
	margin-bottom: 20px;
`;

const MarkerImage = styled.Image`
	width: 25px;
	height: 25px;
`;

export default RouteMap;
