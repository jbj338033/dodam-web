import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/api";
import { dodamAxios } from "../../libs/axios";

interface Banner {
  id: number;
  imageUrl: string;
  redirectUrl: string;
  title: string;
  status: "ACTIVE";
  expireAt: string;
}

interface BannerItemProps {
  banner: Banner;
}

const BannerItem = memo(({ banner }: BannerItemProps) => (
  <a
    href={banner.redirectUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="relative block h-48 overflow-hidden"
    aria-label={banner.title}
  >
    <img
      src={banner.imageUrl}
      alt={banner.title}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  </a>
));

BannerItem.displayName = "BannerItem";

const BannerSection = memo(() => {
  const { data: bannerData, isError } = useQuery<ApiResponse<Banner[]>>({
    queryKey: ["banner"],
    queryFn: async () => {
      const { data } = await dodamAxios.get(`banner/active`);
      return data;
    },
  });

  if (isError) {
    return null;
  }

  if (!bannerData?.data?.length) {
    return null;
  }

  return (
    <section aria-label="프로모션 배너">
      {bannerData.data.map((banner) => (
        <BannerItem key={banner.id} banner={banner} />
      ))}
    </section>
  );
});

BannerSection.displayName = "BannerSection";

export default BannerSection;
