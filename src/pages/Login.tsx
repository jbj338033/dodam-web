import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useTokenStore } from "../stores/token";

interface LoginForm {
  id: string;
  pw: string;
}

interface ErrorResponse {
  status: number;
  message: string;
  code: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken } = useTokenStore();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      id: "",
      pw: "",
    },
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (credentials: LoginForm) => {
      const { data } = await axios.post(`auth/login`, credentials);
      return data;
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        toast.success("로그인되었습니다");
        navigate("/");
      }
    },
    onError: (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        toast.error("로그인에 실패했습니다");
        return;
      }

      const errorData: ErrorResponse = error.response?.data;

      if (errorData?.code === "WRONG_PASSWORD") {
        toast.error("비밀번호가 올바르지 않습니다");
      } else {
        toast.error(errorData?.message || "로그인에 실패했습니다");
      }
    },
  });

  const onSubmit = (data: LoginForm) => {
    login(data);
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden lg:block w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/10" />
        <img
          src="/students.jpeg"
          alt="Students"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <div className="max-w-lg">
            <h2 className="text-white text-4xl font-bold mb-4">도담도담</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              더 나은 학교를 위한 스마트 교육 플랫폼
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 py-12 bg-white">
        <div className="w-full max-w-[480px]">
          <div className="mb-12">
            <h1 className="text-[32px] font-bold text-neutral-800 tracking-tight">
              도담도담에 오신 것을
              <br />
              환영합니다
            </h1>
            <p className="mt-3 text-neutral-500">
              서비스 이용을 위해 로그인해주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-700">
                    아이디
                  </label>
                  {errors.id && (
                    <span className="text-sm text-red-500">
                      {errors.id.message}
                    </span>
                  )}
                </div>
                <input
                  {...register("id", { required: "아이디를 입력해주세요" })}
                  type="text"
                  className="w-full h-12 px-4 border border-neutral-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-neutral-800 text-base"
                  placeholder="아이디를 입력하세요"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-700">
                    비밀번호
                  </label>
                  {errors.pw && (
                    <span className="text-sm text-red-500">
                      {errors.pw.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    {...register("pw", { required: "비밀번호를 입력해주세요" })}
                    type={showPassword ? "text" : "password"}
                    className="w-full h-12 px-4 border border-neutral-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-neutral-800 text-base"
                    placeholder="비밀번호를 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-neutral-300 text-blue-500 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-neutral-600"
              >
                로그인 상태 유지
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-base font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                "로그인"
              )}
            </button>

            <div className="flex items-center gap-6 justify-center text-sm pt-2">
              <a
                href="/signup"
                className="text-neutral-600 hover:text-neutral-800"
              >
                회원가입
              </a>
              <a
                href="/forgot-password"
                className="text-neutral-600 hover:text-neutral-800"
              >
                비밀번호 찾기
              </a>
            </div>
          </form>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#333333",
            border: "1px solid #e2e8f0",
            padding: "12px 16px",
            fontSize: "14px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#4F46E5",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </div>
  );
};

export default LoginPage;
