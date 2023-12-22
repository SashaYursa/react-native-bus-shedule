import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Search from '../screens/Search'
import BusShedule from '../screens/BusShedule'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
type Props = {}

const Tab = createBottomTabNavigator();

const Navigation: React.FC<Props> = (props: Props) => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='BusShedule' component={BusShedule} options={{
          tabBarIcon: ({focused}) => {
            return <Icon name="list" size={20} color={focused ? "#5F8670" : "#000"}/>
        },
        tabBarLabel: ({focused}) => {
          return <Text style={{color: focused ? "#5F8670" : "#000"}}>
            Shedule
          </Text>
        }
        }}/>
        <Tab.Screen name='Search' component={Search} 
        options={{tabBarIcon: ({focused}) => {
            return <Icon name="search" size={20} color={focused ? "#5F8670" : "#000"}/>
        },
        tabBarLabel: ({focused}) => {
          return <Text style={{color: focused ? "#5F8670" : "#000"}}>
            hehehehe
          </Text>
        }}}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation