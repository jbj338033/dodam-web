import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useTokenStore } from "../stores/token";

interface LoginForm {
  id: string;
  pw: string;
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

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (credentials: LoginForm) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        credentials
      );
      return data;
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        navigate("/dashboard");
      }
    },
  });

  const onSubmit = (data: LoginForm) => {
    login(data);
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Section - Image */}
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

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 py-12 bg-white">
        <div className="w-full max-w-[480px]">
          <div className="mb-14">
            <h1 className="text-3xl font-bold text-neutral-800">
              도담도담에 오신 것을
              <br />
              환영합니다
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <input
                {...register("id", { required: "아이디를 입력해주세요" })}
                type="text"
                placeholder="아이디"
                className="w-full h-14 px-5 text-base border-2 border-neutral-200 rounded-lg focus:border-blue-600 outline-none transition-colors"
              />
              {errors.id && (
                <p className="mt-2 text-sm text-red-500">{errors.id.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  {...register("pw", { required: "비밀번호를 입력해주세요" })}
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호"
                  className="w-full h-14 px-5 text-base border-2 border-neutral-200 rounded-lg focus:border-blue-600 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.pw && (
                <p className="mt-2 text-sm text-red-500">{errors.pw.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-5 h-5 rounded border-2 border-neutral-200 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="remember" className="ml-2 text-neutral-600">
                로그인 유지
              </label>
            </div>

            {error && (
              <div className="text-sm text-red-500 py-2">
                로그인에 실패했습니다. 다시 시도해주세요.
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                "로그인"
              )}
            </button>

            <div className="text-center">
              <span className="text-neutral-500">아직 계정이 없으신가요? </span>
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                회원가입
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
