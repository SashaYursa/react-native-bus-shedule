import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { IBusStations, ISheduleItem } from '../store/types'
import Search from './Search'
import SearchField from './SearchField'
import styled from 'styled-components/native'
import { useLazyGetAllStationsQuery } from '../store/slices/stationsAPI'

type Props = {
    moveToRouteScreen: (route: ISheduleItem) => void
}

const SearchByStation = ({moveToRouteScreen}: Props) => {
    const [searchStation, setSearchStation] = useState<{value: string | undefined, type: 'input' | undefined}>({value: undefined, type: undefined})
    const [getAllStations, {data: stations, isLoading, error}] = useLazyGetAllStationsQuery()
    const [allStationsForSearch, setAllStationsForSearch] = useState<{title: string, value: string}[]>([])
    const [searchedValue, setSearchedValue] = useState<{title: string}[]>([])
    useEffect(() => {
        getAllStations()
    }, [])

    useEffect(() => {
        if(searchStation.type === 'input' && typeof searchStation.value  === 'string'){
            const searchedValue = searchStation.value.toUpperCase()
            setSearchedValue(allStationsForSearch.filter(station => station.title.toUpperCase().includes(searchedValue)))
        }
    }, [searchStation])

    useEffect(() => {
        if(stations){
            setAllStationsForSearch(stations.map(station => ({title: station.stationName, value: String(station.id)})))
        }
    }, [stations])
    return (
    <Container>
        <SearchFieldContainer>
            <SearchField enabled={true} itemsForSearch={allStationsForSearch} selectedValue={searchStation.value} setSelectedValue={(value, type) => setSearchStation({value, type})} title='Звідки'/>
        </SearchFieldContainer>
        { (searchedValue.length > 0 && searchStation.type) && 
            <SearchedValuesContainer>
                    <ScrollView>
                        {
                            searchedValue.map(st => {
                                return <SearchedValue key={st.title}><SearchedValueText>{st.title}</SearchedValueText></SearchedValue>
                            })
                        }
                    </ScrollView>
            </SearchedValuesContainer>
        }
        <SearchFieldContainer>
            {/* <SearchField enabled={true} itemsForSearch={[]} selectedValue={searchStation.value} setSelectedValue={setSearchStation} title='Куди'/> */}
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

const SearchedValuesContainer = styled.View`
    height: 30%;
    padding: 5px;
    background-color: #fff;
    margin: 0 5px;
`
const SearchedValue = styled.TouchableOpacity`
    background-color: green;
    padding: 10px 5px;
    border-radius: 12px;
    margin-bottom: 5px;
`

const SearchedValueText = styled.Text`
    font-size: 14px;
    color: #fff
`




export default SearchByStation