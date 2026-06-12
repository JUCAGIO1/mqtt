import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Gauges({ temp, hum }) {
  return (
    <View style={styles.row}>
      <View style={[styles.gaugeBox, { borderTopColor: '#E74C3C' }]}>
        <Text style={[styles.value, { color: '#E74C3C' }]}>{temp}°C</Text>
        <Text style={styles.label}>Temperatura</Text>
      </View>
      <View style={[styles.gaugeBox, { borderTopColor: '#3498DB' }]}>
        <Text style={[styles.value, { color: '#3498DB' }]}>{hum}%</Text>
        <Text style={styles.label}>Umidade</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  gaugeBox: { backgroundColor: '#1E1E1E', paddingVertical: 25, paddingHorizontal: 15, borderRadius: 15, alignItems: 'center', width: '48%', borderTopWidth: 4 },
  value: { fontSize: 36, fontWeight: 'bold', color: '#FFF' },
  label: { color: '#AAA', marginTop: 8, fontSize: 14, fontWeight: '500' },
});