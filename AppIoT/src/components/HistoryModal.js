import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HistoryModal({ visible, onClose, data }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Histórico ({data.length})</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {data.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum registro salvo ainda.</Text>
            ) : (
              data.map((item, index) => (
                <View key={item.id} style={styles.card}>
                  {/* Cabeçalho do Cartão: Data e Tag */}
                  <View style={styles.cardHeader}>
                    <View style={styles.dateRow}>
                      <MaterialCommunityIcons name="clock-outline" size={16} color="#AAA" />
                      <Text style={styles.dateText}>{item.data}</Text>
                    </View>
                    {index === 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>Mais recente</Text>
                      </View>
                    )}
                  </View>

                  {/* Informações dos Sensores */}
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="thermometer" size={20} color="#E74C3C" />
                    <Text style={[styles.infoText, { color: '#E74C3C' }]}>Temperatura: {item.temp}°C</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="water-percent" size={20} color="#1ABC9C" />
                    <Text style={[styles.infoText, { color: '#1ABC9C' }]}>Umidade: {item.hum}%</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="lightbulb" size={20} color="#F1C40F" />
                    <Text style={[styles.infoText, { color: '#F1C40F' }]}>Luz: {item.luz ? 'Ligada' : 'Desligada'}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#18181A', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '80%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  closeBtn: { padding: 5 },
  list: { flex: 1 },
  emptyText: { color: '#AAA', textAlign: 'center', marginTop: 30, fontSize: 16 },
  card: { backgroundColor: '#2A2A2D', borderRadius: 12, padding: 15, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { color: '#AAA', marginLeft: 8, fontSize: 14 },
  badge: { backgroundColor: 'rgba(39, 174, 96, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#2ECC71', fontSize: 12, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { marginLeft: 10, fontSize: 15, fontWeight: '500' },
});