import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import BusStations from '../screens/BusStations'
import BusShedule from '../screens/BusShedule'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
type Props = {}

const Tab = createBottomTabNavigator();

const Navigation: React.FC<Props> = (props: Props) => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='Search' component={BusStations} 
        options={{tabBarIcon: ({focused}) => {
            return <Icon name="search" size={20} color={focused ? "#5F8670" : "#000"}/>
        },
        tabBarLabel: ({focused}) => {
          return <Text style={{color: focused ? "#5F8670" : "#000"}}>
            Автостанції
          </Text>
        },
        headerShown: false
        }}/>
        <Tab.Screen name='BusShedule' component={BusShedule} options={{
          tabBarIcon: ({focused}) => {
            return <Icon name="list" size={20} color={focused ? "#5F8670" : "#000"}/>
        },
        tabBarLabel: ({focused}) => {
          return <Text style={{color: focused ? "#5F8670" : "#000"}}>
            Розклад
          </Text>
        }
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation