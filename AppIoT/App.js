import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MQTTService from './src/services/mqttService';
import StatusModal from './src/components/StatusModal';
import LightControl from './src/components/LightControl'; 
import Gauges from './src/components/Gauges';
import HistoryModal from './src/components/HistoryModal'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

const mqtt = new MQTTService();

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showHistory, setShowHistory] = useState(false); 
  const [historico, setHistorico] = useState([]);
  const [isLightOn, setIsLightOn] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);

  const currentTemp = useRef(0);
  const currentHum = useRef(0);
  const currentLight = useRef(false);

  const mqttConfig = {
    host: process.env.EXPO_PUBLIC_MQTT_HOST,
    port: parseInt(process.env.EXPO_PUBLIC_MQTT_PORT),
    path: process.env.EXPO_PUBLIC_MQTT_PATH,
    user: process.env.EXPO_PUBLIC_MQTT_USER,
    pass: process.env.EXPO_PUBLIC_MQTT_PASS,
    clientId: 'RN_App_' + Math.random(),
  };

  const carregarHistorico = async () => {
    const dados = await AsyncStorage.getItem('@historico_geral');
    if (dados) setHistorico(JSON.parse(dados));
  };

  const salvarSnapshot = async (novaTemp, novaUmid, novaLuz) => {
    try {
      const registro = {
        id: Date.now().toString(),
        data: new Date().toLocaleString('pt-BR'),
        temp: novaTemp,
        hum: novaUmid,
        luz: novaLuz
      };

      const dadosAntigos = await AsyncStorage.getItem('@historico_geral');
      let arrayAtualizado = dadosAntigos ? JSON.parse(dadosAntigos) : [];
      
      arrayAtualizado.unshift(registro);
      
      if (arrayAtualizado.length > 15) arrayAtualizado.pop();

      await AsyncStorage.setItem('@historico_geral', JSON.stringify(arrayAtualizado));
      setHistorico(arrayAtualizado);
    } catch (e) {
      console.error("Erro ao salvar histórico", e);
    }
  };

  const startConnection = () => {
    setShowError(false);
    mqtt.connect(
      mqttConfig,
      (topic, message) => {
        if (topic === 'casa/temp') {
          const t = parseFloat(message);
          setTemp(t);
          currentTemp.current = t;
          salvarSnapshot(t, currentHum.current, currentLight.current);
        }
        if (topic === 'casa/umid') {
          const h = parseFloat(message);
          setHum(h);
          currentHum.current = h;
        }
        if (topic === 'casa/luz') {
          const l = message === "1";
          setIsLightOn(l);
          currentLight.current = l;
        }
      },
      () => {
        setIsConnected(true);
        mqtt.subscribe('casa/temp');
        mqtt.subscribe('casa/umid');
        mqtt.subscribe('casa/luz');
      },
      (err) => {
        setIsConnected(false);
        setShowError(true);
      }
    );
  };

  useEffect(() => {
    carregarHistorico();
    startConnection();
  }, []);

  const toggleLight = () => {
    const newState = isLightOn ? "0" : "1";
    mqtt.publish('casa/luz', newState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Smart Home IoT</Text>
      
      <LightControl isLightOn={isLightOn} onToggle={toggleLight} />
      <Gauges temp={temp} hum={hum} />

      <TouchableOpacity style={styles.btnHistorico} onPress={() => setShowHistory(true)}>
        <MaterialCommunityIcons name="history" size={24} color="#FFF" />
        <Text style={styles.btnHistoricoText}>Acessar Histórico</Text>
      </TouchableOpacity>

      <HistoryModal 
        visible={showHistory} 
        onClose={() => setShowHistory(false)} 
        data={historico} 
      />

      <StatusModal visible={showError} onRetry={startConnection} onLater={() => setShowError(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, alignItems: 'center' },
  header: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 20 },
  btnHistorico: { flexDirection: 'row', backgroundColor: '#333', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30, width: '100%', justifyContent: 'center' },
  btnHistoricoText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});