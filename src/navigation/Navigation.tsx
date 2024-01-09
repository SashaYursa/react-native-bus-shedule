import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import BusStations from '../screens/BusStations'
import Search from '../screens/Search'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import MDIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import StationShedule from '../screens/StationShedule'
import { IBusStations, ISheduleItem } from '../store/types'
import Route, { waypoints } from '../screens/Route'
import Map from '../screens/Map'
import Info from '../screens/Info'
type Props = {}

type RootBottomTabsParamList = {
  BusShedule: BottomTabScreenProps<BusStackParamList>
  Info: BottomTabScreenProps<InfoParamList>
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
export type InfoParamList = {
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
  return (
    <NavigationContainer>
      <BottomTab.Navigator>
        <BottomTab.Screen name='BusShedule' component={BusShedule} 
        options={{tabBarIcon: ({focused}) => {
            return <Icon name="list" size={20} color={focused ? "#5F8670" : "#000"}/>
        },
        tabBarShowLabel: false,
        headerShown: false
        }}/>
        <BottomTab.Screen name='Info' component={Info} 
        options={{tabBarIcon: ({focused}) => {
            return <MDIcon name="information-outline" size={25} color={focused ? "#5F8670" : "#000"}/>
        },
        tabBarShowLabel: false,
        headerShown: false
        }}/>
        <BottomTab.Screen name='BusFind' component={Search} options={{
          tabBarIcon: ({focused}) => {
            return <Icon name="search" size={20} color={focused ? "#5F8670" : "#000"}/>
        },
        tabBarShowLabel: false,
        headerShown: false
        }}/>
      </BottomTab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation