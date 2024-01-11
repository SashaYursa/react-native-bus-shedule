import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Selector from './Selector'
import { View } from 'react-native'

type Props = {
    enabled: boolean
    itemsForSearch: {title: string, value: string}[]
    setSelectedValue: (value: string, type?: 'input') => void
    selectedValue: string | undefined
    title: string
}

const SearchField = ({enabled, itemsForSearch, setSelectedValue, selectedValue, title}: Props) => {
    const [searchType, setSearchType] =  useState<'list' | 'input'>('list')
    const [searchValue, setSearchValue] = useState<string>('')

    useEffect(() => {
        if(searchValue && searchType === 'input'){
            const timeout = setTimeout(() => {
                setSelectedValue(searchValue.toUpperCase(), 'input')
            }, 100);
            return () => {clearTimeout(timeout)}
        }
    }, [searchValue])
    return (
        <Container>
        { searchType === 'list' 
        ? <SelectorContainer>
            <Selector enabled={enabled} 
            selectedValue={selectedValue ? String(selectedValue) : undefined} 
            setSelectedValue={(value) => setSelectedValue(value)} 
            items={itemsForSearch} 
            title={title}/>
        </SelectorContainer>
        : <SearchInputContainer>
            <SearchRouteInput value={searchValue} onChangeText={setSearchValue}/>
        </SearchInputContainer>
        }
        <View>
            <ChangeSearchModeButton onPress={() => setSearchType(type => {
                if(type === 'input') {
                    setSearchValue('')
                    setSelectedValue('', undefined)
                }
                return type === 'input' ? 'list' : 'input'
                })}>
                <Icon name={searchType === 'list' ? 'magnify' : 'form-dropdown'} color='#000' size={25}/>
            </ChangeSearchModeButton>
        </View>
        </Container>
    )
}

const Container = styled.View`
    flex-direction: row;    
`

const SelectorContainer = styled.View`
flex-grow: 1;
`

const ChangeSearchModeButton = styled.TouchableOpacity`
align-items: center;
justify-content: center;
padding: 14px 10px;
flex-grow: 1;
background-color: #fff;
border-radius: 12px;
border-width: 1px;
border-color: #000;
margin-left: 5px;
`

const SearchInputContainer = styled.View`
border-color: #000;
border-radius: 12px;
border-width: 1px;
background-color: #fff;
flex-grow: 1;
justify-content: center;
`
const SearchRouteInput = styled.TextInput`
font-size: 16px;
flex-grow: 1;
`


export default SearchField;