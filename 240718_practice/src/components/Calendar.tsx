import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridPlugin from "@fullcalendar/daygrid"
import jaLocale from "@fullcalendar/core/locales/ja"
import { DatesSetArg, EventContentArg } from '@fullcalendar/core'
import "../calendar.css";
import { Balance, CalendarContent, Transaction } from '../types'
import { calculateDailyBalances } from '../utils/financeCalculations'
import { formatCurrency } from '../utils/formatting'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useTheme } from '@mui/material';
import { isSameMonth } from 'date-fns'


interface CalendarProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string,
  today: string
  onleDateClick: (dateInfo: DateClickArg) => void
}
const Calendar = ({
  monthlyTransactions, 
  setCurrentMonth,
  setCurrentDay,
  currentDay,
  today,
  onleDateClick
}: CalendarProps) => { 
  const theme = useTheme()
  const dailyBalances = calculateDailyBalances(monthlyTransactions) 
  console.log(dailyBalances)

  // FullCalendar用のイベントを生成する関数
  const createCalendarEvents = (dailyBalances: Record<string,Balance>):CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const {income, expense, balance} = dailyBalances[date]
return {
  start: date,
  income: formatCurrency(income),
  expense: formatCurrency(expense),
  balance: formatCurrency(balance),
}
    })
  };
  // FullCalendar用のイベントを生成する関数
  const calendarEvents = createCalendarEvents(dailyBalances)
  console.log(calendarEvents);

  const events = [
    { start: "2024-08-11", income: 500, expense: 200, balance: 300},
    { start: "2024-08-11", display: "background", backgroundColor: "red" },
  ]

  const backgroundEvent = {
    start: currentDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light,
  };

  console.log([...calendarEvents, backgroundEvent]);

  // カレンダーイベントの見た目を作る関数
  const renderEventContent = (eventInfo: EventContentArg) => {
    console.log(eventInfo);
    return(
      <div>
        <div className='money' id="event-income">
          {eventInfo.event.extendedProps.income}
        </div>

        <div className='money' id="event-expense">
          {eventInfo.event.extendedProps.expense}
        </div>

        <div className='money' id="event-balance">
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    )
  }

  // 月の日付取得
  const handleDateSet = (datesetInfo:DatesSetArg) => {
    const currentMonth = datesetInfo.view.currentStart; 
console.log();
setCurrentMonth(currentMonth);
const todayDate = new Date();
if(isSameMonth(todayDate, currentMonth)) {
  setCurrentDay(today);
}
};

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[...calendarEvents, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={onleDateClick}
    />
  )
}

export default Calendar
