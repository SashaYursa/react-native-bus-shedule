import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import styled from 'styled-components/native';

type Props = {
    items: {title: string, value: string}[],
    title: string,
    selectedValue: string | undefined,
    setSelectedValue: (value: string) => void, 
    enabled: boolean,
}   
const Selector = ({items, title, selectedValue, setSelectedValue, enabled}: Props) => {
    console.log('rerender selector')
    return (
        <Container style={!enabled ? {backgroundColor: '#707070', borderWidth: 0} : {}}>
            <Picker 
            enabled={enabled} 
            prompt={title} 
            mode='dropdown'
            style={{color: '#000'}}  
            dropdownIconColor='#000' 
            selectedValue={selectedValue} 
            onValueChange={setSelectedValue}
            >
                {
                    items.map(item => {
                        return (
                            <Picker.Item key={item.value} label={item.title} value={item.value}/>
                        )
                    })
                }
            </Picker>
        </Container>
    )
}

const Container = styled.View`
 background-color: #fff;
 border-color: #000;
 border-width: 1px;
 border-radius: 12px;
 overflow: hidden;
`

export default Selector