import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function PantallaLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [cargando, setCargando] = useState(false);

  const manejarInicioSesion = async () => {
    if (!email.trim() || !contraseña.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setCargando(true);
    
    try {
      await signInWithEmailAndPassword(auth, email.trim(), contraseña);
      // El usuario será redirigido automáticamente por el estado de autenticación en App.js
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      let mensajeError = 'Error al iniciar sesión';
      
      switch (error.code) {
        case 'auth/user-not-found':
          mensajeError = 'No existe una cuenta con este correo electrónico';
          break;
        case 'auth/wrong-password':
          mensajeError = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          mensajeError = 'Correo electrónico inválido';
          break;
        case 'auth/too-many-requests':
          mensajeError = 'Demasiados intentos fallidos. Intenta más tarde';
          break;
        default:
          mensajeError = 'Error de conexión. Verifica tu internet';
      }
      
      Alert.alert('Error', mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoCirculo}>
            <Text style={styles.logoTexto}>Dd</Text>
          </View>
          <Text style={styles.logoNombre}>DISSMAR</Text>
          <Text style={styles.eslogan}>Tu Distribuidora de Confianza</Text>
        </View>

        {/* Formulario de login */}
        <View style={styles.formulario}>
          <Text style={styles.titulo}>Iniciar Sesión</Text>

          {/* Campo de usuario/email */}
          <View style={styles.campoContainer}>
            <Ionicons name="person-outline" size={24} color="#666" style={styles.icono} />
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Campo de contraseña */}
          <View style={styles.campoContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.icono} />
            <TextInput
              style={[styles.input, styles.inputContraseña]}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={contraseña}
              onChangeText={setContraseña}
              secureTextEntry={!mostrarContraseña}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              onPress={() => setMostrarContraseña(!mostrarContraseña)}
              style={styles.iconoOjo}
            >
              <Ionicons 
                name={mostrarContraseña ? "eye-outline" : "eye-off-outline"} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          {/* Botón de entrar */}
          <TouchableOpacity 
            style={[styles.botonEntrar, cargando && styles.botonDeshabilitado]} 
            onPress={manejarInicioSesion}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBotonEntrar}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Botón de crear cuenta */}
          <TouchableOpacity 
            style={styles.botonCrearCuenta}
            onPress={() => navigation.navigate('Registro')}
          >
            <Ionicons name="person-add-outline" size={20} color="#8B4513" />
            <Text style={styles.textoBotonCrear}>Crear Cuenta</Text>
          </TouchableOpacity>

          {/* Link Sobre la empresa */}
          <TouchableOpacity style={styles.linkEmpresa}>
            <Text style={styles.textoLinkEmpresa}>Sobre la empresa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCirculo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoTexto: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoNombre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  eslogan: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  formulario: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  campoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icono: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  inputContraseña: {
    paddingRight: 50,
  },
  iconoOjo: {
    position: 'absolute',
    right: 15,
  },
  botonEntrar: {
    backgroundColor: '#8B4513',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  botonDeshabilitado: {
    backgroundColor: '#ccc',
  },
  textoBotonEntrar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botonCrearCuenta: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  textoBotonCrear: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  linkEmpresa: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  textoLinkEmpresa: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});