import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Selector from './Selector'
import { useLazyGetStationRoutesQuery, useLazyGetStationsQuery } from '../store/slices/stationsAPI'
import styled from 'styled-components/native'
import { IBusStations, ISheduleItem } from '../store/types'
import BusRouteCard from './BusRouteCard'
import SearchField from './SearchField'
import Loading from './Loading'
import ErrorLoad from './ErrorLoad'
type Props = {
  setResultsData: (data: {sheduleItem: ISheduleItem, station: IBusStations}[]) => void
  allStations: IBusStations[]
  navigateToMain: () => void
}

const SearchByRoute = ({setResultsData, allStations, navigateToMain}: Props) => {
  const [selectedStation, setSelectedStation] = useState<IBusStations>() 
  const [selectedRoute, setSelectedRoute] = useState<string>() 
  const [getRoutes, {data: routes, isError: routesHasError, error: routeError, isLoading: routesIsLoading}] = useLazyGetStationRoutesQuery()
  const [stationsForSelect, setStationsForSelect] = useState<{title: string, value: string}[]>([])
  const [routesForSelect, setRoutesForSelect] = useState<{title: string, value: string}[]>([])
  const [selectedRoutes, setSelectedRoutes] = useState<null | ISheduleItem[]>(null)
  useEffect(() => {
    if(selectedRoute){
      const filteredRoutes = routes?.filter(route => route.busRoute.toUpperCase().includes(selectedRoute))
      if(filteredRoutes && selectedStation){
        setResultsData(filteredRoutes.map(route => ({sheduleItem: route, station: selectedStation})))
      }
    }
  }, [selectedRoute])

  useEffect(() => {
    if(allStations){
      setStationsForSelect(allStations?.map(station => ({title: station.stationName, value: String(station.id)})))
    }
  }, [allStations])

  useEffect(() => {
    if(routes){
      const values = routes?.map(route => ({title: route.busRoute, value: route.busRoute}))
      const filteredValues = values.filter((val, index) => values.findIndex(searchVal => searchVal.title === val.title) === index)
      setRoutesForSelect(filteredValues)
    }
  }, [routes])

  useEffect(() => {
    if(selectedStation){
      console.log('getRoutes----' )
      getRoutes(selectedStation?.id)
    }
  }, [selectedStation])
  
  if(!stationsForSelect || routesHasError){
    return (
    <ErrorLoad errorText='Помилка при отриманні странцій' 
    actionHandler={() => navigateToMain()}
    actionText='На головну'/>
    )
  }
  if(routesIsLoading){
    return <Loading/>
  }

  return (
	<Container>
    <SelectorHeader>Станція</SelectorHeader>
    <SelectorContainer>
      <Selector
        selectedValue={selectedStation ? String(selectedStation.id) : undefined} 
        setSelectedValue={(id) => setSelectedStation(allStations.find(station => station.id === Number(id)))} 
        items={stationsForSelect}
        title='Станція'/>
    </SelectorContainer>
    <SelectorHeader>Маршрут</SelectorHeader>
    <SelectorContainer>
      <SearchField
      title="Маршрут"
      itemsForSearch={routesForSelect} 
      selectedValue={selectedRoute ? selectedRoute : undefined} 
      setSelectedValue={(value) => {
        setSelectedRoute(value)
      }}/>
    </SelectorContainer>
	</Container>
  )
}

const Container = styled.View`
flex-grow: 1;
`

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


export default SearchByRoute