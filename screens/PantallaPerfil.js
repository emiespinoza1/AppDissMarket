import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/ContextoAuth';
import LogoDissmar from '../components/LogoDissmar';


export default function PantallaPerfil({ navigation }) {
  const { usuarioActual, datosUsuario, cerrarSesion } = useAuth();

  // Función para manejar el cierre de sesión
  const manejarCerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: cerrarSesion,
        },
      ]
    );
  };

  // Función para mostrar información de ayuda
  const mostrarAyuda = () => {
    Alert.alert(
      'Ayuda y Soporte',
      'Para recibir ayuda, contáctanos:\n\n• Teléfono: +505 8231-0640\n• Email: soporte@dissmar.com\n• Horario: Lunes a Domingo 8:00 AM - 6:00 PM'
    );
  };

  // Función para mostrar configuración de cuenta
  const mostrarConfiguracion = () => {
    Alert.alert(
      'Configuración de la Cuenta',
      'Las opciones de configuración avanzada estarán disponibles en próximas versiones'
    );
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <LogoDissmar size="small" showText={false} style={{ marginRight: 10 }} />
          <Text style={styles.logoNombre}>DISSMAR</Text>
        </View>
        <Text style={styles.eslogan}>Tu Distribuidora de Confianza</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Información del perfil */}
        <View style={styles.perfilContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color="#666" />
            </View>
          </View>
          
          <Text style={styles.nombreUsuario}>
            {datosUsuario?.nombreCompleto || 'Usuario'}
          </Text>
          <Text style={styles.emailUsuario}>
            {usuarioActual?.email || 'email@ejemplo.com'}
          </Text>
        </View>

        {/* Datos Personales */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Datos Personales</Text>
          
          <View style={styles.campo}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.iconoCampo} />
            <View style={styles.infoCampo}>
              <Text style={styles.etiquetaCampo}>Nombre</Text>
              <Text style={styles.valorCampo}>
                {datosUsuario?.nombreCompleto || 'No especificado'}
              </Text>
            </View>
          </View>

          <View style={styles.campo}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.iconoCampo} />
            <View style={styles.infoCampo}>
              <Text style={styles.etiquetaCampo}>Correo</Text>
              <Text style={styles.valorCampo}>
                {datosUsuario?.email || usuarioActual?.email || 'No especificado'}
              </Text>
            </View>
          </View>

          <View style={styles.campo}>
            <Ionicons name="call-outline" size={20} color="#666" style={styles.iconoCampo} />
            <View style={styles.infoCampo}>
              <Text style={styles.etiquetaCampo}>Teléfono</Text>
              <Text style={styles.valorCampo}>
                {datosUsuario?.telefono || 'No especificado'}
              </Text>
            </View>
          </View>

          <View style={styles.campo}>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.iconoCampo} />
            <View style={styles.infoCampo}>
              <Text style={styles.etiquetaCampo}>Dirección</Text>
              <Text style={styles.valorCampo}>
                {datosUsuario?.direccion || 'No especificada'}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.botonEditar}
            onPress={() => navigation.navigate('EditarPerfil')}
          >
            <Ionicons name="create-outline" size={20} color="#8B4513" />
            <Text style={styles.textoBotonEditar}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Configuración */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Configuración</Text>
          
          <TouchableOpacity style={styles.opcionMenu} onPress={mostrarConfiguracion}>
            <View style={styles.iconoOpcion}>
              <Ionicons name="settings-outline" size={24} color="#666" />
            </View>
            <Text style={styles.textoOpcion}>Configuración de la Cuenta</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.opcionMenu} onPress={mostrarAyuda}>
            <View style={styles.iconoOpcion}>
              <Ionicons name="help-circle-outline" size={24} color="#666" />
            </View>
            <Text style={styles.textoOpcion}>Ayuda y Soporte</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.opcionMenu} onPress={manejarCerrarSesion}>
            <View style={styles.iconoOpcion}>
              <Ionicons name="log-out-outline" size={24} color="#ff4757" />
            </View>
            <Text style={[styles.textoOpcion, styles.textoOpcionRoja]}>Cerrar sesión</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
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
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  logoCirculo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  eslogan: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 50,
  },
  scrollContainer: {
    flex: 1,
  },
  perfilContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nombreUsuario: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  emailUsuario: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  seccion: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tituloSeccion: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconoCampo: {
    marginRight: 15,
    width: 20,
  },
  infoCampo: {
    flex: 1,
  },
  etiquetaCampo: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  valorCampo: {
    fontSize: 16,
    color: '#333',
  },
  botonEditar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
  },
  textoBotonEditar: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  opcionMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconoOpcion: {
    width: 40,
    alignItems: 'center',
  },
  textoOpcion: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  textoOpcionRoja: {
    color: '#ff4757',
  },
});