import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { IBusStations, ISheduleItem } from '../store/types'
import Search from './Search'
import SearchField from './SearchField'
import styled from 'styled-components/native'
import { useLazyGetAllStationsQuery } from '../store/slices/stationsAPI'
import SearchFieldWithDropdown from './SearchFieldWithDropdown'

type Props = {
    moveToRouteScreen: (route: ISheduleItem) => void
}

const SearchByStation = ({moveToRouteScreen}: Props) => {
    const [getAllStations, {data: stations, isLoading: stationsIsLoading, error: stationsError}] = useLazyGetAllStationsQuery()
    const [allStationsForSearch, setAllStationsForSearch] = useState<{title: string, value: string}[]>([])
    const [searchedValue, setSearchedValue] = useState<{title: string}[]>([])
    const [selectedFromStation, setSelectedFromStation] = useState<IBusStations>()
    useEffect(() => {
        getAllStations()
    }, [])

    useEffect(() => {
        console.log(selectedFromStation)
    }, [selectedFromStation])

    // useEffect(() => {
    //     if(stations){
    //         setAllStationsForSearch(stations.map(station => ({title: station.stationName, value: String(station.id)})))
    //     }
    // }, [stations])
    if(stationsError || !stations){
        return <View>
            <Text>
                Error load stations
            </Text>
        </View>
    }

    if(stationsIsLoading){
        return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size='large'/>
        </View>
    }

    return (
    <Container>
        <SearchFieldContainer>
            <SearchFieldWithDropdown title='Звідки'
            setSearchedVale={(value) => setSelectedFromStation(stations.find(station => station.stationName === value))}
            itemsForSearch={stations.map(station => (station.stationName))}/>
        </SearchFieldContainer>
        <SearchFieldContainer>
            <SearchFieldWithDropdown itemsForSearch={stations.map(station => (station.stationName))} setSearchedVale={() => {}} title='Куди'/>
        </SearchFieldContainer>
    </Container>
  )
}

const Container = styled.View`
flex-grow: 1;
`

const SearchFieldContainer = styled.View`
padding: 5px;
`

export default SearchByStation