import React, { useState } from 'react'
import styled from 'styled-components/native'

type Props = {}

const Search: React.FC<Props> = (props: Props) => {
    const [value, setValue] = useState('')
    return (
        <SearchBar>
            <SearchInput value={value} onChangeText={setValue}/>
        </SearchBar>
    )
}

const SearchBar = styled.View`
  flex-direction: row;
  gap: 10px;
  background-color: #fff;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
`
const SearchInput = styled.TextInput`
  padding: 10px;
  font-size: 16px;
  background-color: #eaeaea;
  border-radius: 12px;
  border: none;
  flex-grow: 1;
`

export default Search;