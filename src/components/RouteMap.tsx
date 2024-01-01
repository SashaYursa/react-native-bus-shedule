import { View, Text, Touchable, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import MapView, { Callout, CalloutSubview, LatLng, Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { waypoint } from '../screens/Route'
import Config from "react-native-config";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type Props = {
    waypoints: waypoint[] | null
    firstPoint: waypoint | null
    lastPoint: waypoint | null
    updateMapPoint: (pointLatLng: LatLng, pointId: number) => void
}

const RouteMap = ({firstPoint, lastPoint, waypoints, updateMapPoint}: Props) => {
    const [selectedMarker, setSelectedMarker] = useState<number | null>(null)
    useEffect(() => {
        console.log(selectedMarker)
    }, [selectedMarker])
    return (
    <MapContainer>
        <MapView style={{width: '100%', height: '100%'}}
        initialRegion={{
            latitude: firstPoint?.position.latitude ? firstPoint?.position.latitude : 48.622373,
            longitude: firstPoint?.position.longitude ? firstPoint?.position.longitude : 22.302257,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
        }}
        >
        <MapViewDirections
            origin={firstPoint?.position}
            destination={lastPoint?.position}
            apikey={Config.GOGLE_MAPS_KEY}
            optimizeWaypoints={true}
            strokeColor='hotpink'
            strokeWidth={3}
            waypoints={waypoints?.map(wp => wp.position)} 
            tappable={true}
            // precision='high'
        />
            { firstPoint?.position &&
                <Marker draggable={selectedMarker === firstPoint.id} title={firstPoint.name} coordinate={firstPoint?.position}>
                    {selectedMarker !== firstPoint.id}{
                        <Icon name='bus-multiple' size={30} color={'#000'}/>
                    }
                    {/* <Text>{data?.route?.points?.find(wp => wp.id === firstPoint?.id)?.station?.stationName}</Text> */}
                </Marker>
            }
            {
                waypoints?.map((waypoint, index) => (
                    <Marker title={waypoint.name} 
                    draggable={selectedMarker === waypoint.id}
                    key={`${waypoint.position.latitude}${waypoint.position.longitude}${index}`} 
                    coordinate={waypoint.position}
                    >
                        {selectedMarker !== waypoint.id && 
                            <Icon name='bus-stop' size={30} color={'#000'}/>
                        }
                    <Callout onPress={(e) => {
                        if(selectedMarker === waypoint.id){
                            setSelectedMarker(null)
                            if(e.nativeEvent.coordinate?.latitude && e.nativeEvent.coordinate?.longitude){
                                updateMapPoint({latitude: e.nativeEvent.coordinate?.latitude, longitude: e.nativeEvent.coordinate?.longitude}, waypoint.id)
                            }
                        }else{
                            setSelectedMarker(waypoint.id)
                        }
                        }} tooltip={true}>
                    <View 
                    style={{
                        backgroundColor: "green", 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        paddingTop: 3, 
                        paddingBottom: 3, 
                        paddingLeft: 5, 
                        paddingRight: 5, 
                        borderRadius: 12,
                        width: 200 
                        }}>
                        <Text style={{color: '#fff'}}>
                            Перемістити точку
                        </Text>
                    </View>
                </Callout>
                        {/* <Text>{data?.route?.points?.find(wp => wp.id === waypoint?.id)?.station?.stationName}</Text> */}
                    </Marker>
                ))
            }
            { lastPoint?.position &&
            <Marker  draggable={selectedMarker === lastPoint.id} onDragEnd={(e) => {Alert.alert("Змінити розташування?", "")}} coordinate={lastPoint?.position}>
                {selectedMarker !== lastPoint.id &&
                    <Icon name='bus-multiple' size={30} color={'#000'}/>
                }
                <Callout tooltip={true}>
                    <View 
                    style={{
                        backgroundColor: "green", 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        paddingTop: 3, 
                        paddingBottom: 3, 
                        paddingLeft: 5, 
                        paddingRight: 5, 
                        borderRadius: 12, 
                        width: 200
                        }}>
                        <Text style={{color: '#fff'}}>
                            Перемістити точку
                        </Text>
                    </View>
                </Callout>
            </Marker>
            }
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