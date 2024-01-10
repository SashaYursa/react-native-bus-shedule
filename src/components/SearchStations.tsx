import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Selector from './Selector'
import { useLazyGetStationRoutesQuery, useLazyGetStationsQuery } from '../store/slices/stationsAPI'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { ISheduleItem } from '../store/types'
import { WEEK_DAYS } from '../screens/Route'

type Props = {}

const SearchStations = (props: Props) => {
  const [selectedStation, setSelectedStation] = useState<number>() 
  const [selectedRoute, setSelectedRoute] = useState<ISheduleItem>() 
  const [getStation, {data: stations, isError: stationsHasError, isLoading: stationsIsLoading}] = useLazyGetStationsQuery()
  const [getRoutes, {data: routes, isError: routesHasError, isLoading: routesIsLoading}] = useLazyGetStationRoutesQuery()
  const [stationsForSelect, setStationsForSelect] = useState<{title: string, value: string}[]>([])
  const [routesForSelect, setRoutesForSelect] = useState<{title: string, value: string}[]>([])
  const [searchType, setSearchType] =  useState<'list' | 'input'>('list')
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
      const values = routes?.map(route => ({title: route.busRoute, value: String(route.id)}))
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

  return (
	<>
  <SelectorHeader>Станція</SelectorHeader>
	<SelectorContainer>
		<Selector enabled={true} 
		selectedValue={selectedStation ? String(selectedStation) : undefined} 
		setSelectedValue={(id) => setSelectedStation(Number(id))} 
		items={stationsForSelect} 
		title='Станція'/>
	</SelectorContainer>
  <SelectorHeader>Маршрут</SelectorHeader>
  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingLeft: 5, paddingRight: 5}}>
    { searchType === 'list' 
    ? <SelectorContainer style={{flex: 1, paddingLeft: 0}}>
        <Selector enabled={!!selectedStation} 
        selectedValue={selectedRoute ? String(selectedRoute.id) : undefined} 
        setSelectedValue={(id) => {
          setSelectedRoute(routes?.find(route => route.id == Number(id)))
        }} 
        items={routesForSelect} 
        title='Маршрут'/>
      </SelectorContainer>
    : <SearchInputContainer style={{flex: 1, backgroundColor: "#fff", marginRight: 5, flexDirection: 'row', alignItems: 'center', overflow: 'hidden'}}>
        <TextInput  style={{fontSize: 16, flex: 1}} value='132123'/>
        <TouchableOpacity style={{borderLeftWidth: 1, borderLeftColor: '#000', justifyContent: 'center', backgroundColor: "#eaeaea", alignItems: 'center', flexDirection: 'column'}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: 5, paddingRight: 5}}>
          <Icon color='#000' name='magnify' size={25}/>
        </View>
        </TouchableOpacity>
      </SearchInputContainer>
    }
  <View>
      <ChangeSearchModeButton onPress={() => setSearchType(type => type === 'input' ? 'list' : 'input')}>
        <Icon name={searchType === 'list' ? 'magnify' : 'form-dropdown'} color='#000' size={25}/>
      </ChangeSearchModeButton>
    </View>
  </View>
  <ContentContainer>
    { selectedRoute &&
      routes?.map(route => {
        if(route.busRoute === selectedRoute.busRoute){
          return (
          <View style={{flexDirection: 'row'}}>
            <Text>
              {route.busRoute}
            </Text>
            <Text>
              {`${new Date(Number(route.departure)).getHours()}:${new Date(Number(route.departure)).getMinutes()}`}
            </Text>
            <Text>
              {route.id}
            </Text>
          </View>
        )
      }
      })
    }
  </ContentContainer>
	</>
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

const ChangeSearchModeButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: 13px 10px;
  flex-grow: 1;
  background-color: #fff;
  border-radius: 12px;
  border-width: 1px;
  border-color: #000;
`

const SearchInputContainer = styled.View`
border-color: #000;
border-radius: 12px;
border-width: 1px;
flex-grow: 1;
background-color: #fff;
`

const ContentContainer = styled.ScrollView`
  flex-grow: 1; 
  margin-top: 10px;
`

export default SearchStations