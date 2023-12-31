import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useLayoutEffect } from 'react'
import { ActivityIndicator, Button, Text, Vibration, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { BusStackParamList } from '../navigation/Navigation'
import { useGetRouteQuery } from '../store/slices/stationsAPI'
import styled from 'styled-components/native'
import { month } from './BusStations'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MapView, { LatLng, Marker } from 'react-native-maps'
import MapViewDirections, { MapViewDirectionsOrigin } from 'react-native-maps-directions'
import RouteMap from '../components/RouteMap'
import ErrorLoad from '../components/ErrorLoad'
type Props = {}

export type waypoint = {id: number, name: string, position: LatLng, type: postionType } 
export type waypoints = {
    first: waypoint,
    middle: waypoint[] | null,
    last: waypoint
} | null
type postionType = "station_position" | "current_point_position"
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
    const {id} = route.params
    const {isLoading, error, isError, data} = useGetRouteQuery(Number(id));

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

    let waypoints: waypoints = null

    // data?.route?.points.forEach(point => {
    //     console.log(point.id, '+', point.station.stationName)
    // })
    const updateMapPoint = (pointLatLng: {latitude: number, longitude: number}, pointId: number) => {
        console.log(pointLatLng, pointId, 'data')
    }
    useEffect(() => {
        console.log('error', isError)
    }, [error])

    if(data?.route?.points){
        let res: waypoint[] = (data.route.points.filter(i => i.fullAddress !== null).map((point) => {
            if(point.latitude && point.longitude){
                return {
                    id: point.id,
                    name: point.station.stationName,
                    type:"current_point_position", 
                    position: {
                        latitude: point.latitude ? Number(point.latitude) : 0,
                        longitude: point.longitude ? Number(point.longitude): 0
                    } 
                }
            }
            return {
                id: point.id,
                name: point.station.stationName,
                type: "station_position",
                position: {
                latitude: point?.station?.latitude ? Number(point?.station.latitude) : 0, 
                longitude: point?.station?.longitude ? Number(point?.station?.longitude): 0
                }
            }
        }))
        res = res.filter(wp => wp.position.latitude !== 0 && wp.position.longitude !== 0)
        const first = res.shift()
        const last = res.pop()
        if(first && last){
            waypoints = {first, middle: res, last}
        }
    }
    if(isError){
        if('status' in error){
            return(
                <ErrorLoad actionHandler={() => navigation.goBack()} 
                actionText='Назад' 
                errorText='Помилка при отриманні даних' />
            )
        }else{
            return(
                <ErrorLoad actionHandler={() => navigation.goBack()} 
                actionText='Назад' 
                errorText='Невідома помилка' />
            )
        }
    }
    if(isLoading){
        return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large'/>
                </View>
    }
    let firstDay = null;
    let lastDay = null;
    if(data?.route?.dates.dates?.length){
        const dates = data.route.dates.dates;
        let i = 0
        while(!firstDay){
            if(i > dates.length){
                firstDay = '-'
            }
            const findDay = dates[i].find(j => !!j)
            if(findDay){
                firstDay = findDay
            }else{
                i++;
            }
        }
        i = dates.length - 1
        while(!lastDay){
            if(i === 0){
                lastDay = '-'
            }
            const findDay = dates[i].findLast(j => !!j)
            if(findDay){
                lastDay = findDay
            }else{
                i--;
            }
        }
    }

    return (
    <Container>
        {data?.route?.dates.dates.length ?
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
                    data?.route?.dates?.dates.map((week, index) => {
                        return (
                            <WeekContainer key={index}>
                            {week.map((dayItem, index) => {
                                if(dayItem){
                                    const splitted = dayItem.split('-');
                                    const day = splitted[0] + " " + month[(Number(splitted[1]) - 1)]?.substring(0, 3)
                                    return <WeekDay key={index} style={{backgroundColor: 'rgba(19, 191, 0, 0.7)'}}><DayText>{day}</DayText></WeekDay>
                                }
                                return <WeekDay key={index} style={{backgroundColor: 'rgba(134, 134, 134, 0.6)'}}><DayText>-</DayText></WeekDay>
                            })}
                        </WeekContainer>
                    )
                })
                }
        </DatesContainer>
        : <View style={{padding: 5, alignItems: 'center'}}><Text style={{fontSize: 16, fontWeight: '700', color: '#000'}}>Наразі відсутня інформація про дати курсування</Text></View>
        }
        <RouteContainer>
                {data?.route?.points.map((point, index) => {
                    return (
                        <RouteItem key={point.station.stationName}>
                            <RouteLineContainer>
                                <RouteLine style={{borderLeftWidth: index === 0 ? 0 : 2}}/>
                                <Icon style={style.routePointIcon} name="record-circle-outline" color="green" size={26}/>
                                <RouteLine style={{borderLeftWidth: index === Number(data.route?.points.length) - 1 ? 0 : 2}}/>
                            </RouteLineContainer>
                            <RouteItemData>
                                <BusStopContainer>
                                    <BusStopText style={{...style.busStopTitle, color: point.station.linkToSheduleBoard ? 'green' : '#000'}}>{String(point.station.stationName).trim()}</BusStopText>
                                </BusStopContainer>
                                <BusStopContainer>
                                    <BusStopContainer style={{alignSelf: 'flex-start'}}>
                                        {point.departureTime &&
                                        <>
                                            <Icon name='arrow-up-thin' size={25} color='green'/>
                                            <BusStopText>{String(point.departureTime).trim()} прибуття</BusStopText>
                                        </>
                                        }
                                    </BusStopContainer>
                                    <BusStopContainer style={{alignSelf: 'flex-end'}}>
                                        { point.kilometresFromStation !== null &&
                                        <>
                                            <BusStopText>{point.kilometresFromStation}км.</BusStopText>
                                            <Icon name="map-marker-distance" size={25} color='green'/>
                                        </>
                                        }
                                    </BusStopContainer>
                                </BusStopContainer>
                                <BusStopContainer>
                                    <BusStopContainer style={{alignSelf: 'flex-start'}}>
                                        { point.arrivalTime &&
                                        <>
                                            <Icon name='arrow-down-thin' size={25} color='red'/>
                                            <BusStopText>{String(point.arrivalTime).trim()} відправлення</BusStopText>
                                        </>
                                        }
                                    </BusStopContainer>
                                    <BusStopContainer style={{alignSelf: 'flex-end'}}>
                                        { point.cost !== null &&
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
        {
            (waypoints && data) &&
            <RouteMap  
            waypoints={waypoints} 
            updateMapPoint={updateMapPoint} 
            navigateToMapScreen={() => navigation.navigate('Map', {waypoints, busId: data.bus.id})}
            />
        }
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