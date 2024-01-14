import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from 'styled-components/native'

type Props = {
  updateFilter: (val: string) => void
}

const Search: React.FC<Props> = ({updateFilter}: Props) => {
    const [value, setValue] = useState('')
    useLayoutEffect(() => {
      updateFilter(value)
    }, [value])

    const clearInput = () => {
      setValue('')
    }

    return (
        <SearchBar>
            <SearchInput placeholder="Пошук" value={value} onChangeText={setValue}/>
            { value && 
              <ClearInputValue onPress={clearInput}>
                <Icon size={20} name="backspace"/>
              </ClearInputValue>
            }
        </SearchBar>
    )
}

const SearchBar = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  height: 60px;
  background-color: #fff;
`
const SearchInput = styled.TextInput`
  padding: 10px;
  font-size: 16px;
  background-color: #eaeaea;
  border-radius: 12px;
  border: none;
  flex-grow: 1;
`
const ClearInputValue = styled.TouchableOpacity`
  padding: 10px;
  border-radius: 12px;
  background-color: #eaeaea;
  margin-left: 10px;
  height: 100%;
  align-items: center;
  flex-direction: row;
`

export default Search;