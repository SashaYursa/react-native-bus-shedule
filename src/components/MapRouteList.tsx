import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import styled from 'styled-components/native'
import { waypoints } from '../screens/Route'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { mapPoint } from '../screens/Map'


type Props = {
    points: mapPoint[]
    moveToMarker: (id: number) => void
    addMarker: (id: number) => void
}

const MapRouteList = ({ points, moveToMarker, addMarker }: Props) => {
    const [infoListOpen, setInfoListOpen] = useState<boolean>(false)

    const missedPoints = points.filter(p => p.isMissed)
    const displayedPoints = points.filter(p => !p.isMissed)    
    
    const moveToMarkerHandler = (id: number) => {
        moveToMarker(id)
        setInfoListOpen(false)
    }
    const addMarkerHandler = (id: number) => {
        addMarker(id)
        setInfoListOpen(false)
    }

    return (
        <>
        {infoListOpen &&
        <PointsContainer>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{}}>
                <PointsList>
                    { missedPoints.length > 0
                    ? <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, color: 'red', textAlign: 'center', fontWeight: '700'}}>Точки які відсутні на карті</Text>
                        { 
                            missedPoints.map(point => {
                                return (
                                    <PointItem key={point.id}>
                                        <Text style={{flex: 1}}>
                                            {point.name}
                                        </Text>
                                        <TouchableOpacity onPress={() => addMarkerHandler(point.id)} style={{padding: 5, backgroundColor: '#0F0F0F', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                                        <Icon name='plus' color='#fff' size={20}/>
                                        </TouchableOpacity>
                                    </PointItem>
                                )
                            })
                        }
                    </View>
                    : <></> 
                    }
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 18, color: 'green', textAlign: 'center', fontWeight: '700'}}>Маршрут</Text>
                        { 
                            displayedPoints.map(point => {
                                return (
                                    <PointItem key={point.id}>
                                        <Text style={{flex: 1, fontWeight: '700', color: '#000'}}>
                                            {point.name}
                                        </Text>
                                        <TouchableOpacity onPress={() => moveToMarkerHandler(point.id)} style={{padding: 7, backgroundColor: '#0F0F0F', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                                            <Icon name='eye-arrow-right' color='#fff' size={20}/>
                                        </TouchableOpacity>
                                    </PointItem>
                                )
                            })
                        }
                    </View> 
                </PointsList>
            </ScrollView>
        </PointsContainer>
        }
        <InfoButton onPress={() => setInfoListOpen(prev => !prev)}>
            <Icon 
            name={infoListOpen ? 'close-circle-outline' :'information-outline'} 
            size={30} 
            color={infoListOpen ? 'red' : '#000000'}/>
        </InfoButton>
    </>
  )
}


const PointsContainer = styled.ScrollView`
    position: absolute;
    z-index: 2;
    top: 10px;
    min-width: 250px;
    max-height: 300px;
    max-width: 400px;
    right: 50px;
    padding: 5px;
    background-color: #fff;
    border-width: 1px;
    border-color: #000;
    border-radius: 12px;
    overflow: hidden;
`
const PointsList = styled.View`
    position: relative;
    flex-grow: 1;
    background-color: #fff;
    overflow: hidden;
`
const InfoButton = styled.TouchableOpacity`
    position: absolute;
    z-index: 2;
    top: 10px;
    right: 10px;
`

const PointItem = styled.View`
margin-top: 5px;
flex-direction: row;
background-color: #dddd;
border-radius: 12px;
border-color: #000;
padding: 5px;
flex-grow:1;
align-items: center;
`

export default MapRouteList
