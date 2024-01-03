import { View, Text, Touchable, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import MapView, { Callout, CalloutSubview, LatLng, Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { waypoint, waypoints } from '../screens/Route'
import Config from "react-native-config";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconIonic from 'react-native-vector-icons/Ionicons'

type Props = {
    waypoints: waypoints
    updateMapPoint: (pointLatLng: LatLng, pointId: number) => void
    navigateToMapScreen: () => void
}

const RouteMap = ({waypoints, updateMapPoint, navigateToMapScreen}: Props) => {
    if(!waypoints?.last || !waypoints.first){
        return <View><Text>Error</Text></View>
    }
    return (
    <MapContainer>
        <MapView style={{width: '100%', height: '100%'}}
        onPress={navigateToMapScreen}
        initialRegion={{
            latitude: waypoints.first.position.latitude,
            longitude: waypoints.first.position.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
        }}
        >
        <MapViewDirections
            origin={waypoints?.first?.position}
            destination={waypoints?.last?.position}
            apikey={Config.GOGLE_MAPS_KEY}
            optimizeWaypoints={true}
            strokeColor='hotpink'
            strokeWidth={3}
            onError={(error) => {console.log('error', error)}}
            waypoints={waypoints?.middle?.map(wp => wp.position)} 
            tappable={true}
            // precision='high'
        />
            <Marker 
            icon={require('../assets/bus-station.png')} 
            title={waypoints.first.name} 
            coordinate={waypoints.first.position} />
            {
                waypoints?.middle?.map((waypoint, index) => {
                        return (
                            <Marker 
                            key={`${waypoint.position.latitude}${waypoint.position.longitude}${index}`} 
                            icon={require('../assets/pin.png')}
                            title={waypoint.name} 
                            coordinate={waypoint.position}
                            />
                        )
                })
            }
            <Marker 
            icon={require('../assets/bus-station.png')}
            title={waypoints.last.name} 
            coordinate={waypoints.last.position}
            />
        </MapView>
    </MapContainer>
  )
}

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
`

export default RouteMap