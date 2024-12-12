import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useTokenStore } from "../stores/token";

interface Client {
  clientId: string;
  clientName: string;
  clientUrl: string;
}

interface Stats {
  [key: string]: [number, string];
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface RegisterData {
  clientName: string;
  clientUrl: string;
  redirectUrl: string;
  frontEnd: string;
  backEnd: string;
}

const AuthServicePage = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useTokenStore();
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [formData, setFormData] = React.useState<RegisterData>({
    clientName: "",
    clientUrl: "",
    redirectUrl: "",
    frontEnd: "1",
    backEnd: "1",
  });

  const { data: randomClients } = useQuery<ApiResponse<Client[]>>({
    queryKey: ["random-clients"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_AUTH_URL}/client/random`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return data;
    },
    staleTime: 30 * 1000,
  });

  const { data: frontendStats } = useQuery<ApiResponse<Stats>>({
    queryKey: ["frontend-stats"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_AUTH_URL}/front-end`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: backendStats } = useQuery<ApiResponse<Stats>>({
    queryKey: ["backend-stats"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_AUTH_URL}/back-end`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: myServices } = useQuery<ApiResponse<Client[]>>({
    queryKey: ["my-services"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_AUTH_URL}/client/id`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return data;
    },
    staleTime: 30 * 1000,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_AUTH_URL}/client/register`,
        data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("서비스가 등록되었습니다");
      setIsRegistering(false);
      setFormData({
        clientName: "",
        clientUrl: "",
        redirectUrl: "",
        frontEnd: "1",
        backEnd: "1",
      });
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
    },
    onError: () => {
      toast.error("서비스 등록에 실패했습니다");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const response = await axios.delete(
        `${import.meta.env.VITE_AUTH_URL}/client/${clientId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("서비스가 삭제되었습니다");
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
    },
    onError: () => {
      toast.error("서비스 삭제에 실패했습니다");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Main Banner */}
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">도담도담 계정으로</h2>
            <p className="text-xl font-bold mb-4">
              여러분의 서비스를 이용해보세요
            </p>
            <a
              href={`${import.meta.env.VITE_AUTH_URL}/auth/docs`}
              className="inline-flex items-center px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-white/90 transition-colors"
            >
              더 알아보기
            </a>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex gap-8 items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">DAuth 사용자</h3>
                <div className="relative w-32 h-32">
                  <div className="w-full h-full rounded-full border-8 border-blue-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">
                      {randomClients?.data.length ?? 0}명
                    </span>
                  </div>
                </div>
              </div>
              {frontendStats?.data.react && (
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4">
                    프론트엔드 프레임워크
                  </h3>
                  <div className="relative w-32 h-32">
                    <div
                      className="w-full h-full rounded-full border-8"
                      style={{ borderColor: frontendStats.data.react[1] }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg">react</span>
                    </div>
                  </div>
                </div>
              )}
              {backendStats?.data.spring && (
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4">
                    백엔드 프레임워크
                  </h3>
                  <div className="relative w-32 h-32">
                    <div
                      className="w-full h-full rounded-full border-8"
                      style={{ borderColor: backendStats.data.spring[1] }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg">spring</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">DAuth 사용 서비스</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {randomClients?.data.map((client) => (
                <div
                  key={client.clientId}
                  className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 transition-colors"
                >
                  <h4 className="font-medium mb-2">{client.clientName}</h4>
                  <p className="text-sm text-slate-500 truncate">
                    {client.clientUrl}
                  </p>
                </div>
              ))}
            </div>

            {/* My Services */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">나의 서비스</h3>
                <button
                  onClick={() => setIsRegistering(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  type="button"
                >
                  서비스 등록
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myServices?.data.map((service) => (
                  <div
                    key={service.clientId}
                    className="p-4 border border-slate-200 rounded-xl relative group"
                  >
                    <button
                      onClick={() => deleteMutation.mutate(service.clientId)}
                      className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      type="button"
                      aria-label="서비스 삭제"
                    >
                      <FiX size={16} />
                    </button>
                    <h4 className="font-medium mb-2">{service.clientName}</h4>
                    <p className="text-sm text-slate-500 truncate">
                      {service.clientUrl}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Registration Modal */}
          {isRegistering && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">서비스 등록</h3>
                  <button
                    onClick={() => setIsRegistering(false)}
                    type="button"
                    aria-label="모달 닫기"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="서비스 이름"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        clientName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                    required
                  />
                  <input
                    type="url"
                    placeholder="서비스 URL"
                    value={formData.clientUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        clientUrl: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                    required
                  />
                  <input
                    type="url"
                    placeholder="리다이렉트 URL"
                    value={formData.redirectUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        redirectUrl: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                    required
                  />
                  <div className="flex gap-4">
                    <select
                      value={formData.frontEnd}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          frontEnd: e.target.value,
                        }))
                      }
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg"
                    >
                      <option value="1">React</option>
                      <option value="2">Vue</option>
                      <option value="3">Angular</option>
                    </select>
                    <select
                      value={formData.backEnd}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          backEnd: e.target.value,
                        }))
                      }
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg"
                    >
                      <option value="1">Spring</option>
                      <option value="2">Node.js</option>
                      <option value="3">Django</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {registerMutation.isPending ? "등록 중..." : "등록하기"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default AuthServicePage;
