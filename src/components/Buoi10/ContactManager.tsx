//components/Buoi10/ContactManager.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from 'react-native';

type contact = {
  id: number;
  name: string;
  number: string;
};

const contactManager = () => {
  const [contacts, setContacts] = useState<contact[]>([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'alphabet'>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchName, setSearchName] = useState('');

  const handleAddOrUpdate = () => {
    if (!name || !number) return;

    const contactData: contact = {
      id: editingId ?? Date.now(),
      name,
      number,
    };

    if (editingId !== null) {
      setContacts(prev => prev.map(s => (s.id === editingId ? contactData : s)));
    } else {
      setContacts(prev => [...prev, contactData]);
    }

    resetForm();
  };

  const handleEdit = (id: number) => {
    const contact = contacts.find(s => s.id === id);
    if (contact) {
      setName(contact.name);
      setNumber(contact.number.toString());
      setEditingId(contact.id);
    }
  };

  const handleDelete = (id: number) => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
  
    Alert.alert(
      'Xác nhận xóa', `Xác nhận xóa liên hệ [${contact.name}] ra khỏi danh bạ. Nếu bạn đồng ý, việc xóa sẽ không được hoàn tác.`,
      [
        { text: 'HỦY', style: 'cancel' },
        {
          text: 'XÓA',
          style: 'destructive',
          onPress: () => {
            setContacts(prev => prev.filter(s => s.id !== id));
          },
        },
      ],
      { cancelable: true }
    );
  };
  

  const resetForm = () => {
    setName('');
    setNumber('');
    setEditingId(null);
  };

  const applyFilter = () => {
    let result = [...contacts];

    switch (filterType) {
      case 'alphabet':
        return result.sort((a, b) => {
          const nameA = a.name.trim().split(' ').slice(-1)[0].toLowerCase();
          const nameB = b.name.trim().split(' ').slice(-1)[0].toLowerCase();
          return nameA.localeCompare(nameB);
        });
      case 'all':
      default:
        return result;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DANH BẠ</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số Điện Thoại"
        value={number}
        onChangeText={setNumber}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>
          {editingId !== null ? 'Cập nhật danh bạ' : 'Thêm'}
        </Text>
      </TouchableOpacity>

      {/* Bộ lọc */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#28a745' }]}
        onPress={() => setShowFilterModal(true)}
      >
        <Text style={styles.buttonText}>🔽 Bộ lọc: {
          {
            all: 'Tất cả',
            alphabet: 'Theo tên A-Z',
          }[filterType]
        }</Text>
      </TouchableOpacity>

      {/* Modal chọn lọc */}
      <Modal visible={showFilterModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.modalContent}>
            {[
              { label: 'Tất cả', value: 'all' },
              { label: 'Sắp xếp theo tên (A-Z)', value: 'alphabet' },
            ].map(f => (
              <TouchableOpacity key={f.value} style={styles.option} onPress={() => {
                setFilterType(f.value as any);
                setShowFilterModal(false);
              }}>
                <Text>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm..."
        value={searchName}
        onChangeText={setSearchName}
      />
      <ScrollView style={{ marginBottom: 10 }}>
      {applyFilter()
        .filter(s => s.name.toLowerCase().includes(searchName.toLowerCase()))
        .map(contact => (
          <View key={contact.id} style={styles.card}>
            <View style={styles.ContactText}>
              <View><Text style={styles.Icon}>💬</Text></View>
              <View style={styles.TwoText}>
                <View><Text style={styles.Name}>{contact.name}</Text></View>
                <View><Text style={styles.Number}>{contact.number}</Text></View>
              </View>
            </View>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => handleEdit(contact.id)}>
                <Text style={styles.icon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(contact.id)}>
                <Text style={styles.icon}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default contactManager;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: -15,
    color: '#d0489e',
  },
  input: {
    height: 57,
    borderWidth: 2,
    borderColor: '#e9a7c8',
    borderRadius: 11,
    marginBottom: 8,
    paddingHorizontal: 10,
    backgroundColor: '#ffe4e1',
  },
  button: {
    backgroundColor: '#c71585',
    padding: 10,
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  card: {
    padding: 10,
    borderRadius: 24,
    marginBottom: 6,
    backgroundColor: '#fff0f5',
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: -30,
    marginBottom: 10,
    gap: 12,
    marginLeft: 300,
  },
  icon: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 12,
    borderRadius: 8,
    elevation: 5,
  },
  option: {
    paddingVertical: 8,
  },
  ContactText: {
    flexDirection: 'row',
  },
  Icon: {
    fontSize: 32,
  },
  TwoText: {
    marginLeft: 10,
  },
  Name: {
    fontSize: 19,
    color: '#cd2f92',
    fontWeight: 'bold',
  },
  Number: {
    color: 'black',
  },
});