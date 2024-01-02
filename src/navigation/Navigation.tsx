import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import BusStations from '../screens/BusStations'
import BusSheduleI from '../screens/BusShedule'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import StationShedule from '../screens/StationShedule'
import { IBusRoute, IBusStations, ISheduleItem } from '../store/types'
import { useAppDispatch } from '../store';
import { setInfo } from '../store/slices/netInfo';
import Route, { waypoints } from '../screens/Route'
import Map from '../screens/Map'
type Props = {}

type RootBottomTabsParamList = {
  BusShedule: BottomTabScreenProps<BusStackParamList>
  BusFind: BottomTabScreenProps<BusFindStackParamList>
}

export type BusStackParamList = {
  BusStations: undefined;
  StationShedule: { station: IBusStations };
  BusRoute: ISheduleItem;
  Map: {waypoints: waypoints, busId: number}
};
export type BusFindStackParamList = {
};

const BottomTab = createBottomTabNavigator<RootBottomTabsParamList>();
const Stack = createNativeStackNavigator<BusStackParamList>();


const BusShedule = () => {
  return (
    <Stack.Navigator screenOptions={{
      animation: 'fade_from_bottom',
    }}>
      <Stack.Screen name="BusStations" component={BusStations} options={{
        headerShown: false
      }}/>
      <Stack.Screen name="StationShedule" component={StationShedule}/>
      <Stack.Screen name="BusRoute" component={Route}/>
      <Stack.Screen name="Map" options={{
        animation: 'fade_from_bottom',
        headerShown: false,
        }} component={Map}/>
    </Stack.Navigator>
  )
}

const Navigation: React.FC<Props> = (props: Props) => {
  const dispatch = useAppDispatch()
  return (
    <NavigationContainer>
      <BottomTab.Navigator>
        <BottomTab.Screen name='BusShedule' component={BusShedule} 
        options={{tabBarIcon: ({focused}) => {
            return <Icon name="search" size={20} color={focused ? "#5F8670" : "#000"}/>
        },
        tabBarLabel: ({focused}) => {
          return <Text style={{color: focused ? "#5F8670" : "#000"}}>
            Автостанції
          </Text>
        },
        headerShown: false
        }}>

        </BottomTab.Screen>
        <BottomTab.Screen name='BusFind' component={BusSheduleI} options={{
          tabBarIcon: ({focused}) => {
            return <Icon name="list" size={20} color={focused ? "#5F8670" : "#000"}/>
        },
        tabBarLabel: ({focused}) => {
          return <Text style={{color: focused ? "#5F8670" : "#000"}}>
            Розклад
          </Text>
        }
        }}/>
      </BottomTab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation