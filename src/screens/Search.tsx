import React, { useState } from 'react'
import styled from 'styled-components/native'
import { Text } from 'react-native';
import SearchStations from '../components/SearchStations';
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BusFindStackParamList } from '../navigation/Navigation';
import { ISheduleItem } from '../store/types';
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
  const [selectedSearchType, setSelectedSearchType] = useState<'stations' | 'flights'>()  
  const moveToRoute = (bus: ISheduleItem) => {
    navigation.navigate('Route', {screen: 'BusRoute', params: bus})
  } 
  return (
    <Container>
      <SearchTypes>
        <SearchType 
        onPress={() => selectedSearchType !== 'stations' ? setSelectedSearchType('stations'): {}} 
        style={selectedSearchType === 'stations' ? {backgroundColor: '#000'}: {}}>
          <SearchTypeText style={selectedSearchType === 'stations' ? {color: '#fff'}: {}}>
            Станції
          </SearchTypeText>
        </SearchType>
        <SearchType 
        onPress={() => selectedSearchType !== 'flights' ? setSelectedSearchType('flights'): {}} 
        style={selectedSearchType === 'flights' ? {backgroundColor: '#000'}: {}}>
          <SearchTypeText style={selectedSearchType === 'flights' ? {color: '#fff'}: {}}>
            Рейси
          </SearchTypeText>
        </SearchType>
      </SearchTypes>
      <Main>
        {selectedSearchType === 'stations' 
        ? <SearchStations moveToRouteScreen={moveToRoute}/>
        : <Text>Not stations</Text>
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