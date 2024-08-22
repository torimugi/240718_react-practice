import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Transaction } from "../types";
import { calculateDailyBalances } from "../utils/financeCalculations";
import { Box, Typography, useTheme } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

const BarChart = ({monthlyTransactions, isLoading}: BarChartProps) => {
  const theme = useTheme()
const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    maintainAspectRatio: false,
    // legend: {
    //   position: "top" as const,
    // },
    title: {
      display: true,
      text: "日別収支",
    },
  },
};

const dailyBalances = calculateDailyBalances(monthlyTransactions);
console.log(dailyBalances);
console.log(monthlyTransactions);

const dateLabels = Object.keys(dailyBalances).sort();
console.log(dateLabels);
const expenseData = dateLabels.map((day) => dailyBalances[day].expense);
const incomeData = dateLabels.map((day) => dailyBalances[day].income);

const data :ChartData<"bar"> = {
  labels: dateLabels,
  datasets: [
    {
      label: '支出',
      data: expenseData,
      backgroundColor: theme.palette.expenseColor.light,
    },
    {
      label: '収入',
      data: incomeData,
      backgroundColor: theme.palette.incomeColor.light,
    },
  ],
};

return (
  <Box sx={{ 
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  }}>
  {isLoading ? (
    <CircularProgress />
  ) : monthlyTransactions.length > 0 ?(
    <Bar options={options} data={data} />
  ) : (
    <Typography>データがありません</Typography>
  )}
  </Box>
);
};


export default BarChart;