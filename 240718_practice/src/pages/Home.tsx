import { Box, useMediaQuery, useTheme } from '@mui/material'
import React, { useMemo, useState } from 'react'
import MonthlySummary from '../components/MonthlySummary'
import Calendar from '../components/Calendar'
import TransactionMenu from '../components/TransactionMenu'
import TransactionForm from '../components/TransactionForm'
import { Transaction } from '../types'
import { format } from 'date-fns'
import { Schema } from '../validations/schema'
import { DateClickArg } from '@fullcalendar/interaction'

interface HomeProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  onDeleteTransaction: (transactionId: string | readonly string[]
    ) => Promise<void>;
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
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const[isDialogOpen, setIsDialogOpen] = useState(false);


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  console.log(isMobile);

  // 1日分のデータを取得
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  });
// console.log(dailyTransactions);

const closeForm = () => {
  setIsEntryDrawerOpen(!isEntryDrawerOpen);
  setSelectedTransaction(null);  

  if(isMobile) {
    setIsDialogOpen(!isDialogOpen);
  } else {
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
  }
};

// フォームの開閉処理（「内訳追加ボタン」を押したとき）
const handleAddTransactionForm = () => {
  if (isMobile) {
    setIsDialogOpen(true);
  } else {
    if (selectedTransaction) {
      setSelectedTransaction(null);  
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  }
};

// 取引が選択されたときの処理
const handleSelectTransaction = (transaction: Transaction) => {
  setSelectedTransaction(transaction);
   if (isMobile) {
    setIsDialogOpen(true);
  } else {
    setIsEntryDrawerOpen(true);
  }
};

// モバイル用Drowerを閉じる処理
const handleCloseMobileDrwer = () => {
  setIsMobileDrawerOpen(false);
 
};

// 日付を選択したときの処理
const handleDateClick = (dateInfo: DateClickArg) => {
  console.log(dateInfo);
  setCurrentDay(dateInfo.dateStr);
  setIsMobileDrawerOpen(true);
    };

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
        onleDateClick={handleDateClick}
        />
      </Box>
      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu 
        dailyTransactions={dailyTransactions}
        currentDay={currentDay}
        onAddTransactionForm={handleAddTransactionForm}
        onSelectTransaction={handleSelectTransaction}
        isMobile={isMobile}
        open={isMobileDrawerOpen}
        onClose={handleCloseMobileDrwer}
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
        isMobile={isMobile}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        />
      </Box>
    </Box>
  )
}

export default Home