import React, { useEffect, useState } from 'react'
import { IBusStations, ISheduleItem } from '../store/types'
import styled from 'styled-components/native'
import { useLazyGetAttachedStationsQuery, useLazyGetRouteByPointsQuery } from '../store/slices/stationsAPI'
import SearchFieldWithDropdown from './SearchFieldWithDropdown'
import Loading from './Loading'
import SelectedStation from './SelectedStation'

type Props = {
    setResultsData: (data: {sheduleItem: ISheduleItem, station: IBusStations}[]) => void
    allStations: IBusStations[];
}
const SearchByStation = ({allStations, setResultsData}: Props) => {
    const [getAttachedStations, {
        data: attachedStations, 
        isLoading: attachedStationsIsLoading, 
        error: attachedStationsError
    }] = useLazyGetAttachedStationsQuery()
    const [getRoutes, {
        data: routesResult, 
        error: routesError, 
        isLoading: routesIsLoading
    }] = useLazyGetRouteByPointsQuery()
    const [selectedFromStation, setSelectedFromStation] = useState<IBusStations | null>(null)
    const [selectedToStation, setSelectedToStation] = useState<IBusStations | null>(null)

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
    
    const updateSelectedFromStation = (value: string) => {
        const findedStation = allStations.find(station => station.stationName === value)
        if(findedStation){
            setSelectedFromStation(findedStation)
        }
    }
    const updateSelectedToStation = (value: string) => {
        if(attachedStations){
            const findedStation = attachedStations.find(station => station.stationName === value)
            if(findedStation){
                setSelectedToStation(findedStation)
            }
        }
    }

    if(attachedStationsIsLoading || routesIsLoading){
        return <Loading/>
    }

    return (
    <Container>
        <SelectorHeader>Звідки</SelectorHeader>
        <SearchFieldContainer>
        {selectedFromStation
            ? <SelectedStation cancel={() => {
                setSelectedToStation(null)
                setSelectedFromStation(null)
                }} 
                name={selectedFromStation.stationName} />
            : <SearchFieldWithDropdown title='Звідки'
                itemsForSearch={allStations.map(station => (station.stationName))}
                setSearchedVale={updateSelectedFromStation}
            />
        }
        </SearchFieldContainer>
            {(attachedStations && selectedFromStation) &&
            <>
                <SelectorHeader>Куди</SelectorHeader>
                <SearchFieldContainer>
                    {selectedToStation
                        ? <SelectedStation cancel={() => setSelectedToStation(null)} 
                            name={selectedToStation.stationName} />
                        : <SearchFieldWithDropdown title='Куди'
                            itemsForSearch={attachedStations.map(station => (station.stationName))} 
                            setSearchedVale={updateSelectedToStation} 
                        />
                    }
                </SearchFieldContainer>
            </>
            }
    </Container>
  )
}

const Container = styled.View`
flex-grow: 1;
`
const SearchFieldContainer = styled.View`
padding: 5px;
`
const SelectorHeader = styled.Text`
font-size: 16px;
font-weight: 700;
color: #000;
text-align: center;
margin: 5px 0;
`

export default SearchByStation