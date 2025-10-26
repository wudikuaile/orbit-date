import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, addWeeks, subWeeks, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewMode = "month" | "week";

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const navigatePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "EEE";
    const rows = [];
    const days = [];
    let day = startDate;

    // Header row with day names
    const daysHeader = [];
    for (let i = 0; i < 7; i++) {
      daysHeader.push(
        <div key={i} className="text-center py-3 text-sm font-semibold text-muted-foreground border-b border-border">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    // Date cells
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;

        days.push(
          <button
            key={day.toString()}
            className={cn(
              "relative p-2 text-sm transition-all duration-200",
              "hover:bg-[hsl(var(--calendar-hover))] rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              !isCurrentMonth && "text-muted-foreground/40",
              isWeekend && isCurrentMonth && "text-[hsl(var(--calendar-weekend))]",
              isToday && "font-bold text-[hsl(var(--calendar-today))]",
              isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className="flex items-center justify-center h-8">
              {formattedDate}
            </span>
            {isToday && !isSelected && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[hsl(var(--calendar-today))]" />
            )}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days.splice(0, 7)}
        </div>
      );
    }

    return (
      <div className="animate-in fade-in duration-200">
        <div className="grid grid-cols-7 mb-1">{daysHeader}</div>
        <div className="space-y-1">{rows}</div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const isToday = isSameDay(day, new Date());
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;

      days.push(
        <div key={i} className="flex flex-col border-r border-border last:border-r-0">
          <button
            onClick={() => setSelectedDate(day)}
            className={cn(
              "flex flex-col items-center p-3 border-b border-border transition-all duration-200",
              "hover:bg-[hsl(var(--calendar-hover))]",
              isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <span className={cn(
              "text-xs font-medium mb-1",
              isWeekend && !isSelected && "text-[hsl(var(--calendar-weekend))]"
            )}>
              {format(day, "EEE")}
            </span>
            <span className={cn(
              "text-2xl font-semibold",
              isToday && !isSelected && "text-[hsl(var(--calendar-today))]"
            )}>
              {format(day, "d")}
            </span>
          </button>
          <div className="flex-1 p-4 min-h-[300px] md:min-h-[400px]">
            {/* Placeholder for events/content */}
            <div className="text-xs text-muted-foreground">
              {isToday && <span className="font-medium">Today</span>}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in duration-200">
        <div className="grid grid-cols-7 border-l border-border">{days}</div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      <div className="bg-card rounded-2xl shadow-[var(--shadow-medium)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {format(currentDate, "MMMM yyyy")}
                </h1>
                {viewMode === "week" && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {format(startOfWeek(currentDate), "MMM d")} - {format(endOfWeek(currentDate), "MMM d, yyyy")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToday}
                className="text-sm"
              >
                Today
              </Button>
              
              <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                <Button
                  variant={viewMode === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                  className="text-sm"
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                  className="text-sm"
                >
                  Week
                </Button>
              </div>

              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={navigatePrevious}
                  className="h-9 w-9"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={navigateNext}
                  className="h-9 w-9"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="p-4 md:p-6">
          {viewMode === "month" ? renderMonthView() : renderWeekView()}
        </div>
      </div>
    </div>
  );
};
