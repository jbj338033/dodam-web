import { WeeklyTop } from "./types";

interface WeeklyChampionsProps {
  weeklyTop: WeeklyTop[];
  onProfileClick: (githubId: string) => void;
}

const WeeklyChampions = ({
  weeklyTop,
  onProfileClick,
}: WeeklyChampionsProps) => (
  <div className="p-4 md:p-8 bg-gradient-to-br from-blue-500 to-blue-600">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
        🏆 이번 주 상위권
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weeklyTop.map((user, index) => (
          <div
            key={user.githubId}
            onClick={() => onProfileClick(user.githubId)}
            className={`
              relative cursor-pointer bg-white/10 backdrop-blur-md p-6 rounded-2xl
              border border-white/20 transition-transform hover:scale-[1.02]
              ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}
            `}
          >
            <div className="flex items-center gap-4">
              <img
                src={user.userImage}
                alt={user.name}
                className={`
                  rounded-full border-2 border-white/20
                  ${index === 0 ? "w-20 h-20" : "w-14 h-14"}
                `}
              />
              <div>
                <div className="text-white/80 text-sm">{index + 1}위</div>
                <h3
                  className={`font-bold text-white ${
                    index === 0 ? "text-xl" : "text-lg"
                  }`}
                >
                  {user.name}
                </h3>
                <p className="text-blue-100 text-sm">@{user.githubId}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-white/80 text-sm">우승 횟수</div>
              <div className="text-2xl font-bold text-white">
                {user.winCount}회
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default WeeklyChampions;
