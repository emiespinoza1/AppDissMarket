import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './ContextoAuth';
import { Alert } from 'react-native';

const ContextoCarrito = createContext();

export const useCarrito = () => {
  return useContext(ContextoCarrito);
};

export const ProveedorCarrito = ({ children }) => {
  const [itemsCarrito, setItemsCarrito] = useState([]);
  const [cargandoCarrito, setCargandoCarrito] = useState(false);
  const { usuarioActual } = useAuth();

  // Función para agregar producto al carrito
  const agregarAlCarrito = async (producto, cantidad = 1) => {
    if (!usuarioActual) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    try {
      const itemExistente = itemsCarrito.find(item => item.id === producto.id);
      let nuevosItems;

      if (itemExistente) {
        // Si el producto ya existe, actualizar cantidad
        nuevosItems = itemsCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        // Si es un producto nuevo, agregarlo
        nuevosItems = [...itemsCarrito, {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagenUrl: producto.imagenUrl || '',
          cantidad: cantidad
        }];
      }

      setItemsCarrito(nuevosItems);
      await guardarCarritoEnFirestore(nuevosItems);
      
      Alert.alert('¡Agregado!', `${producto.nombre} agregado al carrito`);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      Alert.alert('Error', 'No se pudo agregar el producto al carrito');
    }
  };

  // Función para remover producto del carrito
  const removerDelCarrito = async (productoId) => {
    try {
      const nuevosItems = itemsCarrito.filter(item => item.id !== productoId);
      setItemsCarrito(nuevosItems);
      await guardarCarritoEnFirestore(nuevosItems);
    } catch (error) {
      console.error('Error al remover del carrito:', error);
      Alert.alert('Error', 'No se pudo remover el producto');
    }
  };

  // Función para actualizar cantidad de un producto
  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      await removerDelCarrito(productoId);
      return;
    }

    try {
      const nuevosItems = itemsCarrito.map(item =>
        item.id === productoId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      );
      
      setItemsCarrito(nuevosItems);
      await guardarCarritoEnFirestore(nuevosItems);
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  // Función para limpiar el carrito
  const limpiarCarrito = async () => {
    try {
      setItemsCarrito([]);
      await guardarCarritoEnFirestore([]);
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
    }
  };

  // Función para calcular el total del carrito
  const calcularTotal = () => {
    return itemsCarrito.reduce((total, item) => {
      return total + (item.precio * item.cantidad);
    }, 0);
  };

  // Función para obtener la cantidad total de productos
  const obtenerCantidadTotal = () => {
    return itemsCarrito.reduce((total, item) => total + item.cantidad, 0);
  };

  // Función para realizar pedido
  const realizarPedido = async (direccionEnvio) => {
    if (!usuarioActual || itemsCarrito.length === 0) {
      Alert.alert('Error', 'No hay productos en el carrito');
      return { success: false };
    }

    try {
      setCargandoCarrito(true);
      
      const pedido = {
        usuarioId: usuarioActual.uid,
        items: itemsCarrito,
        total: calcularTotal(),
        direccionEnvio: direccionEnvio,
        estado: 'pendiente',
        fechaPedido: new Date(),
        fechaEntrega: null
      };

      // Guardar pedido en Firestore
      const docRef = await addDoc(collection(db, 'pedidos'), pedido);
      
      // Limpiar carrito después del pedido exitoso
      await limpiarCarrito();
      
      Alert.alert(
        '¡Pedido realizado!', 
        `Tu pedido #${docRef.id.substring(0, 8)} ha sido enviado correctamente`
      );
      
      return { success: true, pedidoId: docRef.id };
    } catch (error) {
      console.error('Error al realizar pedido:', error);
      Alert.alert('Error', 'No se pudo realizar el pedido');
      return { success: false, error: error.message };
    } finally {
      setCargandoCarrito(false);
    }
  };

  // Función para guardar carrito en Firestore
  const guardarCarritoEnFirestore = async (items) => {
    if (!usuarioActual) return;
    
    try {
      const carritoRef = doc(db, 'carritos', usuarioActual.uid);
      await setDoc(carritoRef, {
        items: items,
        fechaActualizacion: new Date()
      });
    } catch (error) {
      console.error('Error al guardar carrito:', error);
    }
  };

  // Función para cargar carrito desde Firestore
  const cargarCarritoDesdeFirestore = async () => {
    if (!usuarioActual) {
      setItemsCarrito([]);
      return;
    }

    try {
      setCargandoCarrito(true);
      const carritoRef = doc(db, 'carritos', usuarioActual.uid);
      const carritoSnap = await getDoc(carritoRef);
      
      if (carritoSnap.exists()) {
        const data = carritoSnap.data();
        setItemsCarrito(data.items || []);
      } else {
        setItemsCarrito([]);
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      setItemsCarrito([]);
    } finally {
      setCargandoCarrito(false);
    }
  };

  // Efecto para cargar carrito cuando el usuario cambie
  useEffect(() => {
    cargarCarritoDesdeFirestore();
  }, [usuarioActual]);

  const valor = {
    itemsCarrito,
    cargandoCarrito,
    agregarAlCarrito,
    removerDelCarrito,
    actualizarCantidad,
    limpiarCarrito,
    calcularTotal,
    obtenerCantidadTotal,
    realizarPedido
  };

  return (
    <ContextoCarrito.Provider value={valor}>
      {children}
    </ContextoCarrito.Provider>
  );
};