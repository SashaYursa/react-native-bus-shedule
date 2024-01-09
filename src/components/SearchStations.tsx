import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Selector from './Selector'
import { useLazyGetStationRoutesQuery, useLazyGetStationsQuery } from '../store/slices/stationsAPI'
import styled from 'styled-components/native'

type Props = {}

const SearchStations = (props: Props) => {
  const [selectedStation, setSelectedStation] = useState<number>() 
  const [selectedRoute, setSelectedRoute] = useState<number>() 
  const [getStation, {data: stations, isError: stationsHasError, isLoading: stationsIsLoading}] = useLazyGetStationsQuery()
  const [getRoutes, {data: routes, isError: routesHasError, isLoading: routesIsLoading}] = useLazyGetStationRoutesQuery()
  const [stationsForSelect, setStationsForSelect] = useState<{title: string, value: string}[]>([])
  const [routesForSelect, setRoutesForSelect] = useState<{title: string, value: string}[]>([])
  useEffect(() => {
    if(!stations){
      getStation()
    }
  }, [])

  useEffect(() => {
    if(stations){
      setStationsForSelect(stations?.map(station => ({title: station.stationName, value: String(station.id)})))
    }
  }, [stations])

  useEffect(() => {
    if(routes){
      setRoutesForSelect(routes?.map(route => ({title: route.busRoute, value: String(route.id)})))
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

  return (
	<>
	<SelectorContainer>
		<Selector enabled={true} 
		selectedValue={selectedStation ? String(selectedStation) : undefined} 
		setSelectedValue={(id) => setSelectedStation(Number(id))} 
		items={stationsForSelect} 
		title='Станція'/>
	</SelectorContainer>
	<SelectorContainer>
		<Selector enabled={!!selectedStation} 
		selectedValue={selectedRoute ? String(selectedRoute) : undefined} 
		setSelectedValue={(id) => setSelectedRoute(Number(id))} 
		items={routesForSelect} 
		title='Маршрут'/>
	</SelectorContainer>
	
	</>
  )
}

const SelectorContainer = styled.View`
	margin: 5px 0;
`

export default SearchStations