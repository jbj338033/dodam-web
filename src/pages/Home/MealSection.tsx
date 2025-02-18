import { useState, useEffect, useCallback, memo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
} from "react-icons/fi";
import { PiBowlFood, PiCoffee, PiHamburger } from "react-icons/pi";
import { ApiResponse } from "../../types/api";
import { dodamAxios } from "../../libs/axios";

interface MealDetail {
  name: string;
  allergies: number[];
}

interface MealTime {
  details: MealDetail[];
  calorie: number;
}

interface Meal {
  exists: boolean;
  date: string;
  breakfast: MealTime;
  lunch: MealTime;
  dinner: MealTime;
}

type MealType = "breakfast" | "lunch" | "dinner";

interface MealTypeConfig {
  type: MealType;
  label: string;
  icon: JSX.Element;
}

const MEAL_TYPES: MealTypeConfig[] = [
  { type: "breakfast", label: "아침", icon: <PiCoffee className="w-5 h-5" /> },
  { type: "lunch", label: "점심", icon: <PiHamburger className="w-5 h-5" /> },
  { type: "dinner", label: "저녁", icon: <PiBowlFood className="w-5 h-5" /> },
];

const getCurrentMealType = (): MealType => {
  const now = dayjs();
  const timeInMinutes = now.hour() * 60 + now.minute();

  if (timeInMinutes >= 460 && timeInMinutes <= 510) return "breakfast";
  if (timeInMinutes >= 750 && timeInMinutes <= 800) return "lunch";
  if (timeInMinutes >= 1100 && timeInMinutes <= 1150) return "dinner";
  if (timeInMinutes < 460) return "breakfast";
  if (timeInMinutes < 750) return "lunch";
  if (timeInMinutes < 1100) return "dinner";
  return "breakfast";
};

interface DateNavigatorProps {
  selectedDate: dayjs.Dayjs;
  onDateChange: (direction: "prev" | "next") => void;
}

const DateNavigator = memo(
  ({ selectedDate, onDateChange }: DateNavigatorProps) => {
    const isToday =
      selectedDate.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");

    return (
      <div className="flex items-center gap-1 text-sm">
        <button
          onClick={() => onDateChange("prev")}
          className="p-1.5 hover:bg-slate-50 rounded"
          aria-label="이전 날짜"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>
        <span
          className={`px-2 py-1 rounded ${isToday ? "bg-blue-50 text-blue-600" : ""}`}
        >
          {selectedDate.format("MM.DD")}
        </span>
        <button
          onClick={() => onDateChange("next")}
          className="p-1.5 hover:bg-slate-50 rounded"
          aria-label="다음 날짜"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }
);

DateNavigator.displayName = "DateNavigator";

interface MealContentProps {
  mealData?: MealTime;
  isLoading: boolean;
}

const MealContent = memo(({ mealData, isLoading }: MealContentProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-12">
        <FiLoader className="w-4 h-4 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!mealData?.details?.length) {
    return (
      <div className="text-slate-400 text-sm h-12 flex items-center">
        식사 정보가 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="text-sm leading-relaxed">
        {mealData.details.map((item, index) => (
          <span key={index}>
            {item.name}
            {index < mealData.details.length - 1 && ", "}
          </span>
        ))}
      </div>
      <div className="text-xs text-slate-500">
        {mealData.calorie.toFixed(1)}kcal
      </div>
    </div>
  );
});

MealContent.displayName = "MealContent";

interface MealItemProps {
  type: MealTypeConfig;
  mealData?: MealTime;
  isCurrentMeal: boolean;
  isLoading: boolean;
}

const MealItem = memo(
  ({ type, mealData, isCurrentMeal, isLoading }: MealItemProps) => (
    <div
      className={`flex gap-3 p-2 rounded ${isCurrentMeal ? "bg-blue-50" : ""}`}
    >
      <div className="w-20 flex items-center gap-1.5 text-slate-600">
        <span
          className={`${isCurrentMeal ? "text-blue-500" : "text-slate-400"}`}
        >
          {type.icon}
        </span>
        <span
          className={`text-sm ${isCurrentMeal ? "text-blue-600 font-medium" : ""}`}
        >
          {type.label}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <MealContent mealData={mealData} isLoading={isLoading} />
      </div>
    </div>
  )
);

MealItem.displayName = "MealItem";

const MealSection = memo(() => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const queryClient = useQueryClient();
  const currentMealType = getCurrentMealType();

  const fetchMealData = useCallback(async (date: dayjs.Dayjs) => {
    const { data } = await dodamAxios.get<ApiResponse<Meal>>(`meal`, {
      params: {
        year: date.year(),
        month: date.month() + 1,
        day: date.date(),
      },
    });
    return data;
  }, []);

  const { data: currentMealData, isLoading } = useQuery({
    queryKey: ["meal", selectedDate.format("YYYY-MM-DD")],
    queryFn: () => fetchMealData(selectedDate),
  });

  useEffect(() => {
    const prevDate = selectedDate.subtract(1, "day");
    const nextDate = selectedDate.add(1, "day");

    queryClient.prefetchQuery({
      queryKey: ["meal", prevDate.format("YYYY-MM-DD")],
      queryFn: () => fetchMealData(prevDate),
    });

    queryClient.prefetchQuery({
      queryKey: ["meal", nextDate.format("YYYY-MM-DD")],
      queryFn: () => fetchMealData(nextDate),
    });
  }, [selectedDate, queryClient, fetchMealData]);

  const handleDateChange = useCallback((direction: "prev" | "next") => {
    setSelectedDate((prev) =>
      direction === "prev" ? prev.subtract(1, "day") : prev.add(1, "day")
    );
  }, []);

  const isToday =
    selectedDate.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");

  return (
    <section className="bg-white border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold flex items-center gap-2">
          <FiCalendar className="text-blue-500" />
          식단
        </h2>
        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </div>

      <div className="space-y-3">
        {MEAL_TYPES.map((type) => (
          <MealItem
            key={type.type}
            type={type}
            mealData={currentMealData?.data?.[type.type]}
            isCurrentMeal={isToday && type.type === currentMealType}
            isLoading={isLoading}
          />
        ))}
      </div>
    </section>
  );
});

MealSection.displayName = "MealSection";

export default MealSection;
