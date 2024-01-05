import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

type Props = {
    actionHandler: () => void
    errorText: string
    actionText: string
}

const ErrorLoad = ({actionHandler, errorText, actionText}: Props) => {
  return (
    <ErrorContainer>
        <ErrorText>
            {errorText}
        </ErrorText>
        <ErrorButton onPress={actionHandler}
        style={{marginTop: 10, borderRadius: 12, backgroundColor: '#000', padding: 10}}>
            <ButtonText>
                {actionText}
            </ButtonText>
        </ErrorButton>
    </ErrorContainer>
  )
}

const ErrorContainer = styled.View`
    flex-grow: 1;
    align-items: center;
    justify-content: center;
`

const ErrorText = styled.Text`
    font-size: 16px;
    font-weight: 700;
    color: #000;
`

const ErrorButton = styled.TouchableOpacity`
    margin-top: 10px;
    border-radius: 12px;
    background-color: #000;
    padding: 10px;
`

const ButtonText = styled.Text`
font-size: 14px;
color: #fff;
`


export default ErrorLoad