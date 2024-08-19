import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme';
import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { Transaction } from './types/index';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { format } from 'date-fns';
import { formatMonth } from './utils/formatting';
import { Schema } from './validations/schema';

function App() {

  // Firestoreエラーかどうかを判定する型ガード
function isFireStoreError(err: unknown):err is {code: string, message: string} {
  return typeof err === "object" && err !== null && "code" in err
}

const [transactions, setTransactions] = useState<Transaction[]>([]);
const [currentMonth, setCurrentMonth] = useState((new Date()));


// firestoreのデータをすべて取得
  useEffect(() => {
    const fecheTransactions = async() => {
      try {
        const querySnapshot = await getDocs(collection(db, "Transactions"));
        console.log(querySnapshot);
        const transactionData = querySnapshot.docs.map((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction
        });
        setTransactions(transactionData)
        console.log(transactionData)
      } catch(err) {
        if(isFireStoreError(err)) {
          console.error("Firestoreのエラーは:",err)
        } else {
          console.error("一般的なエラーは:",err)
        }
        // error
      }
    }
    fecheTransactions();

  }, [])

  // ひと月分のデータのみ取得
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth))
  })

  // 取引を保存する処理
  const handleSaveTransaction = async(transaction: Schema) => {
    console.log(transaction);
    try {
// firestoreにデータを保存
// Add a new document with a generated id.
const docRef = await addDoc(collection(db, "Transactions"), transaction);
console.log("Document written with ID: ", docRef.id);

const newTransaction ={
 id: docRef.id,
 ...transaction
} as Transaction;
console.log(newTransaction);
setTransactions((prevTransaction) => [
  ...prevTransaction,
  newTransaction,
]);
    } catch(err) {
      if(isFireStoreError(err)) {
        console.error("Firestoreのエラーは:",err)
      } else {
        console.error("一般的なエラーは:",err)
      }
    }
  };

  // 削除処理
  const handleDeleteTransaction = async(
    transactionId: string
    ): Promise<void> => {
try {
// firastoreのデータを削除
await deleteDoc(doc(db, "Transactions", transactionId));
// フロントの更新処理
const filterdTransactions = transactions.filter(
  (transaction) => transaction.id !== transactionId);
console.log(filterdTransactions);
setTransactions(filterdTransactions)
} catch(err) {
  if(isFireStoreError(err)) {
    console.error("Firestoreのエラーは:",err)
  } else {
    console.error("一般的なエラーは:",err)
  }
}
};

// 更新処理
const handleUpdateTransaction = async(
  transaction: Schema, 
  transactionId: string) => {
  try {
// firestore更新処理
const docRef = doc(db, "Transactions", transactionId);

// Set the "capital" field of the city 'DC'
await updateDoc(docRef, transaction);
// フロント更新
const updatedTrandactions = transactions.map((t) => 
t.id === transactionId ? { ...t, ...transaction }  : t
) as Transaction[];
console.log(updatedTrandactions);
setTransactions(updatedTrandactions);
  } catch(err) {
    if(isFireStoreError(err)) {
      console.error("Firestoreのエラーは:",err)
    } else {
      console.error("一般的なエラーは:",err)
    }
  }
}

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
          <Route index element={
          <Home 
          monthlyTransactions={monthlyTransactions} 
          setCurrentMonth={setCurrentMonth}
          onSaveTransaction={handleSaveTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          />} 
          />
            <Route path="/report" element={<Report />} />
            <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
