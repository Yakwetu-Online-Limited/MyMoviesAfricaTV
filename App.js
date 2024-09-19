import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MembershipScreen from './membership/MembershipScreen';
import UpdateAccountForm from './membership/UpdateAccountForm';


const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Membership"
          component={MembershipScreen}
        />
        <Stack.Screen
          name="UpdateAccountForm"
          component={UpdateAccountForm} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


