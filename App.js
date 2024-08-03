import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from './Screens/Home';
import Profile from './Screens/Profile';
import Menu from './Screens/Menu';
import Program from './Screens/Program';
import Chart from './Screens/Chart';
import Result from './Screens/Result';
import WaterCal from './Screens/WaterCal';
import Index from './Screens/Index';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Complete from './Screens/Complete';
import { AuthContext, AuthProvider } from './Screens/Context';
import Profile0 from './Screens/Profile0';
import Chart0 from './Screens/Chart0';
import Program0 from './Screens/Program0';
import Setting from './Screens/Setting';
import Feedback from './Screens/Feedback';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const appVersion = '1.0.0';

const StackHome = () => {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name='Menu' component={Menu} options={{ headerShown: false }} />
      <Stack.Screen name='Result' component={Result} options={{ headerShown: false }} />
      <Stack.Screen name='WaterCal' component={WaterCal} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const StackProfile = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name='Program' component={Program} options={{ headerShown: false }} />
      <Stack.Screen name='Chart' component={Chart} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}
const SettingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Setting0' component={Setting} options={{ headerShown: false }} />
      <Stack.Screen name='Feedback' component={Feedback} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const AuthenScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Index' component={Index} options={{ headerShown: false }} />
      <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
      <Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
      <Stack.Screen name='Complete' component={Complete} options={{ headerShown: false }} />
      <Stack.Screen name='Profile0' component={Profile0} options={{ headerShown: false }} />
      <Stack.Screen name='Program0' component={Program0} options={{ headerShown: false }} />
      <Stack.Screen name='Chart0' component={Chart0} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const AllScreen = () => {
  return (
    <Tab.Navigator screenOptions={{ unmountOnBlur: true, tabBarActiveTintColor: '#22C7A9', tabBarStyle: { backgroundColor: '#fff' } }}>
      < Tab.Screen
        name='StackHome'
        component={StackHome}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen
        name='StackProfile'
        component={StackProfile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
          tabBarLabel: 'Profile',
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name='ResultB'
        component={Chart}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-text-o" color={color} size={size} />
          ),
          tabBarLabel: 'Blood Result',
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name='Setting'
        component={SettingStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
          tabBarLabel: 'Setting',
        }}
      />
    </Tab.Navigator>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthContext.Consumer>
          {({ isLoggedIn }) =>
            isLoggedIn === null ? null : isLoggedIn ? (
              <AllScreen />
            ) : (
              <AuthenScreen />
            )
          }
        </AuthContext.Consumer>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
