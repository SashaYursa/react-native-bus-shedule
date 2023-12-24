import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, Text, TextInput, View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import {  useGetStationsQuery } from '../store/slices/stationsAPI'
import styled from 'styled-components/native'
import { IBusStations } from '../store/types'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Search from '../components/Search'
import { } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BusStackParamList } from '../navigation/Navigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useNetInfo } from '@react-native-community/netinfo'

const month = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
]

const BusStations = ({navigation, route}: NativeStackScreenProps<BusStackParamList, 'BusStations'>) => {
  const netInfo = useNetInfo()
  const {data: stations, isLoading: stationsLoading, error} = useGetStationsQuery()
  const transformDate = (date: number): string => {
    if(date < 10){
      return '0' + String(date)
    }
    return String(date)
  } 
  const [filteredStations, setFilteredStations] = useState(stations) 

  const updateFilter = (value: string) => {
    setFilteredStations(stations?.filter(station => station.stationName.includes(value)))
  }


  const busStation = (station: IBusStations) => {
    const lastUpdateDate = new Date(station.last_updated_at)
    const lastUpdate = lastUpdateDate.getDate() + " " + month[lastUpdateDate.getMonth()] + " " + transformDate(lastUpdateDate.getHours()) + ":" + transformDate(lastUpdateDate.getMinutes())
    return (
      <BusStationButton onPress={() => {navigation.navigate("StationShedule", {station: station})}}>
        <BusStationIcon>
          <Icon name='bus-multiple' size={50}/>
        </BusStationIcon>
        <BusStationInfo>
          <BusStationTitle>{station.stationName}</BusStationTitle>
          <BusStationInfoContainer>
            <Icon name='map-marker' size={18}/>
            <BusStationStreet numberOfLines={1}>{station.stationAddress}</BusStationStreet>
          </BusStationInfoContainer>
          <BusStationInfoContainer>
            <Icon name='update' size={18}/>
            <LastUpdateStationText>Оновлено: {lastUpdate}</LastUpdateStationText>
          </BusStationInfoContainer>
        </BusStationInfo>
      </BusStationButton>
    )
  }

  if(stationsLoading){
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator/>
      </View>
    )
  }
  return (
    <Container>
      <Search updateFilter={updateFilter}/>
      {!netInfo.isConnected &&
        <LostInternetConnectionContainer>
          <Icon name='alert-circle' size={25} color='#FFB534'/>
          <Text style={{marginLeft: 5}}>
            No internet connection
          </Text>
        </LostInternetConnectionContainer>
      }
      <View style={{borderBottomColor: '#eaeaea', borderBottomWidth: 1, width: '100%', marginBottom: 5, marginTop: 5}}/>
      {
        stations?.length 
        ? <FlatList  renderItem={({item}) => busStation(item)} data={filteredStations}/>
        : <Text>No data</Text>
      }
    </Container>
  )
}

const Container = styled.View`
gap: 40px;
flex-grow: 1;
flex-shrink: 1;
background-color: #fff;
`

const LostInternetConnectionContainer = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;

`

const BusStationButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  margin: 5px;
  background-color: #eaeaea; 
  border-radius: 12px;
  padding: 5px;
  gap: 20px;
  overflow: hidden;
`
const BusStationIcon = styled.View`
  overflow: hidden;
  border-radius: 12px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  margin-bottom: auto;
  padding: 10px;
`
const BusStationInfo = styled.View`
  flex-grow: 1;
`
const BusStationTitle = styled.Text`
color: #000;
font-size: 16px;
font-weight: 700;
justify-content: center;
align-items: center;
flex-direction: row;
text-align: center;
`

const BusStationStreet = styled.Text`
font-size: 16px;
font-weight: 700;
color: #000;
overflow: hidden;
flex-shrink: 1;
flex-grow: 1;
flex-basis: 0;
`
const BusStationInfoContainer = styled.View`
  flex-direction: row;
  margin: 0 5px;
  align-items: center;
`
const LastUpdateStationText = styled.Text`
font-size: 14px;
font-weight: 400;
`

export default BusStations