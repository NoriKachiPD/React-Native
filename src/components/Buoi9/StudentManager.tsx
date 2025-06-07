import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from 'react-native';

type Student = {
  id: number;
  code: string;
  name: string;
  age: number;
  grade: number;
};

const StudentManager = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'age' | 'grade' | 'gradeDesc' | 'alphabet' | 'codeAsc'>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchCode, setSearchCode] = useState('');

  const handleAddOrUpdate = () => {
    if (!code || !name || !age || !grade) return;

    const studentData: Student = {
      id: editingId ?? Date.now(),
      code: code.trim(),
      name,
      age: parseInt(age),
      grade: parseFloat(grade),
    };

    if (editingId !== null) {
      setStudents(prev => prev.map(s => (s.id === editingId ? studentData : s)));
    } else {
      setStudents(prev => [...prev, studentData]);
    }

    resetForm();
  };

  const handleEdit = (id: number) => {
    const student = students.find(s => s.id === id);
    if (student) {
      setCode(student.code);
      setName(student.name);
      setAge(student.age.toString());
      setGrade(student.grade.toString());
      setEditingId(student.id);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Xác nhận xóa', 'Xác nhận xóa sinh viên ra khỏi danh sách. Nếu bạn đồng ý, việc xóa sẽ không được hoàn tác.',
      [
        { text: 'HỦY', style: 'cancel' },
        {
          text: 'XÓA',
          style: 'destructive',
          onPress: () => {
            setStudents(prev => prev.filter(s => s.id !== id));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const resetForm = () => {
    setCode('');
    setName('');
    setAge('');
    setGrade('');
    setEditingId(null);
  };

  const sortByStudentCode = (list: Student[]) => {
    return [...list].sort((a, b) => {
      const parseKey = (code: string): [number, string] => {
        const match = code.match(/^(\d+)|([a-zA-Z]+)/);
        if (!match) return [Infinity, code]; // fallback
  
        if (match[1]) {
          return [parseInt(match[1]), code];
        } else {
          return [Infinity, code];
        }
      };
  
      const [aNum, aCode] = parseKey(a.code);
      const [bNum, bCode] = parseKey(b.code);
  
      if (aNum !== bNum) {
        return aNum - bNum; // số nhỏ lên trước
      }
  
      return aCode.localeCompare(bCode); // nếu số giống nhau thì so sánh theo chuỗi
    });
  };

  const applyFilter = () => {
    let result = [...students];

    switch (filterType) {
      case 'age':
        return result.filter(s => s.age > 18);
      case 'grade':
        return result.filter(s => s.grade >= 8);
      case 'gradeDesc':
        return result.sort((a, b) => b.grade - a.grade);
      case 'alphabet':
        return result.sort((a, b) => {
          const nameA = a.name.trim().split(' ').slice(-1)[0].toLowerCase();
          const nameB = b.name.trim().split(' ').slice(-1)[0].toLowerCase();
          return nameA.localeCompare(nameB);
        });
      case 'codeAsc':
        return sortByStudentCode(result);
      case 'all':
      default:
        return result;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Học Sinh</Text>
      <TextInput
        style={styles.input}
        placeholder="Mã sinh viên"
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Tên học sinh"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Tuổi"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Điểm"
        value={grade}
        onChangeText={setGrade}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>
          {editingId !== null ? 'Cập nhật học sinh' : 'Thêm học sinh'}
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
            age: 'Tuổi > 18',
            grade: 'Điểm > 8',
            gradeDesc: 'Theo điểm',
            alphabet: 'Theo tên A-Z',
            codeAsc: 'Theo mã SV ↑',
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
              { label: 'Tất cả học sinh', value: 'all' },
              { label: 'Tuổi > 18', value: 'age' },
              { label: 'Điểm > 8', value: 'grade' },
              { label: 'Sắp xếp theo điểm giảm dần', value: 'gradeDesc' },
              { label: 'Sắp xếp theo tên (A-Z)', value: 'alphabet' },
              { label: 'Sắp xếp theo mã SV tăng dần', value: 'codeAsc' },
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
        placeholder="🔍 Tìm theo mã sinh viên"
        value={searchCode}
        onChangeText={setSearchCode}
      />
      <Text style={styles.subTitle}>Danh sách học sinh:</Text>
      <ScrollView style={{ marginBottom: 10 }}>
      {applyFilter()
        .filter(s => s.code.toLowerCase().includes(searchCode.toLowerCase()))
        .map(student => (
          <View key={student.id} style={styles.card}>
            <Text>Mã: {student.code} | {student.name} | Tuổi: {student.age} | Điểm: {student.grade}</Text>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => handleEdit(student.id)}>
                <Text style={styles.icon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(student.id)}>
                <Text style={styles.icon}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default StudentManager;

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
  },
  subTitle: {
    fontWeight: 'bold',
    marginTop: -10,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 12,
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
});