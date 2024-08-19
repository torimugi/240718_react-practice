import { Box } from '@mui/material'
import React, { useState } from 'react'
import MonthlySummary from '../components/MonthlySummary'
import Calendar from '../components/Calendar'
import TransactionMenu from '../components/TransactionMenu'
import TransactionForm from '../components/TransactionForm'
import { Transaction } from '../types'
import { format } from 'date-fns'
import { Schema } from '../validations/schema'

interface HomeProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  onDeleteTransaction: (transactionId: string) => Promise<void>;
  onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>
}

const Home = ({
  monthlyTransactions,
  setCurrentMonth, 
  onSaveTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
}: HomeProps) => {
  const today = format(new Date(), "yyyy-MM-dd");
  console.log(today);
  const[currentDay, setCurrentDay] = useState(today);
  const[isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  

  // 1日分のデータを取得
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  });
// console.log(dailyTransactions);

const closeForm = () => {
  setIsEntryDrawerOpen(!isEntryDrawerOpen);
  setSelectedTransaction(null);  
};

// フォームの開閉処理（「内訳追加ボタン」を押したとき）
const handleAddTransactionForm = () => {
  if (selectedTransaction) {
    setSelectedTransaction(null);  
  } else {
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
  }
};

// 取引が選択されたときの処理
const handleSelectTransaction = (transaction: Transaction) => {
  console.log(transaction);
  setIsEntryDrawerOpen(true);
  setSelectedTransaction(transaction);
}

  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
      <MonthlySummary monthlyTransactions={monthlyTransactions}/>
        <Calendar 
        monthlyTransactions={monthlyTransactions} 
        setCurrentMonth={setCurrentMonth}
        setCurrentDay={setCurrentDay}
        currentDay={currentDay}
        today={today}
        />
      </Box>
      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu 
        dailyTransactions={dailyTransactions}
        currentDay={currentDay}
        onAddTransactionForm={handleAddTransactionForm}
        onSelectTransaction={handleSelectTransaction}
        />
        <TransactionForm 
        onCloseForm={closeForm} 
        isEntryDrawerOpen={isEntryDrawerOpen}
        currentDay={currentDay}
        onSaveTransaction={onSaveTransaction}
        selectedTransaction={selectedTransaction}
        onDeleteTransaction={onDeleteTransaction}
        setSelectedTransaction={setSelectedTransaction}
        onUpdateTransaction={onUpdateTransaction}
        />
      </Box>
    </Box>
  )
}

export default Home