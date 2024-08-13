import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridPlugin from "@fullcalendar/daygrid"
import jaLocale from "@fullcalendar/core/locales/ja"
import { DatesSetArg, EventContentArg } from '@fullcalendar/core'
import "../calendar.css";
import { Balance, CalendarContent, Transaction } from '../types'
import { calculateDailyBalances } from '../utils/financeCalculations'
import { formatCurrency } from '../utils/formatting'


interface CalendarProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}
const Calendar = ({monthlyTransactions, setCurrentMonth}: CalendarProps) => { 
  const dailyBalances = calculateDailyBalances(monthlyTransactions) // この行を先に移動
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
  }
  const calendarEvents = createCalendarEvents(dailyBalances)
  console.log(calendarEvents);

  const events = [
    { title: 'Meeting', start: "2024-08-11", income: 500, expense: 200, balance: 300},
    { title: 'aaa', start: "2024-08-20", income: 300, expense: 200, balance: 100},
  ]

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

  const handleDateSet = (datesetInfo:DatesSetArg) => {
console.log(datesetInfo);
setCurrentMonth(datesetInfo.view.currentStart)
  }

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={calendarEvents}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
    />
  )
}

export default Calendar
