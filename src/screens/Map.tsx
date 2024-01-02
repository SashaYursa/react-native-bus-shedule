import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, LatLng, Marker, Polyline } from 'react-native-maps';
import styled from 'styled-components/native';
import { BusStackParamList } from '../navigation/Navigation';
import { useGetRouteQuery } from '../store/slices/stationsAPI';
import MapViewDirections from 'react-native-maps-directions';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconIonic from 'react-native-vector-icons/Ionicons'
import { waypoint } from './Route';
import MapMarker from '../components/MapMarker';
import { CommonActions } from '@react-navigation/native';

type Props = {}

const Map = ({route, navigation}: NativeStackScreenProps<BusStackParamList, 'Map'>) => {
    const [selectedMarker, setSelectedMarker] = useState<number | null>(null)
    const [infoListOpen, setInfoListOpen] = useState<boolean>(false)
    const [missedPoints, setMissedPoints] = useState<number[]>([])
    const {waypoints, busId} = route.params
    const {isLoading, error, isError, data} = useGetRouteQuery(busId);
    const mapRef = useRef<MapView | null>(null)

    useEffect(() => {
        if(data){
            const missed = data.route?.points.filter(point => {
                if(point.station.stationAddress === null){
                    return point.longitude === null || point.latitude === null
                }
            }).map(p => p.id)
            if(missed !== undefined){
                setMissedPoints(missed)
            }
            console.log(missed, 'missed points--')
        }
    }, [data])

    const moveToMarker = (id: number) => {
        const findMarker = data?.route?.points.find(p => p.id === id)
        mapRef.current?.fitToSuppliedMarkers([String(findMarker?.id)])
        setInfoListOpen(false)
    }

    if(!waypoints?.first || !waypoints?.last){
        return (
        <View style={{flex: 1, backgroundColor: "#fff", alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 16, color: '#000', fontWeight: '700'}}>Помилка</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BusStations')}
            style={{marginTop: 10, borderRadius: 12, backgroundColor: '#000', padding: 10}}>
                <Text style={{fontSize: 14, color: '#fff'}}>
                    На головну
                </Text>
            </TouchableOpacity>
        </View>
        )
    }

    const updateMapPoint = (newPosition: LatLng, pointId: number) => {
        setSelectedMarker(null)
        if(mapRef){
        }
    }
    
    const addMapPoint = () => {

    }

    return (
        <Container>
            {infoListOpen &&
             <ErrorPointsContainer showsVerticalScrollIndicator={false} contentContainerStyle={{overflow: 'hidden', paddingBottom: 20, flex: 1, minWidth: 200}}>
                <ErrorPointsList>
                    {missedPoints.length > 0 &&
                     <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, color: 'red', textAlign: 'center'}}>Точки які відсутні на карті</Text>
                        { 
                            missedPoints.map(point => {
                                return (
                                    <ErrorPointItem key={point}>
                                        <Text style={{flex: 1}}>
                                            {data?.route?.points.find(p => p.id === point)?.station.stationName}
                                        </Text>
                                        <TouchableOpacity onPress={() => moveToMarker(waypoints.first.id)} style={{padding: 5, backgroundColor: 'green', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                                            <Text>
                                                Додати
                                            </Text>
                                        </TouchableOpacity>
                                    </ErrorPointItem>
                                )
                            })
                        }
                    </View> 
                    }
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, color: 'green', textAlign: 'center', marginTop: 10}}>Маршрут</Text>
                    <ErrorPointItem>
                        <Text style={{flex: 1}}>
                            Поч. {data?.route?.points.find(p => p.id === waypoints.first.id)?.station.stationName}
                        </Text>
                        <TouchableOpacity onPress={() => moveToMarker(waypoints.first.id)} style={{padding: 10, backgroundColor: '#000', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: '#fff'}}>
                                Перейти
                            </Text>
                        </TouchableOpacity>
                    </ErrorPointItem>
                    { waypoints.middle &&
                        waypoints.middle.map(point => {
                            return (
                                <ErrorPointItem key={point.id}>
                                    <Text style={{flex: 1}}>
                                        {data?.route?.points.find(p => p.id === point.id)?.station.stationName}
                                    </Text>
                                    <TouchableOpacity onPress={() => moveToMarker(point.id)} style={{padding: 10, backgroundColor: '#000', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{color: '#fff'}}>
                                            Перейти
                                        </Text>
                                    </TouchableOpacity>
                                </ErrorPointItem>
                            )
                        })
                    }
                    <ErrorPointItem>
                        <Text style={{flex: 1}}>
                            Кін. {data?.route?.points.find(p => p.id === waypoints.last.id)?.station.stationName}
                        </Text>
                        <TouchableOpacity onPress={() => moveToMarker(waypoints.last.id)} style={{padding: 10, backgroundColor: '#000', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: '#fff'}}>
                                Перейти
                            </Text>
                        </TouchableOpacity>
                    </ErrorPointItem>
                    </View> 
                </ErrorPointsList>
              </ErrorPointsContainer>
            }
            <ErrorInfoButton onPress={() => setInfoListOpen(prev => !prev)}><Icon name={infoListOpen ? 'close-circle-outline' :'information-outline'} size={30} color={infoListOpen ? 'red' : '#000000'}/></ErrorInfoButton>
            <MapView style={{width: '100%', height: '100%'}}
            initialRegion={{
                latitude: waypoints.first.position.latitude,
                longitude: waypoints?.first?.position.longitude,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2,
            }}
            onLayout={() => mapRef.current?.fitToCoordinates([waypoints.first.position, waypoints.last.position])}
            ref={mapRef}
            >

                <MapViewDirections
                origin={waypoints?.first?.position}
                destination={waypoints?.last?.position}
                apikey={Config.GOGLE_MAPS_KEY}
                strokeColor='hotpink'
                strokeWidth={3}
                waypoints={waypoints?.middle?.map(wp => wp.position)} 
                tappable={true}
                onError={() => {console.log("erorr in map view direction")}}
                />
                <MapMarker
                id={waypoints.first.id}
                isSelected={selectedMarker === waypoints.first.id}
                name={waypoints.first.name}
                setSelectedMarker={setSelectedMarker}
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
                setSelectedMarker={setSelectedMarker} 
                savePosition={updateMapPoint}
                key={index}
                icon={require('../assets/pin.png')}
                />
            ))}
                <MapMarker
                id={waypoints.last.id}
                isSelected={selectedMarker === waypoints.last.id}
                name={waypoints.last.name}
                setSelectedMarker={setSelectedMarker}
                savePosition={updateMapPoint}
                position={waypoints.last.position}
                icon={require('../assets/bus-station.png')}
                />
            </MapView>
        </Container>
    )
}
const Container = styled.View`
    flex-grow: 1;
    position: relative;
`

const ErrorPointsContainer = styled.ScrollView`
    position: absolute;
    z-index: 2;
    top: 10px;
    max-height: 300px;
    max-width: 300px;
    right: 50px;
    padding: 5px;
    background-color: #fff;
    border-width: 1px;
    border-color: #000;
    border-radius: 12px;
    overflow: hidden;
`
const ErrorPointsList = styled.View`
    position: relative;
    flex-grow: 1;
    background-color: #fff;
    overflow: hidden;
`
const ErrorInfoButton = styled.TouchableOpacity`
    position: absolute;
    z-index: 2;
    top: 10px;
    right: 10px;
`

const ErrorPointItem = styled.View`
margin-top: 5px;
flex-direction: row;
background-color: #dddd;
border-radius: 12px;
border-color: #000;
padding: 5px;
flex-grow:1;
`

export default Map;