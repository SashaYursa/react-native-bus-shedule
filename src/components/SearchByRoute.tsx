import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Selector from './Selector'
import { useLazyGetStationRoutesQuery, useLazyGetStationsQuery } from '../store/slices/stationsAPI'
import styled from 'styled-components/native'
import { ISheduleItem } from '../store/types'
import BusRouteCard from './BusRouteCard'
import SearchField from './SearchField'
type Props = {
  moveToRouteScreen: (route: ISheduleItem) => void
}

const SearchByRoute = ({moveToRouteScreen}: Props) => {
  const [selectedStation, setSelectedStation] = useState<number>() 
  const [selectedRoute, setSelectedRoute] = useState<string>() 
  const [getStations, {data: stations, isError: stationsHasError, isLoading: stationsIsLoading}] = useLazyGetStationsQuery()
  const [getRoutes, {data: routes, isError: routesHasError, isLoading: routesIsLoading}] = useLazyGetStationRoutesQuery()
  const [stationsForSelect, setStationsForSelect] = useState<{title: string, value: string}[]>([])
  const [routesForSelect, setRoutesForSelect] = useState<{title: string, value: string}[]>([])
  const [selectedRoutes, setSelectedRoutes] = useState<null | ISheduleItem[]>(null)
  useEffect(() => {
    if(!stations){
      getStations()
    }
  }, [])

  useEffect(() => {
    if(selectedRoute){
      const filteredRoutes = routes?.filter(route => route.busRoute.toUpperCase().includes(selectedRoute))
      if(filteredRoutes){
        setSelectedRoutes(filteredRoutes)
      }
    }
  }, [selectedRoute])

  useEffect(() => {
    if(stations){
      setStationsForSelect(stations?.map(station => ({title: station.stationName, value: String(station.id)})))
    }
  }, [stations])

  useEffect(() => {
    if(routes){
      const values = routes?.map(route => ({title: route.busRoute, value: route.busRoute}))
      const filteredValues = values.filter((val, index) => values.findIndex(searchVal => searchVal.title === val.title) === index)
      setRoutesForSelect(filteredValues)
    }
  }, [routes])

  useEffect(() => {
    getRoutes(Number(selectedStation))
  }, [selectedStation])
  
  if(!stationsForSelect){
    return (
      <View>
        <Text>
          Помилка при отриманні станцій
        </Text>
      </View>
    )
  }
  const _renderItem = (item: ISheduleItem) => {
    const findStation = stations?.find(s => s.id === selectedStation)
    if(findStation){
      return (
        <RouteButton onPress={() => moveToRouteScreen(item)}>
          <BusRouteCard station={findStation} sheduleItem={item}/>
        </RouteButton>
      )
    }
    return <>
      <Text>
        Error
      </Text>
    </>
  }
  if(routesIsLoading || stationsIsLoading){
    return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size='large'/>
      </View>
  }

  return (
	<View style={{flex: 1}}>
    <SelectorHeader>Станція</SelectorHeader>
    <SelectorContainer>
      <Selector enabled={true} 
        selectedValue={selectedStation ? String(selectedStation) : undefined} 
        setSelectedValue={(id) => setSelectedStation(Number(id))} 
        items={stationsForSelect}
        title='Станція'/>
    </SelectorContainer>
    <SelectorHeader>Маршрут</SelectorHeader>
    <SelectorContainer>
      <SearchField enabled={!!selectedStation} 
      title="Маршрут"
      itemsForSearch={routesForSelect} 
      selectedValue={selectedRoute ? selectedRoute : undefined} 
      setSelectedValue={(value) => {
        setSelectedRoute(value)
      }}/>
    </SelectorContainer>
    <FlatList contentContainerStyle={{
        padding: 5,
      }} 
      style={{marginTop: 5}}
      data={selectedRoutes}
      renderItem={({item}) => _renderItem(item)}
      />
	</View>
  )
}

const SelectorContainer = styled.View`
padding: 0 5px;
`
const SelectorHeader = styled.Text`
font-size: 16px;
font-weight: 700;
color: #000;
text-align: center;
margin: 5px 0;
`
const RouteButton = styled.TouchableOpacity`
padding: 10px;
border-radius: 12px;
background-color: rgba(127, 17, 224, .2);
overflow: hidden;
margin-bottom: 5px;
`


export default SearchByRoute