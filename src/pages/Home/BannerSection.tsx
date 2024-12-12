import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../stores/token";
import axios from "axios";
import dayjs from "dayjs";
import { ApiResponse } from "../../types/api";

type Banner = {
  id: number;
  imageUrl: string;
  redirectUrl: string;
  title: string;
  status: "ACTIVE";
  expireAt: string;
};

const BannerSection = () => {
  const { accessToken } = useTokenStore();

  const { data: bannerData } = useQuery<ApiResponse<Banner[]>>({
    queryKey: ["banner"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/banner/active`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  return (
    <>
      {bannerData?.data?.map((banner) => (
        <a
          key={banner.id}
          href={banner.redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block bg-gradient-to-r from-blue-600 to-blue-700 h-48 overflow-hidden"
        >
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover mix-blend-overlay"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl font-bold mb-2">{banner.title}</h1>
              <p className="text-blue-100">
                {dayjs(banner.expireAt).format("YYYY.MM.DD")} 까지
              </p>
            </div>
          </div>
        </a>
      ))}
    </>
  );
};

export default BannerSection;
