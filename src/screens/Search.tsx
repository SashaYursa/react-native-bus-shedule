import React, { useState } from 'react'
import styled from 'styled-components/native'
import { Text } from 'react-native';
import SearchByRoute from '../components/SearchByRoute';
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BusFindStackParamList } from '../navigation/Navigation';
import { IBusStations, ISheduleItem } from '../store/types';
import SearchByStation from '../components/SearchByStation';
import { FlashList } from '@shopify/flash-list';
import { useGetAllStationsQuery } from '../store/slices/stationsAPI';
import Loading from '../components/Loading';
import ErrorLoad from '../components/ErrorLoad';
import BusRouteCard from '../components/BusRouteCard';
let i = 0;
const Search = ({navigation, route}: NativeStackScreenProps<BusFindStackParamList, 'SearchScreen'>) => {  
  console.log('rerender', i)
  const {data: allStations, isLoading: stationsIsLoading, error: stationsError} = useGetAllStationsQuery()
  
  const [selectedSearchType, setSelectedSearchType] = useState<'byStations' | 'byRoute'>('byRoute')  
  const [resultData, setResultData] = useState<{sheduleItem: ISheduleItem, station: IBusStations}[]>()

  const _renderItem = (item: {sheduleItem: ISheduleItem, station: IBusStations}) => {
    return (
      <RouteButton onPress={() => moveToRoute(item.sheduleItem)}>
        <BusRouteCard station={item.station} sheduleItem={item.sheduleItem}/>
      </RouteButton>
    )
  }
  
  const moveToRoute = (bus: ISheduleItem) => {
    navigation.navigate('Route', {screen: 'BusRoute', params: bus})
  } 
  
  if(stationsIsLoading){
    return <Loading/>
  }
  if(!allStations){
    return <ErrorLoad actionHandler={() => navigation.goBack()} 
    actionText='На головну' 
    errorText='Помилка при завантаженні станці'/>
  }


  return (
    <Container>
      <SearchTypes>
        <SearchType 
        onPress={() => selectedSearchType !== 'byRoute' ? setSelectedSearchType('byRoute'): {}} 
        style={selectedSearchType === 'byRoute' ? {backgroundColor: '#000'}: {}}>
          <SearchTypeText style={selectedSearchType === 'byRoute' ? {color: '#fff'}: {}}>
            По маршрутах
          </SearchTypeText>
        </SearchType>
        <SearchType 
        onPress={() => selectedSearchType !== 'byStations' ? setSelectedSearchType('byStations'): {}} 
        style={selectedSearchType === 'byStations' ? {backgroundColor: '#000'}: {}}>
          <SearchTypeText style={selectedSearchType === 'byStations' ? {color: '#fff'}: {}}>
            По станціях
          </SearchTypeText>
        </SearchType>
      </SearchTypes>
      <Main>
        {selectedSearchType === 'byRoute' 
        ? <SearchByRoute allStations={allStations.filter(station => !!station.linkToSheduleBoard)} 
          setResultsData={setResultData}/>
        : <SearchByStation allStations={allStations} 
          setResultsData={setResultData}/>
        }
      </Main>
      <ResultContainer>
      <FlashList contentContainerStyle={{
        padding: 5,
      }} 
      data={resultData}
      estimatedItemSize={160}
      renderItem={({item}) => _renderItem(item)}
      />
      </ResultContainer>
    </Container>
  )
}

const Container = styled.View`
  flex-grow: 1;
`
const SearchTypes = styled.View`
  flex-direction: row;
  margin-top: 5px;
  padding: 5px;
  justify-content: space-evenly;
`
const SearchType = styled.TouchableOpacity`
  overflow: hidden;
  border: 1px;
  border-color: #000;
  border-radius: 12px;
  margin: 0 2px;
  width: 48%;
  padding: 5px;
`
const SearchTypeText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  color: #000;
`
const Main = styled.View`
`
const ResultContainer = styled.View`
flex-grow: 1;
margin-top: 5px;
`
const RouteButton = styled.TouchableOpacity`
padding: 10px;
border-radius: 12px;
background-color: rgba(127, 17, 224, .2);
overflow: hidden;
margin-bottom: 5px;
`


export default Search