import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useLayoutEffect } from 'react'
import { ActivityIndicator, Button, Text, Vibration, View, ScrollView, StyleSheet } from 'react-native'
import { BusStackParamList } from '../navigation/Navigation'
import { useGetRouteQuery } from '../store/slices/stationsAPI'
import styled from 'styled-components/native'
import { month } from './BusStations'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

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
    console.log(JSON.stringify(data))
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
                                    const day = splitted[0] + " " + month[(Number(splitted[1]) - 1)].substring(0, 3)
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