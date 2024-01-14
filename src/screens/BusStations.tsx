import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, FlatList, View} from 'react-native'
import { useGetStationsQuery } from '../store/slices/stationsAPI'
import styled from 'styled-components/native'
import { IBusStations } from '../store/types'
import Search from '../components/Search'
import { BusStackParamList } from '../navigation/Navigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useNetInfo } from '@react-native-community/netinfo'
import BusStation from '../components/busStation'
import Loading from '../components/Loading'

const BusStations = ({navigation}: NativeStackScreenProps<BusStackParamList, 'BusStations'>) => {
  const netInfo = useNetInfo();
  const {data: stations, isLoading: stationsLoading, error, refetch} = useGetStationsQuery()
  const [filteredStations, setFilteredStations] = useState(stations)
  
  useEffect(() => {
    if(netInfo.isConnected){
      refetch()
    }
  }, [netInfo.isConnected])

  useEffect(() => {
    console.log('error', error)
  }, [error])

  useEffect(() => {
    console.log('true')
    if(stations){
      setFilteredStations(stations)
    }
  }, [stations])

  const updateFilter = (value: string) => {
    setFilteredStations(stations?.filter(station => station.stationName.includes(value)))
  }

  const moveToStationShedule = (station: IBusStations) => {
    navigation.navigate("StationShedule", {station})
  }

  const _renderItem = (item: IBusStations) => {
    return (
      <BusStation station={item}
      moveToStationShedule={moveToStationShedule} />
    )

  }

  if(stationsLoading){
    return (
      <Loading />
    )
  }

  return stations?.length
  ? (
    <Container>
      <FlatList  
      data={filteredStations}
      stickyHeaderHiddenOnScroll={true}
      ListHeaderComponent={<Search updateFilter={updateFilter}/>}
      stickyHeaderIndices={[0]}
      renderItem={({item}) => _renderItem(item)}/>
    </Container>
  )
  : (
    <View>
      <Text>No data</Text>
    </View>
  )
}

const Container = styled.View`
flex-grow: 1;
flex-shrink: 1;
background-color: #fff;
`

export default BusStations