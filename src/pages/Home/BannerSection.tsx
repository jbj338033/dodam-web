import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/api";
import { dodamAxios } from "../../libs/axios";

type Banner = {
  id: number;
  imageUrl: string;
  redirectUrl: string;
  title: string;
  status: "ACTIVE";
  expireAt: string;
};

const BannerSection = () => {
  const { data: bannerData } = useQuery<ApiResponse<Banner[]>>({
    queryKey: ["banner"],
    queryFn: async () => {
      const { data } = await dodamAxios.get(`banner/active`);
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
          className="relative block h-48 overflow-hidden"
        >
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
        </a>
      ))}
    </>
  );
};

export default BannerSection;
