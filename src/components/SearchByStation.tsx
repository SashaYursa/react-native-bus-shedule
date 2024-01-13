import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { IBusStations, ISheduleItem } from '../store/types'
import Search from './Search'
import SearchField from './SearchField'
import styled from 'styled-components/native'
import { useLazyGetAllStationsQuery, useLazyGetAttachedStationsQuery } from '../store/slices/stationsAPI'
import SearchFieldWithDropdown from './SearchFieldWithDropdown'

type Props = {
    moveToRouteScreen: (route: ISheduleItem) => void
}

const SearchByStation = ({moveToRouteScreen}: Props) => {
    const [getAllStations, {data: stations, isLoading: stationsIsLoading, error: stationsError}] = useLazyGetAllStationsQuery()
    const [getAttachedStations, {data: attachedStations, isLoading: attachedStationsIsLoading, error: attachedStationsError}] = useLazyGetAttachedStationsQuery()
    const [allStationsForSearch, setAllStationsForSearch] = useState<{title: string, value: string}[]>([])
    const [searchedValue, setSearchedValue] = useState<{title: string}[]>([])
    const [selectedFromStation, setSelectedFromStation] = useState<IBusStations>()
    const [selectedToStation, setSelectedToStation] = useState<IBusStations>()
    useEffect(() => {
        getAllStations()
    }, [])

    useEffect(() => {
        if(selectedFromStation){
            getAttachedStations(selectedFromStation.id)
        }
    }, [selectedFromStation])

    useEffect(() => {
        console.log(selectedFromStation)
        console.log(selectedToStation)
    }, [selectedToStation])
    if(stationsIsLoading || attachedStationsIsLoading){
        return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size='large'/>
        </View>
    }
    if(stationsError || !stations){
        return <View>
            <Text>
                Error load stations
            </Text>
        </View>
    }

    return (
    <Container>
        <SearchFieldContainer>
        {!selectedFromStation
        ? <SearchFieldWithDropdown title='Звідки'
            setSearchedVale={(value) => setSelectedFromStation(stations.find(station => station.stationName === value))}
            itemsForSearch={stations.map(station => (station.stationName))}
        />
        : <SearchField enabled={false} itemsForSearch={[]} setSelectedValue={(value) => {
            setSelectedFromStation(undefined)
            setSelectedToStation(undefined)
        }} title={selectedFromStation.stationName} selectedValue={selectedFromStation.stationName}/>
        }
        </SearchFieldContainer>
        <SearchFieldContainer>
        {(attachedStations && selectedFromStation) &&
        (!selectedToStation
            ?
                <SearchFieldWithDropdown itemsForSearch={attachedStations.map(station => (station.stationName))} setSearchedVale={(value) => {
                    setSelectedToStation(attachedStations.find(station => station.stationName === value))
                }} title='Куди'/>
            :   <SearchField enabled={false} itemsForSearch={[]} setSelectedValue={(value) => {
                setSelectedToStation(undefined)
            }} title={selectedToStation.stationName} selectedValue={selectedToStation.stationName}/>
        )
        }
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