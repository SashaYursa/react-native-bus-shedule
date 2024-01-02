import React, { useEffect, useRef } from 'react'
import { ImageURISource, Text, View } from 'react-native'
import { Callout, CalloutPressEvent, LatLng, MapMarker as NativeMapMarker, Marker } from 'react-native-maps'
import IconIonic from 'react-native-vector-icons/Ionicons'
import styled from 'styled-components/native'

type Props = {
    isSelected: boolean
    name: string,
    position: LatLng
    id: number
    icon: ImageURISource
    savePosition: (newPosition: LatLng, pointId: number) => void
    setSelectedMarker: (id: number) => void
}

const MapMarker = ({isSelected, name, position, id, icon, savePosition, setSelectedMarker}: Props) => {
    console.log(isSelected)
    const markerRef = useRef<NativeMapMarker>(null)

    useEffect(() => {
        if(markerRef){
            markerRef.current?.hideCallout()
            console.log('redraw')
        }
    }, [markerRef, isSelected])

    const calloutAction = (e: CalloutPressEvent) => {
        if(isSelected){
            if(e.nativeEvent.coordinate?.latitude && e.nativeEvent.coordinate?.longitude){
                savePosition(e.nativeEvent.coordinate, id)
            }
        }else{
            setSelectedMarker(id)
        }
    }

    return (
    <Marker title={name}
    identifier={String(id)}
    coordinate={position}
    draggable={isSelected}
    ref={markerRef}
    tracksViewChanges={false}
    icon={!isSelected ? icon : 0}
    >
        <Callout 
        onPress={(e) => {calloutAction(e)}} 
        tooltip={true}
        >
            <MarkerButton>
                <Text style={{color: '#fff'}}>
                    { isSelected 
                    ? "Зберегти" 
                    : "Перемістити точку"
                    }
                </Text>
            </MarkerButton>
        </Callout>
    </Marker>
    )
}
const MarkerButton = styled.View`
    background-color: green;
    align-items: center; 
    justify-content: center; 
    padding-top: 3px;
    padding-bottom: 3px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 12px;
    width: 200px 
`

export default MapMarker