import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AlarmIcon from "@mui/icons-material/Alarm";
import AddHomeIcon from "@mui/icons-material/AddHome";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";

import WorkIcon from "@mui/icons-material/Work";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import SavingsIcon  from "@mui/icons-material/Savings"; 

import { Controller, useForm } from "react-hook-form";
import { ExpenseCategory, IncomeCategory } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../validations/schema";

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string
}

type IncomeExpense = "income" | "expense";

interface CategoryItem {
  label: IncomeCategory | ExpenseCategory;
  icon: JSX.Element
}

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay
  }: TransactionFormProps) => {
  const formWidth = 320;

const expenseCategories: CategoryItem[] = [
{ label: "食費", icon: <FastfoodIcon fontSize="small" /> },
{ label: "日用品", icon: <AlarmIcon fontSize="small" /> },
{ label: "住居費", icon: <AddHomeIcon fontSize="small" /> },
{ label: "交際費", icon: <Diversity3Icon fontSize="small" /> },
{ label: "娯楽", icon: <SportsTennisIcon fontSize="small" /> },
{ label: "交通費", icon: <TrainIcon fontSize="small" /> },
];

const incomrCategories: CategoryItem[] = [
  { label: "給与", icon: <WorkIcon fontSize="small" /> },
  { label: "副収入", icon: <AddBusinessIcon fontSize="small" /> },
  { label: "お小遣い", icon: <SavingsIcon fontSize="small" /> },
  ]

  const [categories, setCategories] = useState(expenseCategories);
  const { control, setValue, watch, formState:{errors},
  handleSubmit,
 } = useForm({
    defaultValues: {
      type: "expense",
      date: currentDay,
amount: 0,
category: "",
content: "",
    },
    resolver: zodResolver(transactionSchema),
  });
  console.log(errors);


const incomeExpenseToggle = (type: IncomeExpense) => {
setValue("type", type);
};

// フォーム内のtypeフィールドの現在の値を監視
const currentType = watch("type");
console.log(currentType);

useEffect(() => {
const newCategories = currentType === "expense" ? expenseCategories : incomrCategories;
console.log(newCategories);
setCategories(newCategories);
},[currentType])

// currentDayが変更されたときにフォームの日付を更新
useEffect(() => {
  setValue("date", currentDay);
}, [currentDay]); // currentDayの変更を監視

const onSubmit = (data: any) => {
console.log(data);
}

  return (
    <Box
      sx={{
        position: "fixed",
        top: 64,
        right: isEntryDrawerOpen ? formWidth : "-2%", // フォームの位置を調整
        width: formWidth,
        height: "100%",
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.drawer - 1,
        transition: (theme) =>
          theme.transitions.create("right", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        p: 2, // 内部の余白
        boxSizing: "border-box", // ボーダーとパディングをwidthに含める
        boxShadow: "0px 0px 15px -5px #777777",
      }}
    >
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
        onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* フォーム要素 */}
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
          name="type"
          control={control}
          render={({ field: { value } }) => ( // fieldオブジェクトからvalueを直接展開
          <ButtonGroup fullWidth>
            <Button 
            variant={value === "expense" ? "contained" : "outlined"} 
            color="error" 
            onClick={() => incomeExpenseToggle("expense")}>
              支出
            </Button>
            <Button 
            onClick={() =>incomeExpenseToggle("income")}
            variant={value === "income" ? "contained" : "outlined"} 
            color={"primary"}
            >収入</Button>
          </ButtonGroup>
          )}
          />
          {/* 日付 */}
          <Controller
          name="date"
          control={control}
          render={({ field }) => (
          <TextField
          {...field}
            label="日付"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.date}
            helperText={errors.date?.message}
            />
            )}
          />
          
          {/* カテゴリ */}
          <Controller
          name="category"
          control={control}
          render={({field}) => (
              <TextField 
              error={!!errors.category}
              helperText={errors.category?.message}
            {...field} // fieldオブジェクトのプロパティをTextFieldに展開
            id="カテゴリ"
            label="カテゴリ" 
             select //select属性を設定してドロップダウンメニューを有効化
            >
              {categories.map((category, index) => (
               <MenuItem value={category.label} key={index}>
              <ListItemIcon>{category.icon}</ListItemIcon>
              {category.label}
            </MenuItem> 
                 ))}
            </TextField>
            )}
          />
          
            
          
          {/* 金額 */}
          <Controller
          name="amount"
          control={control}
          render={({field}) => {
            console.log(field);
            return (
            <TextField
            error={!!errors.amount}
            helperText={errors.amount?.message}
           {...field}
           value={field.value === 0 ? "" : field.value}
           onChange={(e) => {
            const newValue = parseInt(e.target.value, 10) || 0;
            field.onChange(newValue);
           }}
           label="金額" 
           type="number" />
           );
          }}
          />
          
          {/* 内容 */}
          <Controller
          name="content"
          control={control}
          render={({field}) => (
            <TextField 
            error={!!errors.content}
            helperText={errors.content?.message}
            {...field} label="内容" type="text" />
          )}
            />
          {/* 保存ボタン */}
          <Button type="submit" 
          variant="contained" 
          color={currentType === "income" ? "primary" : "error"} fullWidth>
            保存
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
export default TransactionForm;
