import React, { useState, useCallback, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
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

interface CarouselButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}

const CarouselButton = memo(
  ({ direction, onClick, disabled }: CarouselButtonProps) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 ${
        direction === "prev" ? "left-4" : "right-4"
      } z-10 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors disabled:opacity-50`}
      aria-label={direction === "prev" ? "이전 배너" : "다음 배너"}
    >
      {direction === "prev" ? (
        <FiChevronLeft className="w-6 h-6" />
      ) : (
        <FiChevronRight className="w-6 h-6" />
      )}
    </button>
  )
);

CarouselButton.displayName = "CarouselButton";

interface IndicatorsProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
}

const Indicators = memo(({ total, current, onChange }: IndicatorsProps) => (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
    {Array.from({ length: total }, (_, i) => (
      <button
        key={i}
        onClick={() => onChange(i)}
        className={`w-2 h-2 rounded-full transition-all ${
          i === current ? "bg-white w-4" : "bg-white/50 hover:bg-white/75"
        }`}
        aria-label={`${i + 1}번 배너로 이동`}
        aria-current={i === current ? "true" : undefined}
      />
    ))}
  </div>
));

Indicators.displayName = "Indicators";

interface BannerSlideProps {
  banner: Banner;
}

const BannerSlide = memo(({ banner }: BannerSlideProps) => (
  <a
    href={banner.redirectUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="relative w-screen h-full flex-shrink-0"
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

BannerSlide.displayName = "BannerSlide";

const BannerSection = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: bannerData, isError } = useQuery<ApiResponse<Banner[]>>({
    queryKey: ["banner"],
    queryFn: async () => {
      const { data } = await dodamAxios.get(`banner/active`);
      return data;
    },
  });

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? (bannerData?.data.length ?? 1) - 1 : prev - 1
    );
  }, [bannerData?.data.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === (bannerData?.data.length ?? 1) - 1 ? 0 : prev + 1
    );
  }, [bannerData?.data.length]);

  React.useEffect(() => {
    if (!bannerData?.data?.length) return;

    const timer = setInterval(() => {
      handleNext();
    }, 10000);

    return () => clearInterval(timer);
  }, [handleNext, bannerData?.data.length]);

  // 마우스 오버시 자동 슬라이드 중지
  const [isPaused, setIsPaused] = React.useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  React.useEffect(() => {
    if (!bannerData?.data?.length || isPaused) return;

    const timer = setInterval(handleNext, 10000);
    return () => clearInterval(timer);
  }, [handleNext, bannerData?.data?.length, isPaused]);

  if (isError || !bannerData?.data?.length) {
    return null;
  }

  return (
    <section
      className="relative h-48 overflow-hidden bg-slate-100"
      aria-label="프로모션 배너"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute flex transition-transform duration-500 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}vw)`,
            width: `${bannerData.data.length * 100}vw`,
          }}
        >
          {bannerData.data.map((banner) => (
            <BannerSlide key={banner.id} banner={banner} />
          ))}
        </div>
      </div>

      {bannerData.data.length > 1 && (
        <>
          <CarouselButton direction="prev" onClick={handlePrev} />
          <CarouselButton direction="next" onClick={handleNext} />
          <Indicators
            total={bannerData.data.length}
            current={currentIndex}
            onChange={setCurrentIndex}
          />
        </>
      )}
    </section>
  );
});

BannerSection.displayName = "BannerSection";

export default BannerSection;
