import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 화면 높이 비율 계산
const { height: windowHeight } = Dimensions.get('window');

// 초기 품목 리스트
const INITIAL_ITEMS = [
  { id: 'water', name: 'WATER', qty: 0 },
  { id: 'soju', name: 'SOJU', qty: 0 },
  { id: 'smp', name: 'SMP', qty: 0 },
  { id: 'sml', name: 'SML', qty: 0 },
  { id: 'sma', name: 'SMA', qty: 0 },
  { id: 'coke', name: 'COKE', qty: 0 },
  { id: 'royal', name: 'ROYAL', qty: 0 },
  { id: 'sprite', name: 'SPRITE', qty: 0 },
  { id: 'letsbe', name: "LET'S BE", qty: 0 },
  { id: 'bacchus', name: 'BACCHUS', qty: 0 },
  { id: 'strawberry_milk', name: 'STRAWBERRY MILK', qty: 0 },
  { id: 'banana_milk', name: 'BANANA MILK', qty: 0 },
  { id: 'hwaggaesu_stick', name: 'HWAGGAESU STICK', qty: 0 },
  { id: 'hwaggaesu_drink', name: 'HWAGGAESU DRINK', qty: 0 },
  { id: 'ramyun', name: 'RAMYUN', qty: 0 },
  { id: 'cup_noodles', name: 'CUP NOODLES', qty: 0 },
  { id: 'esse_pop', name: 'ESSE POP', qty: 0 },
  { id: 'marlboro', name: 'MARLBORO', qty: 0 },
  { id: 'seaweed', name: 'SEAWEED', qty: 0 },
  { id: 'almond_chocolate', name: 'ALMOND CHOCOLATE', qty: 0 },
  { id: 'choco_ball', name: 'CHOCO BALL', qty: 0 },
  { id: 'goya_bar', name: 'GOYA BAR', qty: 0 },
  { id: 'peanut_small', name: 'PEANUT SMALL', qty: 0 },
  { id: 'peanut_large', name: 'PEANUT LARGE', qty: 0 },
  { id: 'mango_pudding', name: 'MANGO PUDDING', qty: 0 },
  { id: 'dried_mango', name: 'DRIED MANGO', qty: 0 },
  { id: 'banana_chip', name: 'BANANA CHIP', qty: 0 },
  { id: 'beef_jerky', name: 'BEEF JERKY', qty: 0 },
  { id: 'roasted_squid', name: 'ROASTED SQUID', qty: 0 },
  { id: 'dried_fish', name: 'DRIED FISH', qty: 0 },
  { id: 'sausage', name: 'SAUSAGE', qty: 0 },
  { id: 'maxim_coffee', name: 'MAXIM COFFEE', qty: 0 },
  { id: 'pringles', name: 'PRINGLES', qty: 0 },
  { id: 'noni_soap', name: 'NONI SOAP', qty: 0 },
  { id: 'tooth_set', name: 'TOOTH SET', qty: 0 },
  { id: 'swimsuit', name: 'SWIMSUIT', qty: 0 },
  { id: 'pocari_sweat', name: 'POCARI SWEAT', qty: 0 }
];

const MODES = ['재고', '입고', '출고'];

export default function App() {
  const [mode, setMode] = useState(MODES[0]);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [newItemName, setNewItemName] = useState('');

  // 앱 시작 시 저장된 items 불러오기
  useEffect(() => {
    const loadItems = async () => {
      try {
        const json = await AsyncStorage.getItem('items');
        if (json) setItems(JSON.parse(json));
      } catch (e) {
        console.error('Failed to load items', e);
      }
    };
    loadItems();
  }, []);

  // items가 변경될 때마다 저장
  useEffect(() => {
    AsyncStorage.setItem('items', JSON.stringify(items)).catch(e => console.error('Failed to save items', e));
  }, [items]);

  // 새 품목 추가
  const handleNewItem = () => {
    const trimmed = newItemName.trim().toUpperCase();
    if (!trimmed) return Alert.alert('입력 오류', '추가할 품목명을 입력하세요.');
    if (items.find(i => i.name === trimmed)) return Alert.alert('중복 오류', '이미 존재하는 품목입니다.');
    setItems([{ id: Date.now().toString(), name: trimmed, qty: 0 }, ...items]);
    setNewItemName('');
  };

  // 입고
  const handleAdd = () => {
    if (!name || isNaN(qty) || parseInt(qty) <= 0) return Alert.alert('입력 오류', '유효한 품목과 수량을 선택하세요.');
    const parsed = parseInt(qty);
    setItems(items.map(i => i.name === name ? { ...i, qty: i.qty + parsed } : i));
    setQty('');
  };

  // 출고
  const handleRemove = () => {
    if (!name || isNaN(qty) || parseInt(qty) <= 0) return Alert.alert('입력 오류', '유효한 품목과 수량을 선택하세요.');
    const parsed = parseInt(qty);
    const exist = items.find(i => i.name === name);
    if (!exist || parsed > exist.qty) return Alert.alert('오류', '출고 수량이 재고보다 많거나 품목이 없습니다.');
    setItems(items.map(i => i.name === name ? { ...i, qty: i.qty - parsed } : i));
    setQty('');
  };

  // 렌더 박스
  const renderInventoryBox = ({ item }) => (
    <View style={styles.invBox}>
      <Text style={styles.invName} numberOfLines={1} adjustsFontSizeToFit>{item.name}</Text>
      <Text style={styles.invQty}>{item.qty}</Text>
    </View>
  );
  const renderBox = ({ item }) => (
    <TouchableOpacity style={[styles.box, name === item.name && styles.boxActive]} onPress={() => setName(item.name)}>
      <Text style={[styles.boxText, name === item.name && styles.boxTextActive]} numberOfLines={1} adjustsFontSizeToFit>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 타이틀 */}
      <View style={styles.headerSpacer} />
      <Text style={styles.title}>하이클래스 풀빌라 미니바 재고관리</Text>
      {/* 탭 */}
      <View style={styles.tabs}>
        {MODES.map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, mode === tab && styles.tabActive]} onPress={() => { setMode(tab); setName(''); setQty(''); }}>
            <Text style={mode === tab ? styles.tabTextActive : styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 재고 탭 */}
      {mode === '재고' && (
        <View style={styles.section}>
          <View style={styles.newItemForm}>
            <TextInput style={styles.newItemInput} placeholder="새 품목명" value={newItemName} onChangeText={setNewItemName} />
            <Button title="추가" onPress={handleNewItem} />
          </View>
          <FlatList
            style={{ maxHeight: windowHeight * 0.6 }}
            data={items}
            keyExtractor={i => i.id}
            renderItem={renderInventoryBox}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.invContainer}
          />
        </View>
      )}

      {/* 입고/출고 탭 */}
      {(mode === '입고' || mode === '출고') && (
        <View style={styles.section}>
          <FlatList data={items} keyExtractor={i => i.id} renderItem={renderBox} style={[styles.boxList, { maxHeight: windowHeight * 0.4 }]} />
          <TextInput style={styles.input} placeholder="수량" value={qty} onChangeText={setQty} keyboardType="numeric" />
          <View style={styles.buttonWrapper}>
            <Button title={mode} onPress={mode === '입고' ? handleAdd : handleRemove} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20 },
  headerSpacer: { height: 40 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc' },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderColor: '#007AFF' },
  tabText: { color: '#555' },
  tabTextActive: { color: '#007AFF', fontWeight: 'bold' },
  section: { flex: 1, paddingHorizontal: 10 },
  newItemForm: { flexDirection: 'row', marginTop: 8, marginBottom: 12, alignItems: 'center' },
  newItemInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 6, marginRight: 8 },
  invContainer: { paddingBottom: 12 },
  invBox: { flex: 1, backgroundColor: '#f1f1f1', borderRadius: 8, padding: 12, margin: 4, alignItems: 'center' },
  invName: { fontSize: 14, fontWeight: '600' },
  invQty: { marginTop: 4, fontSize: 12, color: '#333' },
  columnWrapper: { justifyContent: 'space-between' },
  boxList: { marginBottom: 12 },
  box: { paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginBottom: 6, backgroundColor: '#f9f9f9' },
  boxActive: { backgroundColor: '#007AFF' },
  boxText: { color: '#555', fontSize: 14 },
  boxTextActive: { color: '#fff', fontSize: 14 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 6, marginBottom: 8 },
  buttonWrapper: { marginBottom: 12 }
});
