import { useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../stores/token";
import axios from "axios";
import dayjs from "dayjs";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
} from "react-icons/fi";
import { PiBowlFood, PiCoffee, PiHamburger } from "react-icons/pi";
import { ApiResponse } from "../../types/api";

type MealType = "breakfast" | "lunch" | "dinner";

type MealDetail = {
  name: string;
  allergies: number[];
};

type MealTime = {
  details: MealDetail[];
  calorie: number;
};

type Meal = {
  exists: boolean;
  date: string;
  breakfast: MealTime;
  lunch: MealTime;
  dinner: MealTime;
};

const MEAL_TYPES: { type: MealType; label: string; icon: JSX.Element }[] = [
  {
    type: "breakfast",
    label: "아침",
    icon: <PiCoffee className="w-5 h-5" />,
  },
  {
    type: "lunch",
    label: "점심",
    icon: <PiHamburger className="w-5 h-5" />,
  },
  {
    type: "dinner",
    label: "저녁",
    icon: <PiBowlFood className="w-5 h-5" />,
  },
];

const MealSection = () => {
  const { accessToken } = useTokenStore();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const queryClient = useQueryClient();

  const fetchMealData = useCallback(
    async (date: dayjs.Dayjs) => {
      const { data } = await axios.get<ApiResponse<Meal>>(
        `${import.meta.env.VITE_API_URL}/meal`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            year: date.year(),
            month: date.month() + 1,
            day: date.date(),
          },
        }
      );
      return data;
    },
    [accessToken]
  );

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

  const renderMealContent = (mealType: MealType) => {
    const mealData = currentMealData?.data?.[mealType];

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
  };

  const handleDateChange = (direction: "prev" | "next") => {
    setSelectedDate((prev) =>
      direction === "prev" ? prev.subtract(1, "day") : prev.add(1, "day")
    );
  };

  const isToday =
    selectedDate.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");

  return (
    <div className="bg-white border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold flex items-center gap-2">
          <FiCalendar className="text-blue-500" />
          식단
        </h2>
        <div className="flex items-center gap-1 text-sm">
          <button
            onClick={() => handleDateChange("prev")}
            className="p-1.5 hover:bg-slate-50 rounded"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <span
            className={`px-2 py-1 rounded ${isToday ? "bg-blue-50 text-blue-600" : ""}`}
          >
            {selectedDate.format("MM.DD")}
          </span>
          <button
            onClick={() => handleDateChange("next")}
            className="p-1.5 hover:bg-slate-50 rounded"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {MEAL_TYPES.map(({ type, label, icon }) => (
          <div key={type} className="flex gap-3">
            <div className="w-20 flex items-center gap-1.5 text-slate-600">
              <span className="text-slate-400">{icon}</span>
              <span className="text-sm">{label}</span>
            </div>
            <div className="flex-1 min-w-0">{renderMealContent(type)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealSection;
