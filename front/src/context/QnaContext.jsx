import React, { createContext, useContext, useState, useEffect } from "react";

const QnaContext = createContext();

export function QnaProvider({ children }) {
  const [submissions, setSubmissions] = useState([]);

  // 로컬스토리지에서 불러오기
  useEffect(() => {
    const stored = localStorage.getItem("qnaSubmissions");
    if (stored) setSubmissions(JSON.parse(stored));
  }, []);

  // submissions 업데이트 시 로컬스토리지 저장
  useEffect(() => {
    localStorage.setItem("qnaSubmissions", JSON.stringify(submissions));
  }, [submissions]);

  const addSubmission = (submission) => {
    const newSubmission = { id: Date.now(), ...submission, answer: "" };
    setSubmissions([newSubmission, ...submissions]);
  };

  return (
    <QnaContext.Provider value={{ submissions, addSubmission }}>
      {children}
    </QnaContext.Provider>
  );
}

// 훅
export function useQna() {
  const context = useContext(QnaContext);
  if (!context) throw new Error("useQna must be used within QnaProvider");
  return context;
}


