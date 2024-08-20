
import { Grid, Paper } from '@mui/material'
import React from 'react'
import MonthSelector from '../components/MonthSelector';
import CategoryChart from '../components/CategoryChart';
import TransactionTable from '../components/TransactionTable';
import BarChart from '../components/BarChart';

interface ReportProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Report = ({ currentMonth, setCurrentMonth }: ReportProps) => {
  const commonPaperStyle = {
    height: { xs: "auto", md: "400px" },
    display: "flex",
    flexDirection: "column"
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {/* 日付選択エリア */}
        <MonthSelector 
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}/>
        </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={commonPaperStyle}>
          {/* 円グラフ */}
          <CategoryChart />
          </Paper>
        </Grid>
      <Grid item xs={12} md={8}>
        <Paper sx={commonPaperStyle}>
          {/* 棒グラフ */}
          <BarChart />
          </Paper>
        </Grid>
      <Grid item xs={12}>
        <TransactionTable />
        </Grid>
    </Grid>
  );
}

export default Report