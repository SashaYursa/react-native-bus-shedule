import React, { useEffect } from 'react'
import { ActivityIndicator, FlatList, Text, View, TouchableOpacity, Vibration } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BusStackParamList } from '../navigation/Navigation'
import { useGetSheduleQuery } from '../store/slices/stationsAPI'
import styled from 'styled-components/native'
import { IBusRoute, ISheduleItem } from '../store/types'
import RouteLine from '../components/RouteLine'
import { month } from './BusStations'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ErrorLoad from '../components/ErrorLoad'

const StationShedule = ({ navigation , route }: NativeStackScreenProps<BusStackParamList, 'StationShedule'>) => {

    const station = route.params.station;
    const {data: res, error: sheduleError, isLoading: sheduleIsLoading} = useGetSheduleQuery(station.id)
    const sheduleData = res?.buses

    useEffect(() => {
        console.log(sheduleError, 'error')
    }, [sheduleError])

    useEffect(() => {
        if(res){
            const lastUpdateDate = new Date(res.station.last_updated_at)
            const lastUpdate = lastUpdateDate.getDate() + " " + month[lastUpdateDate.getMonth()] + " " + transformDate(lastUpdateDate.getHours()) + ":" + transformDate(lastUpdateDate.getMinutes())
            navigation.setOptions({
                headerTitle: station.stationName,
                headerRight: () => <View><Text>{lastUpdate}</Text></View>
            })
        }
    }, [res])
    const transformDate = (date: number): string => {
        if(date < 10){
          return '0' + String(date)
        }
        return String(date)
    } 

    const moveToRoute = (bus: ISheduleItem) => {
        Vibration.vibrate(15)
        navigation.navigate('BusRoute', bus)
    } 

    const _renderItem = (item: ISheduleItem) => {
        const route = item.busRoute.split(' - ').map(str => str.trim().replace('#', '').replace('+', ''))
        const routeStartPoint = route[0]
        const routeEndPoint = route[1]
        const fromCurrentStation = routeStartPoint === station.stationName.toUpperCase()
        const departure = new Date(Number(item.departure))
        const arrival = new Date(Number(item.arrival))
        const arrivalTime = arrival.getDate() + " " + month[arrival.getMonth()] + " " + transformDate(arrival.getHours()) + ":" + transformDate(arrival.getMinutes())
        const departureTime = departure.getDate() + " " + month[departure.getMonth()] + " " + transformDate(departure.getHours()) + ":" + transformDate(departure.getMinutes())
        let different = (arrival.getTime() - departure.getTime());
        let hours = Math.floor((different % 86400000) / 3600000);
        let minutes = Math.round(((different % 86400000) % 3600000) / 60000);
        const hoursOnTheRoad = (hours ? hours + "год. ": '') + (minutes ? minutes + "хв." : '')
        let cardBackgroud = null;
        if(item.ticketsStatus.includes('продаж')) {
            item.ticketsStatus = 'У продажі'    
            cardBackgroud = 'rgba(109, 231, 95, 0.5)'
        }
        if(item.ticketsStatus.includes('платформ')) cardBackgroud = 'rgba(26, 255, 0, 0.5)'
        if(item.ticketsStatus.includes('Тимчасово не курсує')) cardBackgroud = 'rgba(134, 134, 134, 0.6)'
        if(item.ticketsStatus.includes('нено')) cardBackgroud = 'rgba(230, 13, 13, 0.4)'
        if(item.ticketsStatus.includes('продан')) cardBackgroud = 'rgba(230, 13, 13, 0.4)'
        if(item.ticketsStatus.includes('Затримка')) cardBackgroud = 'rgba(169, 169, 1, 0.4)'
        if(item.ticketsStatus.includes('По прибуттю')) cardBackgroud = 'rgba(108, 231, 95, 0.5)'
        return(
            <BusRouteButton onPress={() => moveToRoute(item)} style={{backgroundColor: cardBackgroud || 'rgba(134, 134, 134, 0.6)'}}>
                <BusRouteCard style={{alignItems: 'center'}}>
                    <RouteEndpointsContainer>
                        <RouteEndpoint>
                            <RouteEndpointText style={{color: fromCurrentStation ?'green': '#000'}}>
                            {routeStartPoint}
                            </RouteEndpointText>
                            {fromCurrentStation &&
                                <RouteTime>
                                    {departureTime}
                                </RouteTime>
                            }
                        </RouteEndpoint>
                        {!fromCurrentStation &&
                            <>
                                <RouteLine color='#000'>
                                    <View>
                                        <RouteTime style={{fontSize: 14}}>
                                            {hoursOnTheRoad}
                                        </RouteTime>
                                    </View>
                                </RouteLine>
                                <RouteEndpoint>
                                    <RouteEndpointText style={{color: 'green'}}>
                                        {station.stationName.toUpperCase()}
                                    </RouteEndpointText>
                                    <RouteTime>
                                        {departureTime}
                                    </RouteTime>
                                </RouteEndpoint>
                            </>
                        }
                        <RouteLine color='#000'>
                            <View>
                                {fromCurrentStation &&
                                <RouteTime style={{fontSize: 14}}>
                                    {hoursOnTheRoad}
                                </RouteTime>
                                } 
                            </View>
                        </RouteLine>
                        <RouteEndpoint>
                            <RouteEndpointText>
                                {routeEndPoint}
                            </RouteEndpointText>
                            <RouteTime>
                                {arrivalTime}
                            </RouteTime>
                        </RouteEndpoint>
                    </RouteEndpointsContainer>
                    <RouteInfoContainer>
                        <RouteInfoItem>
                            <RouteInfoText>
                                {item.emptyPlaces}
                            </RouteInfoText>
                            <Icon name='car-seat' size={20} color={item.emptyPlaces > 10 ? 'green' : item.emptyPlaces > 0 ? '#FFB534' : 'red'}/>
                        </RouteInfoItem>
                        <RouteInfoItem>
                            <RouteInfoTextContainer>
                                <RouteInfoText>
                                    {item.busOwner}
                                </RouteInfoText>
                                <RouteInfoText>
                                    {item.busInfo}
                                </RouteInfoText>
                            </RouteInfoTextContainer>
                            <Icon name='information' size={20} color='green'/>
                        </RouteInfoItem>
                        <RouteInfoItem>
                            <RouteInfoText>
                                {item.cost}
                            </RouteInfoText>
                            <Icon name='cash-multiple' size={20} color='green'/>
                        </RouteInfoItem>
                    </RouteInfoContainer>
                </BusRouteCard>
                <BusRouteStatus>
                    <BusRouteStatusText>
                        {item.ticketsStatus}
                    </BusRouteStatusText>
                </BusRouteStatus>
            </BusRouteButton>
        )
    }

    if(sheduleError){
        return (
            <ErrorLoad actionHandler={() => navigation.goBack()}
            actionText='На головну' 
            errorText='Помилка при завантаженні даних' /> 
        )
    }
    if(sheduleIsLoading){
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size='large'/>
            </View>
        )
    }

    return (
        <Container>
            <FlatList contentContainerStyle={{padding: 5}} renderItem={({item}) => _renderItem(item)} data={sheduleData}/>
        </Container>
    )
}
const Container = styled.View`
    flex-grow: 1;
    flex-shrink: 1;
    background-color: #fff;
`

const RouteInfoContainer = styled.View`
flex-grow: 1;
flex-shrink: 1;
align-items: flex-end;
text-overflow: clip;
`

const BusRouteCard = styled.View`
    flex-direction: row;
    flex-grow: 1;
    flex-shrink: 1;
`
const BusRouteButton = styled.TouchableOpacity`
    padding: 10px;
    border-radius: 12px;
    background-color: rgba(127, 17, 224, .2);
    overflow: hidden;
    margin-bottom: 5px;
`

const RouteEndpointsContainer = styled.View`
    padding: 5px;
    border-radius: 12px;
    flex-direction: column;
    align-items: flex-start;
`

const RouteEndpoint = styled.View`
    align-items: flex-start;
    justify-content: center;

`
const RouteEndpointText = styled.Text`
    font-size: 14px;
    font-weight: 700;
    color: #000;
`
const RouteTime = styled.Text`
    color: #171717;
    font-size: 12px;
`

const RouteInfoItem = styled.View`
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    padding: 2px;
    margin-top: 5px;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    text-overflow: clip;
`

const RouteInfoTextContainer = styled.View`
    align-items: flex-end;
    flex-grow: 1;
    flex-shrink: 1;
`

const RouteInfoText = styled.Text`
    color: #000;
    font-size: 14px;
    margin-right: 5px;
    text-align: right;
`

const BusRouteStatus = styled.View`
    flex-grow: 1;
    flex-direction: row;
` 

const BusRouteStatusText = styled.Text`
    font-size: 16px;
    color: #000;
    font-weight: 700;
`


export default StationShedule