import React, { useEffect } from 'react'
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native'
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { NativeStackScreenProps, createNativeStackNavigator,  } from '@react-navigation/native-stack'

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
  Search: BottomTabScreenProps<BusFindStackParamList>
}

export type BusStackParamList = {
  BusStations: undefined;
  StationShedule: { station: IBusStations };
  Route: NavigatorScreenParams<RouteStackParamList>
};
export type BusFindStackParamList = {
  SearchScreen: undefined;
  Route: NavigatorScreenParams<RouteStackParamList>
};

export type RouteStackParamList = {
  BusRoute: ISheduleItem;
  Map: {waypoints: waypoints, busId: number}
};
export type InfoParamList = {
};

const BottomTab = createBottomTabNavigator<RootBottomTabsParamList>();
const StationStack = createNativeStackNavigator<BusStackParamList>();
const SearchStack = createNativeStackNavigator<BusFindStackParamList>();
const RouteStack = createNativeStackNavigator<RouteStackParamList>();


const BusSheduleNavigation = () => {
  return (
    <StationStack.Navigator screenOptions={{
      animation: 'fade_from_bottom',
      headerShown: false
      }}>
      <StationStack.Screen name="BusStations" component={BusStations}/>
      <StationStack.Screen name="StationShedule" component={StationShedule} options={{headerShown: true, headerTitle: ''}}/>
      <StationStack.Screen name='Route' component={RouteNavigation}/>
    </StationStack.Navigator>
  )
}
const SearchNavigation = () => {
  return (
    <SearchStack.Navigator screenOptions={{
      animation: 'fade_from_bottom',
      headerShown: false
      }}>
      <SearchStack.Screen name="SearchScreen" component={Search} options={{
      }}/>
      <SearchStack.Screen name='Route' component={RouteNavigation}/>
    </SearchStack.Navigator>
  )
}

const RouteNavigation = () => {
  return (
    <RouteStack.Navigator initialRouteName='BusRoute' screenOptions={{
      animation: 'fade_from_bottom',
    }}>
      <RouteStack.Screen name="BusRoute" component={Route}/>
      <RouteStack.Screen name="Map" options={{
        animation: 'fade_from_bottom',
        headerShown: false,
        }} component={Map}/>
    </RouteStack.Navigator>
  )
}

const Navigation: React.FC<Props> = (props: Props) => {
  return (
    <NavigationContainer>
      <BottomTab.Navigator>
        <BottomTab.Screen name='BusShedule' component={BusSheduleNavigation} 
        options={{tabBarIcon: ({focused}) => {
            return <Icon name="list" size={20} color={focused ? "#41b874" : "#000"}/>
        },
        tabBarShowLabel: false,
        headerShown: false
        }}/>
        <BottomTab.Screen name='Info' component={Info} 
        options={{tabBarIcon: ({focused}) => {
            return <MDIcon name="information-outline" size={25} color={focused ? "#41b874" : "#000"}/>
        },
        tabBarShowLabel: false,
        headerShown: false
        }}/>
        <BottomTab.Screen name='Search' component={SearchNavigation} options={{
          tabBarIcon: ({focused}) => {
            return <Icon name="search" size={20} color={focused ? "#41b874" : "#000"}/>
        },
        tabBarShowLabel: false,
        headerShown: false
        }}/>
      </BottomTab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation