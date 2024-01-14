import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

const Loading = () => {
    return (
        <Container>
            <ActivityIndicator size='large'/>
        </Container>
    )

}

const Container = styled.View`
    flex-grow: 1;
    align-items: center;
    justify-content: center;
`

export default Loading