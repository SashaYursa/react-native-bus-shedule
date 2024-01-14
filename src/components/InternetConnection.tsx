import React, { FC, PropsWithChildren, ReactNode } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNetInfo } from '@react-native-community/netinfo'
import styled from 'styled-components/native'

type Props = {
}

const InternetConnection: React.FC<PropsWithChildren<Props>> = ({children}) => {
    const netInfo = useNetInfo()

    return netInfo.isConnected 
    ? children
    : (
        <>
            <LostInternetConnectionContainer>
                <Icon name='alert-circle' size={25} color='#FFB534'/>
                <LostConnectionText>Відсутнє підключення до інтернету</LostConnectionText>
            </LostInternetConnectionContainer>
            { children }
        </>
    )
}
const LostInternetConnectionContainer = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const LostConnectionText = styled.Text`
    font-size: 14px;
    font-weight: 700;
    color: #000;
    margin-left: 5px;
`
export default InternetConnection;