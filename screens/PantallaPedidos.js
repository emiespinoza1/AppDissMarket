import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/ContextoAuth';
import LogoDissmar from '../components/LogoDissmar';

export default function PantallaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const { usuarioActual } = useAuth();

  // Función para cargar pedidos del usuario
  const cargarPedidos = async () => {
    if (!usuarioActual) {
      setPedidos([]);
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      const q = query(
        collection(db, 'pedidos'),
        where('usuarioId', '==', usuarioActual.uid),
        orderBy('fechaPedido', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const pedidosData = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        pedidosData.push({
          id: doc.id,
          ...data,
          fechaPedido: data.fechaPedido?.toDate(),
          fechaEntrega: data.fechaEntrega?.toDate()
        });
      });

      setPedidos(pedidosData);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      Alert.alert('Error', 'No se pudieron cargar los pedidos');
    } finally {
      setCargando(false);
    }
  };

  // Función para refrescar pedidos
  const onRefresh = async () => {
    setRefrescando(true);
    await cargarPedidos();
    setRefrescando(false);
  };

  // Función para reordenar un pedido
  const reordenar = async (pedido) => {
    Alert.alert(
      'Reordenar',
      `¿Deseas realizar el mismo pedido nuevamente?\n\nTotal: C$ ${pedido.total.toFixed(2)}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Reordenar',
          onPress: async () => {
            try {
              // Aquí podrías agregar los productos al carrito nuevamente
              // Por simplicidad, solo mostramos un mensaje
              Alert.alert('Función en desarrollo', 'Esta funcionalidad estará disponible pronto');
            } catch (error) {
              console.error('Error al reordenar:', error);
              Alert.alert('Error', 'No se pudo reordenar el pedido');
            }
          },
        },
      ]
    );
  };

  // Función para obtener el color del estado
  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'pendiente':
        return '#ff9500';
      case 'entregado':
        return '#4CAF50';
      case 'cancelado':
        return '#ff4757';
      default:
        return '#666';
    }
  };

  // Función para obtener el texto del estado
  const obtenerTextoEstado = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'entregado':
        return 'Entregado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Componente para renderizar cada pedido
  const TarjetaPedido = ({ item }) => (
    <View style={styles.tarjetaPedido}>
      <View style={styles.encabezadoPedido}>
        <Text style={styles.numeroPedido}>Pedido #{item.id.substring(0, 8)}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: obtenerColorEstado(item.estado) }]}>
          <Text style={styles.textoEstado}>{obtenerTextoEstado(item.estado)}</Text>
        </View>
      </View>

      <Text style={styles.fechaPedido}>{formatearFecha(item.fechaPedido)}</Text>

      <View style={styles.itemsPedido}>
        {item.items.map((producto, index) => (
          <Text key={index} style={styles.itemTexto}>
            {producto.cantidad}x {producto.nombre}
          </Text>
        ))}
      </View>

      <View style={styles.piePedido}>
        <Text style={styles.totalPedido}>Total: C$ {item.total.toFixed(2)}</Text>
        
        <View style={styles.botonesAccion}>
          <TouchableOpacity 
            style={styles.botonVer}
            onPress={() => Alert.alert('Detalles', `Pedido #${item.id.substring(0, 8)}\n\nEstado: ${obtenerTextoEstado(item.estado)}\nFecha: ${formatearFecha(item.fechaPedido)}\nTotal: C$ ${item.total.toFixed(2)}`)}
          >
            <Text style={styles.textoBotonVer}>Ver Detalles</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.botonReordenar}
            onPress={() => reordenar(item)}
          >
            <Text style={styles.textoBotonReordenar}>Reordenar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Cargar pedidos al montar el componente
  useEffect(() => {
    cargarPedidos();
  }, [usuarioActual]);

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

      {/* Título de la sección */}
      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>Mis Pedidos</Text>
        <Text style={styles.subtitulo}>Historial de pedidos</Text>
      </View>

      {/* Contenido principal */}
      {cargando ? (
        <View style={styles.cargandoContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
          <Text style={styles.textoCargando}>Cargando pedidos...</Text>
        </View>
      ) : pedidos.length === 0 ? (
        <View style={styles.sinPedidos}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <Text style={styles.textoSinPedidos}>No tienes pedidos aún</Text>
          <Text style={styles.subtextoSinPedidos}>
            Tus pedidos aparecerán aquí una vez que realices compras
          </Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TarjetaPedido item={item} />}
          contentContainerStyle={styles.listaPedidos}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={onRefresh}
              colors={['#8B4513']}
            />
          }
        />
      )}
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
  tituloContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
  },
  cargandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCargando: {
    marginTop: 10,
    fontSize: 16,
    color: '#8B4513',
  },
  sinPedidos: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  textoSinPedidos: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtextoSinPedidos: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  listaPedidos: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tarjetaPedido: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  encabezadoPedido: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  numeroPedido: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  textoEstado: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fechaPedido: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  itemsPedido: {
    marginBottom: 15,
  },
  itemTexto: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  piePedido: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
  },
  totalPedido: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 15,
  },
  botonesAccion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botonVer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
  },
  textoBotonVer: {
    color: '#8B4513',
    fontWeight: '600',
    textAlign: 'center',
  },
  botonReordenar: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    marginLeft: 10,
  },
  textoBotonReordenar: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});