import React, { useEffect } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BusStackParamList } from '../navigation/Navigation'
import { useGetSheduleQuery } from '../store/slices/stationsAPI'
import styled from 'styled-components/native'

const StationShedule = ({ navigation , route }: NativeStackScreenProps<BusStackParamList, 'StationShedule'>) => {

    const station = route.params.station;
    const {data: sheduleData, error: sheduleError, isLoading: sheduleIsLoading} = useGetSheduleQuery(station.id)
    useEffect(() => {
        console.log(sheduleData, 'data')
        console.log(sheduleError, 'error')
    }, [sheduleError, sheduleData])

    useEffect(() => {
        navigation.setOptions({
            headerTitle: station.stationName
        })
    }, [])

    if(sheduleError){
        return (
            <View>
                <Text>
                    Error fetch data
                </Text>
            </View>
        )
    }
    if(sheduleIsLoading){
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size='large'/>
            </View>
        )
    }
    return (
        <Container>
            { sheduleData &&
            sheduleData.map((item) => (
                <View>
                    <Text>
                        {item?.arrivalTime}
                    </Text>
                    <Text>
                        {item.busInfo}
                    </Text>
                    <Text>
                        {item.busOwner}
                    </Text>
                    <Text>
                        {item.busRoute}
                    </Text>
                    <Text>
                        {item.cost}
                    </Text>
                    <Text>
                        {item.dateDeparture}
                    </Text>
                    <Text>
                        {item.emptyPlaces}
                    </Text>
                    <Text>
                        {item.id}
                    </Text>
                    <Text>
                        {item.routeLink}
                    </Text>
                    <Text>
                        {item.ticketsStatus}
                    </Text>
                </View>
            ))
            }
        </Container>
    )
}

const Container = styled.View`
    flex-grow: 1;
    flex-shrink: 1;
`

export default StationShedule