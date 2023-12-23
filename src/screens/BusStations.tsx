import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, Text, TextInput, View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import {  useGetStationsQuery } from '../store/slices/stationsAPI'
import styled from 'styled-components/native'
import { IBusStations } from '../store/types'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Search from '../components/Search'

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

type Props = {}

const BusStations: React.FC<Props> = (props: Props) => {
  const {data: stations, isLoading: stationsLoading, error} = useGetStationsQuery()
  const transformDate = (date: number): string => {
    if(date < 10){
      return '0' + String(date)
    }
    return String(date)
  } 

  const busStation = (station: IBusStations) => {
    const lastUpdateDate = new Date(station.last_updated_at)
    const lastUpdate = lastUpdateDate.getDate() + " " + month[lastUpdateDate.getMonth()] + " " + transformDate(lastUpdateDate.getHours()) + ":" + transformDate(lastUpdateDate.getMinutes())
    return (
      <BusStationButton>
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
      <Search/>
      <View style={{borderBottomColor: '#eaeaea', borderBottomWidth: 1, width: '100%', marginBottom: 5, marginTop: 5}}/>
      {
        stations?.length 
        ? <FlatList  renderItem={({item}) => busStation(item)} data={stations}/>
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