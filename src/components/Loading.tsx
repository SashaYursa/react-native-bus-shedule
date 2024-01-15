import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
type Props = {
    color?: string
}
const Loading = ({color = '#41b874'}: Props) => {
    return (
        <Container>
            <ActivityIndicator color={color} size='large'/>
        </Container>
    )

}

const Container = styled.View`
    flex-grow: 1;
    align-items: center;
    justify-content: center;
`

export default Loading