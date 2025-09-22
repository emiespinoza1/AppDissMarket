import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Importar pantallas
import PantallaSplash from './screens/PantallaSplash';
import PantallaLogin from './screens/PantallaLogin';
import PantallaRegistro from './screens/PantallaRegistro';
import PantallaCatalogo from './screens/PantallaCatalogo';
import PantallaFavoritos from './screens/PantallaFavoritos';
import PantallaCarrito from './screens/PantallaCarrito';
import PantallaPedidos from './screens/PantallaPedidos';
import PantallaPerfil from './screens/PantallaPerfil';
import PantallaEditarPerfil from './screens/PantallaEditarPerfil';

// Contextos
import { ProveedorAuth } from './contexts/ContextoAuth';
import { ProveedorCarrito } from './contexts/ContextoCarrito';
import { ProveedorFavoritos } from './contexts/ContextoFavoritos';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegación de pestañas principales
function NavegadorPrincipal() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let nombreIcono;

          switch (route.name) {
            case 'Catálogo':
              nombreIcono = focused ? 'home' : 'home-outline';
              break;
            case 'Favoritos':
              nombreIcono = focused ? 'heart' : 'heart-outline';
              break;
            case 'Carrito':
              nombreIcono = focused ? 'cart' : 'cart-outline';
              break;
            case 'Pedidos':
              nombreIcono = focused ? 'list' : 'list-outline';
              break;
            case 'Perfil':
              nombreIcono = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={nombreIcono} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8B4513', // Color marrón como en el diseño
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#f8f8f8',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Catálogo" 
        component={PantallaCatalogo}
        options={{ tabBarLabel: 'Catálogo' }}
      />
      <Tab.Screen 
        name="Favoritos" 
        component={PantallaFavoritos}
        options={{ tabBarLabel: 'Favoritos' }}
      />
      <Tab.Screen 
        name="Carrito" 
        component={PantallaCarrito}
        options={{ tabBarLabel: 'Carrito' }}
      />
      <Tab.Screen 
        name="Pedidos" 
        component={PantallaPedidos}
        options={{ tabBarLabel: 'Pedidos' }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={PantallaPerfil}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, (usuario) => {
      setUsuario(usuario);
      setCargando(false);
    });

    return desuscribir;
  }, []);

  if (cargando) {
    return <PantallaSplash />;
  }

  return (
    <ProveedorAuth>
      <ProveedorCarrito>
        <ProveedorFavoritos>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {usuario ? (
                // Usuario autenticado - mostrar pantallas principales
                <>
                  <Stack.Screen name="PrincipalTabs" component={NavegadorPrincipal} />
                  <Stack.Screen name="EditarPerfil" component={PantallaEditarPerfil} />
                </>
              ) : (
                // Usuario no autenticado - mostrar pantallas de login
                <>
                  <Stack.Screen name="Login" component={PantallaLogin} />
                  <Stack.Screen name="Registro" component={PantallaRegistro} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </ProveedorFavoritos>
      </ProveedorCarrito>
    </ProveedorAuth>
  );
}