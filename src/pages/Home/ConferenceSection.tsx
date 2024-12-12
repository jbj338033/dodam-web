import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../stores/token";
import axios from "axios";
import { FiCalendar, FiExternalLink } from "react-icons/fi";
import dayjs from "dayjs";
import { ApiResponse } from "../../types/api";

type Conference = {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  eventType: string;
  link: string;
};

const ConferenceSection = () => {
  const { accessToken } = useTokenStore();

  const { data: conferenceData } = useQuery<ApiResponse<Conference[]>>({
    queryKey: ["conference"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/conference`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  if (!conferenceData?.data?.length) return null;

  return (
    <div className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-3 flex items-center gap-2">
        <FiCalendar className="text-blue-500" />
        개발자 행사
      </h2>
      <div className="space-y-2">
        {conferenceData.data.map((conference, index) => (
          <a
            key={index}
            href={conference.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-3 rounded bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-start gap-2 mb-1">
              <h3 className="font-medium text-slate-900 group-hover:text-blue-500 flex-1 transition-colors">
                {conference.title}
              </h3>
              <FiExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors mt-1" />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
              <span>{conference.organization}</span>
              <span>{conference.eventType}</span>
              <span>
                {dayjs(conference.startDate).format("MM.DD")}
                {conference.endDate &&
                  conference.endDate !== conference.startDate &&
                  ` - ${dayjs(conference.endDate).format("MM.DD")}`}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ConferenceSection;
