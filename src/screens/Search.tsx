import React, { useState } from 'react'
import styled from 'styled-components/native'
import { Text } from 'react-native';
import SearchByRoute from '../components/SearchByRoute';
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BusFindStackParamList } from '../navigation/Navigation';
import { ISheduleItem } from '../store/types';
import SearchByStation from '../components/SearchByStation';
type Props = {}
const items = [
  'aasdasda',
  'aasdasd21',
  'aasd123a',
  'fasdfsddasda',
  '1231da',
  'asfksldasda',
  'fsdfa',
  'sfdfasda',
  'fsdasda',
]
const Search = ({navigation, route}: NativeStackScreenProps<BusFindStackParamList, 'SearchScreen'>) => {  
  const [selectedSearchType, setSelectedSearchType] = useState<'byStations' | 'byRoute'>()  
  const moveToRoute = (bus: ISheduleItem) => {
    navigation.navigate('Route', {screen: 'BusRoute', params: bus})
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
        ? <SearchByRoute moveToRouteScreen={moveToRoute}/>
        : <SearchByStation moveToRouteScreen={moveToRoute} />
        }
      </Main>
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
  flex-grow: 1;
  flex-shrink: 1;
`


export default Search