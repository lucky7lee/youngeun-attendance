import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Save, RotateCcw } from 'lucide-react';
import { db } from './firebase';
import { ref, onValue, set } from 'firebase/database';
import './App.css';

const initialData = [
  { id: 1, class: '기린', teachers: ['이선민', '정희조', ''], students: [{name:'베라엘', status:'none'}, {name:'신아율', status:'none'}, {name:'배지호', status:'none'}, {name:'류정환', status:'none'}, {name:'손은채A', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 2, class: '캥거루', teachers: ['강민혜', '최수정', ''], students: [{name:'강이주', status:'none'}, {name:'김라윤', status:'none'}, {name:'심지우', status:'none'}, {name:'육이서', status:'none'}, {name:'이시안', status:'none'}, {name:'이지안', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 3, class: '다람쥐', teachers: ['이은경', '여인영', ''], students: [{name:'김한율', status:'none'}, {name:'이라엘', status:'none'}, {name:'김준영', status:'none'}, {name:'최승우', status:'none'}, {name:'김하연', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 4, class: '딸기', teachers: ['최안진', '김지훈', ''], students: [{name:'임시온', status:'none'}, {name:'최인나', status:'none'}, {name:'최지호', status:'none'}, {name:'이은석', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 5, class: '별님', teachers: ['추서연', '허재숙', ''], students: [{name:'박결', status:'none'}, {name:'이도경', status:'none'}, {name:'유이서', status:'none'}, {name:'안리아', status:'none'}, {name:'이로운', status:'none'}, {name:'윤세아', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 6, class: '병아리', teachers: ['곽채린', '권정숙', ''], students: [{name:'왕예나', status:'none'}, {name:'왕예준', status:'none'}, {name:'이재이', status:'none'}, {name:'신세아', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 7, class: '사과', teachers: ['정현희', '공호범', ''], students: [{name:'권도윤', status:'none'}, {name:'노시온', status:'none'}, {name:'심지민', status:'none'}, {name:'천우진', status:'none'}, {name:'권지안', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 8, class: '코알라', teachers: ['이민주', '전교훈', ''], students: [{name:'위수지', status:'none'}, {name:'권도겸', status:'none'}, {name:'강건하', status:'none'}, {name:'조이안', status:'none'}, {name:'유지호', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 9, class: '토끼', teachers: ['김나연', '이미주', ''], students: [{name:'배서은', status:'none'}, {name:'이주희', status:'none'}, {name:'박시윤', status:'none'}, {name:'양휘담', status:'none'}, {name:'김리한', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 10, class: '햇님', teachers: ['이영은', '김현준', ''], students: [{name:'이동윤', status:'none'}, {name:'변주원', status:'none'}, {name:'김체아', status:'none'}, {name:'신예서', status:'none'}, {name:'김우주', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 11, class: '사자', teachers: ['이윤종', '방승은', ''], students: [{name:'양민혁', status:'none'}, {name:'박진우', status:'none'}, {name:'장은설', status:'none'}, {name:'손유진', status:'none'}, {name:'박시우', status:'none'}, {name:'김하성', status:'none'}, {name:'손은체B', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 12, class: '호랑이', teachers: ['백승현', '정예림', ''], students: [{name:'윤하랑', status:'none'}, {name:'전유준', status:'none'}, {name:'김아린', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 13, class: '사슴', teachers: ['이채연', '황민철', ''], students: [{name:'이도이', status:'none'}, {name:'여로운', status:'none'}, {name:'오승아', status:'none'}, {name:'오승우', status:'none'}, {name:'김주안', status:'none'}, {name:'임주희', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 14, class: '새친구', teachers: ['석지훈', '', ''], students: [{name:'송하준', status:'none'}, {name:'이해랑', status:'none'}, {name:'김지안', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}, {name:'', status:'none'}] },
  { id: 15, class: '', teachers: ['', '', ''], students: Array(9).fill({name:'', status:'none'}) },
  { id: 16, class: '', teachers: ['', '', ''], students: Array(9).fill({name:'', status:'none'}) },
  { id: 17, class: '', teachers: ['', '', ''], students: Array(9).fill({name:'', status:'none'}) },
  { id: 18, class: '', teachers: ['', '', ''], students: Array(9).fill({name:'', status:'none'}) },
];

function App() {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [activePopup, setActivePopup] = useState(null); // { rowId, colId }
  const [loading, setLoading] = useState(true);

  const popupRef = useRef(null);

  useEffect(() => {
    if (!db) {
      console.warn("Firebase is not connected. Using local state.");
      setLoading(false);
      return;
    }

    const dataRef = ref(db, 'attendance');
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const fbData = snapshot.val();
      if (fbData) {
        setData(fbData);
      } else {
        // Init if empty
        set(ref(db, 'attendance'), initialData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveToFirebase = (newData) => {
    if (db) {
      set(ref(db, 'attendance'), newData);
    } else {
      setData(newData); // fallback to local state update if no DB
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReset = () => {
    if(window.confirm('모든 출석 상태 색상을 원래대로 되돌리시겠습니까? 학생 명단은 유지됩니다.')) {
      const newData = data.map(row => ({
        ...row,
        students: row.students.map(s => ({ ...s, status: 'none' }))
      }));
      saveToFirebase(newData);
    }
  };

  const updateCell = (rowId, field, value, index = null) => {
    const newData = [...data];
    const rowIndex = newData.findIndex(r => r.id === rowId);
    
    // Deep clone the row to avoid mutating state directly
    const row = { ...newData[rowIndex] };
    
    if (field === 'class') {
      row.class = value;
    } else if (field === 'teachers') {
      row.teachers = [...row.teachers];
      row.teachers[index] = value;
    } else if (field === 'studentName') {
      row.students = [...row.students];
      row.students[index] = { ...row.students[index], name: value };
    }
    
    newData[rowIndex] = row;
    saveToFirebase(newData);
  };

  const updateStatus = (rowId, colId, status) => {
    const newData = [...data];
    const rowIndex = newData.findIndex(r => r.id === rowId);
    
    const row = { ...newData[rowIndex] };
    row.students = [...row.students];
    row.students[colId] = { ...row.students[colId], status: status };
    
    newData[rowIndex] = row;
    saveToFirebase(newData);
    setActivePopup(null);
  };

  const onCellClick = (rowId, colId, e) => {
    if (isEditing) return;
    
    const row = data.find(r => r.id === rowId);
    if (!row.students[colId].name.trim()) return;

    if (activePopup && activePopup.rowId === rowId && activePopup.colId === colId) {
      setActivePopup(null);
    } else {
      setActivePopup({ rowId, colId });
    }
  };

  const getRowStats = (row) => {
    const validStudents = row.students.filter(s => s.name.trim() !== '');
    const attendance = validStudents.filter(s => s.status === 'onsite' || s.status === 'online').length;
    const total = validStudents.length;
    return { attendance, total };
  };

  const getGlobalStats = () => {
    let onsite = 0;
    let online = 0;
    let total = 0;

    data.forEach(row => {
      row.students.forEach(s => {
        if (s.name.trim() !== '') {
          total++;
          if (s.status === 'onsite') onsite++;
          else if (s.status === 'online') online++;
        }
      });
    });

    return { onsite, online, total };
  };

  const globalStats = getGlobalStats();

  if (loading) {
    return <div style={{padding: '2rem', textAlign: 'center'}}>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="title">영은교회 유아부 출석부</h1>
        <div className="controls">
          <button 
            className="btn btn-danger" 
            onClick={handleReset}
          >
            <RotateCcw size={18} />
            리셋
          </button>
          <button 
            className={`btn ${isEditing ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <><Save size={18} /> 저장</> : <><Edit2 size={18} /> 수정</>}
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th rowSpan={2} style={{width: '7%'}}>반</th>
              <th colSpan={3} style={{width: '18%'}}>담임</th>
              <th colSpan={9}>유아부 유아 명단</th>
              <th rowSpan={2} style={{width: '6%'}}>유아출석</th>
              <th rowSpan={2} style={{width: '6%'}}>유아재적</th>
            </tr>
            <tr>
              <th style={{borderTop: 'none', height: '0', padding: '0'}}></th>
              <th style={{borderTop: 'none', height: '0', padding: '0'}}></th>
              <th style={{borderTop: 'none', height: '0', padding: '0'}}></th>
              <th style={{width: '7%'}}>1</th>
              <th style={{width: '7%'}}>2</th>
              <th style={{width: '7%'}}>3</th>
              <th style={{width: '7%'}}>4</th>
              <th style={{width: '7%'}}>5</th>
              <th style={{width: '7%'}}>6</th>
              <th style={{width: '7%'}}>7</th>
              <th style={{width: '7%'}}>8</th>
              <th style={{width: '7%'}}>9</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const { attendance, total } = getRowStats(row);
              return (
                <tr key={row.id}>
                  <td className="cell-class class-bg-pink">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="edit-input" 
                        value={row.class} 
                        onChange={(e) => updateCell(row.id, 'class', e.target.value)} 
                      />
                    ) : row.class}
                  </td>
                  
                  <td className="cell-teacher teacher-bg-green">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="edit-input" 
                        value={row.teachers[0]} 
                        onChange={(e) => updateCell(row.id, 'teachers', e.target.value, 0)} 
                      />
                    ) : row.teachers[0]}
                  </td>
                  <td className="cell-teacher teacher-bg-green">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="edit-input" 
                        value={row.teachers[1]} 
                        onChange={(e) => updateCell(row.id, 'teachers', e.target.value, 1)} 
                      />
                    ) : row.teachers[1]}
                  </td>
                  <td className="cell-teacher teacher-bg-green">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="edit-input" 
                        value={row.teachers[2]} 
                        onChange={(e) => updateCell(row.id, 'teachers', e.target.value, 2)} 
                      />
                    ) : row.teachers[2]}
                  </td>

                  {row.students.map((student, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={`cell-student ${!isEditing && student.name ? 'status-' + student.status : ''}`}
                      onClick={(e) => onCellClick(row.id, colIdx, e)}
                    >
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="edit-input" 
                          value={student.name} 
                          onChange={(e) => updateCell(row.id, 'studentName', e.target.value, colIdx)} 
                        />
                      ) : student.name}

                      {/* Popup Menu */}
                      {activePopup && activePopup.rowId === row.id && activePopup.colId === colIdx && (
                        <div className="status-menu" ref={popupRef}>
                          <button 
                            className="status-btn status-btn-onsite" 
                            onClick={(e) => { e.stopPropagation(); updateStatus(row.id, colIdx, 'onsite'); }}
                          >
                            현장예배
                          </button>
                          <button 
                            className="status-btn status-btn-online" 
                            onClick={(e) => { e.stopPropagation(); updateStatus(row.id, colIdx, 'online'); }}
                          >
                            온라인예배
                          </button>
                          <button 
                            className="status-btn status-btn-clear" 
                            onClick={(e) => { e.stopPropagation(); updateStatus(row.id, colIdx, 'none'); }}
                          >
                            초기화
                          </button>
                        </div>
                      )}
                    </td>
                  ))}
                  
                  <td style={{fontWeight: 'bold', color: attendance > 0 ? 'var(--primary)' : 'inherit'}}>
                    {attendance || ''}
                  </td>
                  <td style={{fontWeight: 'bold'}}>
                    {total || ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="summary-container">
        <div className="summary-table">
          <div className="summary-row">
            <div className="summary-label">현장예배</div>
            <div className="summary-value" style={{color: '#CA8A04'}}>{globalStats.onsite}</div>
          </div>
          <div className="summary-row">
            <div className="summary-label">온라인예배</div>
            <div className="summary-value" style={{color: '#2563EB'}}>{globalStats.online}</div>
          </div>
          <div className="summary-row">
            <div className="summary-label">총출석</div>
            <div className="summary-value" style={{color: 'var(--primary)'}}>{globalStats.onsite + globalStats.online}</div>
          </div>
          <div className="summary-row">
            <div className="summary-label">재적</div>
            <div className="summary-value" style={{color: 'var(--text-main)'}}>{globalStats.total}</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
