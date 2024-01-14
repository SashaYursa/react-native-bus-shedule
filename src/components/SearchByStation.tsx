import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native'
import { IBusStations, ISheduleItem } from '../store/types'
import Search from './Search'
import SearchField from './SearchField'
import styled from 'styled-components/native'
import { useLazyGetAttachedStationsQuery, useLazyGetRouteByPointsQuery } from '../store/slices/stationsAPI'
import SearchFieldWithDropdown from './SearchFieldWithDropdown'
import { FlashList } from '@shopify/flash-list'
import BusRouteCard from './BusRouteCard'
import Loading from './Loading'

type Props = {
    setResultsData: (data: {sheduleItem: ISheduleItem, station: IBusStations}[]) => void
    allStations: IBusStations[];
}

const SearchByStation = ({setResultsData, allStations}: Props) => {
    const [getAttachedStations, {data: attachedStations, isLoading: attachedStationsIsLoading, error: attachedStationsError}] = useLazyGetAttachedStationsQuery()
    const [selectedFromStation, setSelectedFromStation] = useState<IBusStations>()
    const [selectedToStation, setSelectedToStation] = useState<IBusStations>()
    const [getRoutes, {data: routesResult, error: routesError, isLoading: routesIsLoading}] = useLazyGetRouteByPointsQuery()

    useEffect(() => {
        if(selectedFromStation){
            getAttachedStations(selectedFromStation.id)
        }
    }, [selectedFromStation])

    useEffect(() => {
        if(selectedFromStation?.id && selectedToStation?.id){
            const requestObj = {fromPoint: selectedFromStation?.id, toPoint: selectedToStation?.id}
            getRoutes(requestObj)
        }
    }, [selectedToStation])

    useEffect(() => {
        if(routesResult && selectedFromStation){
            setResultsData(routesResult.map(item => ({sheduleItem: item, station: selectedFromStation})))
        }
    }, [routesResult])
    
    if(attachedStationsIsLoading || routesIsLoading){
        return <Loading/>
    }

    return (
    <Container>
        <SearchFieldContainer>
        {!selectedFromStation
        ? <SearchFieldWithDropdown title='Звідки'
            setSearchedVale={(value) => setSelectedFromStation(allStations.find(station => station.stationName === value))}
            itemsForSearch={allStations.map(station => (station.stationName))}
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