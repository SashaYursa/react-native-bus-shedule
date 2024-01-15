import React from 'react'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type Props = {
    cancel: () => void
    name: string
}

const SelectedStation = ({cancel, name}: Props) => {
    return (
        <SelectedStationContainer>
            <SearchInputContainer>
                <SearchRouteInputText>
                    {name}
                </SearchRouteInputText>
            </SearchInputContainer>
            <ChangeSearchModeButton onPress={cancel}> 
                <Icon name='close' color='#000' size={25}/>
            </ChangeSearchModeButton>
        </SelectedStationContainer>
    )
}

const SelectedStationContainer = styled.View`
flex-direction: row;
` 
const SearchInputContainer = styled.View`
flex-direction: row;
border-color: #000;
border-radius: 12px;
border-width: 1px;
background-color: #eaeaea;
flex-grow: 1;
justify-content: center;
align-items: center;
padding: 5px;

`
const SearchRouteInputText = styled.Text`
font-size: 16px;
flex-grow: 1;
color: #000;
font-weight: 700;
`
const ChangeSearchModeButton = styled.TouchableOpacity`
align-items: center;
justify-content: center;
padding: 14px 10px;
background-color: #fff;
border-radius: 12px;
border-width: 1px;
border-color: #000;
margin-left: 5px;
`


export default SelectedStation