// src/context/QnaContext.jsx
import React, { createContext, useContext, useState } from "react";

const QnaContext = createContext();

export function QnaProvider({ children }) {
  const [submissions, setSubmissions] = useState([]);

  // 사용자 문의 추가
  const addSubmission = (submission) => {
    setSubmissions(prev => [
      { ...submission, id: prev.length + 1, answer: "답변 대기 중" },
      ...prev
    ]);
  };

  // 관리자 답변 추가
  const addAnswer = (id, answer) => {
    setSubmissions(prev =>
      prev.map(item => item.id === id ? { ...item, answer } : item)
    );
  };

  return (
    <QnaContext.Provider value={{ submissions, addSubmission, addAnswer }}>
      {children}
    </QnaContext.Provider>
  );
}

export function useQna() {
  return useContext(QnaContext);
}


