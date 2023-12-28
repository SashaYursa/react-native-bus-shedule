import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useLayoutEffect } from 'react'
import { ActivityIndicator, Button, Text, Vibration, View, ScrollView, StyleSheet } from 'react-native'
import { BusStackParamList } from '../navigation/Navigation'
import { useGetRouteQuery } from '../store/slices/stationsAPI'
import styled from 'styled-components/native'
import { month } from './BusStations'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MapView, { LatLng, Marker } from 'react-native-maps'
import MapViewDirections, { MapViewDirectionsOrigin } from 'react-native-maps-directions'

type Props = {}

const WEEK_DAYS = [
    'Пн',
    "Вт",
    "Ср",
    "Чт",
    "Пт",
    "Сб", 
    "Нд"
]

const Route = ({route, navigation}: NativeStackScreenProps<BusStackParamList, 'BusRoute'>) => {
    const routeData = route.params
    const {isLoading, error, isError, data} = useGetRouteQuery(Number(routeData.id));
    useLayoutEffect(() => {
        if(data) {
            navigation.setOptions({
                headerTitleStyle: {
                    fontSize: 14
                },
                title: data.bus.busRoute
            })
        }
    }, [data])

    let waypoints: LatLng[] = [{
        latitude: 0,
        longitude: 0
    }];
    let firstPoint: MapViewDirectionsOrigin = {
        latitude: 0,
        longitude: 0
    };
    let lastPoint: MapViewDirectionsOrigin = {
        latitude: 0,
        longitude: 0
    };

    if(data?.route?.points){
        waypoints = (data.route.points.filter(i => i.fullAddress !== null).map((point) => ({latitude: point?.location?.lat ? point?.location?.lat : 0, longitude: point?.location?.lng ? point?.location?.lng: 0})))
        const first = waypoints.shift()
        const last = waypoints.pop()
        if(first){
            firstPoint = first
        }
        if(last){
            lastPoint = last
        }
    }
    const GOOGLE_MAPS_APIKEY = ///input key;
    if(isError){
        return <View>
            <Text>
                Error fetch data
                {String(JSON.stringify(error))}
            </Text>
        </View>
    }
    if(isLoading){
        return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large'/>
                </View>
    }
    const firstDay = data?.route?.dates[0].find(j => !!j)
    const lastDay = data?.route?.dates[data?.route?.dates.length - 1].findLast(j => !!j)
    return (
    <Container>
        <DatesContainer>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: '700', color: '#000'}}>
                    {`З ${firstDay}, по ${lastDay}`}
                </Text>
            </View>
            <WeekContainer>
                {WEEK_DAYS.map(dayName => {
                    return (
                        <WeekDay key={dayName}>
                            <DayText style={{fontWeight: '700'}}>
                                {dayName}
                            </DayText>
                        </WeekDay>
                    )
                })}
                </WeekContainer>
                {
                data?.route?.dates.map((week, index) => {
                    return (
                        <WeekContainer key={index}>
                            {week.map((dayItem, index) => {
                                if(dayItem){
                                    const splitted = dayItem.split('-');
                                    const day = splitted[0] + " " + month[(Number(splitted[1]) - 1)]?.substring(0, 3)
                                    return <WeekDay key={index} style={{backgroundColor: 'rgba(19, 191, 0, 0.7)'}}><DayText>{day}</DayText></WeekDay>
                                }
                                return <WeekDay key={index} style={{backgroundColor: 'rgba(134, 134, 134, 0.6)'}}><DayText>-</DayText></WeekDay>
                                })
                            }
                        </WeekContainer>
                    )
                    })
                }
        </DatesContainer>
        <RouteContainer>
                {data?.route?.points.map((point, index) => {
                    return (
                        <RouteItem key={point.pointName}>
                            <RouteLineContainer>
                                <RouteLine style={{borderLeftWidth: index === 0 ? 0 : 2}}/>
                                <Icon style={style.routePointIcon} name="record-circle-outline" color="green" size={26}/>
                                <RouteLine style={{borderLeftWidth: index === Number(data.route?.points.length) - 1 ? 0 : 2}}/>
                            </RouteLineContainer>
                            <RouteItemData>
                                <BusStopContainer>
                                    <BusStopText style={{...style.busStopTitle, color: point.isStation ? 'green' : '#000'}}>{String(point.pointName).trim()}</BusStopText>
                                </BusStopContainer>
                                <BusStopContainer>
                                    <BusStopContainer style={{alignSelf: 'flex-start'}}>
                                        {String(point.departureTime).trim() &&
                                        <>
                                            <Icon name='arrow-up-thin' size={25} color='green'/>
                                            <BusStopText>{String(point.departureTime).trim()} прибуття</BusStopText>
                                        </>
                                        }
                                    </BusStopContainer>
                                    <BusStopContainer style={{alignSelf: 'flex-end'}}>
                                        { point.kilometresFromStation &&
                                        <>
                                            <BusStopText>{point.kilometresFromStation}км.</BusStopText>
                                            <Icon name="map-marker-distance" size={25} color='green'/>
                                        </>
                                        }
                                    </BusStopContainer>
                                </BusStopContainer>
                                <BusStopContainer>
                                    <BusStopContainer style={{alignSelf: 'flex-start'}}>
                                        { String(point.arrivalTime).trim() &&
                                        <>
                                            <Icon name='arrow-down-thin' size={25} color='red'/>
                                            <BusStopText>{String(point.arrivalTime).trim()} відправлення</BusStopText>
                                        </>
                                        }
                                    </BusStopContainer>
                                    <BusStopContainer style={{alignSelf: 'flex-end'}}>
                                        { point.cost &&
                                        <>
                                            <BusStopText>{point.cost}грн.</BusStopText>
                                            <Icon name='cash' size={20} color='green'/>
                                        </>
                                        }
                                    </BusStopContainer>
                                </BusStopContainer>
                            </RouteItemData>
                        </RouteItem>
                    )
                })}
        </RouteContainer>
        <MapContainer>
            <MapView style={{width: '100%', height: '100%'}}
            initialRegion={{
                latitude: data?.route?.points[0]?.location?.lat ? data?.route?.points[0]?.location?.lat : 48.622373,
                longitude: data?.route?.points[0]?.location?.lng ? data?.route?.points[0]?.location?.lng : 22.302257,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2,
            }}
            >
            <MapViewDirections
                origin={firstPoint}
                destination={lastPoint}
                apikey={GOOGLE_MAPS_APIKEY}
                optimizeWaypoints={true}
                strokeColor='hotpink'
                strokeWidth={3}
                waypoints={waypoints} 
                tappable={true}
                // precision='high'
            />
                <Marker coordinate={firstPoint}>
                    <Icon name='bus-multiple' size={30} color={'#000'}/>
                </Marker>
                {
                    waypoints?.map((waypoint, index) => (
                        <Marker key={`${waypoint.latitude}${waypoint.longitude}${index}`} coordinate={waypoint}>
                            <Icon name='bus-stop' size={30} color={'#000'}/>
                        </Marker>
                    ))
                }
                <Marker coordinate={lastPoint}>
                    <Icon name='bus-multiple' size={30} color={'#000'}/>
                </Marker>
            </MapView>
        </MapContainer>
    </Container>
  )
}

const style = StyleSheet.create({
    routePointIcon: {
        position: 'absolute',
        top: '50%', 
        left: '50%', 
        width: 26, 
        height: 26, 
        transform: 
        [
            {translateX: -13}, 
            {translateY: -13}
        ]
    },
    busStopTitle: {
        textAlign:'center',
        flex: 1,
        fontSize: 18,
        fontWeight: '700'
    }

})

const Container = styled.ScrollView`
flex-grow: 1;
flex-shrink: 1;
`
const DatesContainer = styled.View`
display: flex;
flex-grow: 1;
margin: 5px;
`
const RouteContainer = styled.View`
margin: 5px;
flex-grow: 1;
flex-shrink: 1;
`
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
const WeekContainer = styled.View`
flex-direction: row;
justify-content: center;
flex-grow: 1;
`
const WeekDay = styled.View`
align-items: center;
justify-content: center;
flex: 1;
margin: 3px 1.6px;
background-color: #fff;
border-radius: 12px;
padding: 2px;
`

const DayText = styled.Text`
color: #000;
font-size: 13px;
`

const RouteItem = styled.View`
flex-direction: row;
overflow-y: visible;
`
const RouteLineContainer = styled.View`
align-items: center;
flex-direction: column;
position: relative;
overflow-y: visible;
margin: 0 10px;
`
const RouteLine = styled.View`
border-left-width: 3px;
border-left-color: green;
flex-grow: 1;
`
const RouteItemData = styled.View`
flex-grow: 2;
justify-content: center;
background-color: #fff;
margin: 5px;
border-radius: 12px;
padding: 5px;
`

const BusStopContainer = styled.View`
flex-direction: row;
align-items: center;
justify-content: space-between;

`

const BusStopText = styled.Text`
    font-size: 16px;
    color: #000;
    font-weight: 700;
`



export default Route