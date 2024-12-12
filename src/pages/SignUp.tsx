import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface SignUpForm {
  id: string;
  pw: string;
  email: string;
  name: string;
  phone: string;
  role: "STUDENT";
  grade: number;
  room: number;
  number: number;
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: {
      id: "",
      pw: "",
      email: "",
      name: "",
      phone: "",
      role: "STUDENT",
      grade: 1,
      room: 1,
      number: 1,
    },
  });

  const { mutate: signup, isPending } = useMutation({
    mutationFn: async (data: SignUpForm) => {
      const { data: response } = await axios.post(
        `${import.meta.env.VITE_API_URL}/member/join-student`,
        data,
      );
      return response;
    },
    onSuccess: () => {
      toast.success("회원가입이 완료되었습니다");
      navigate("/login");
    },
    onError: (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        toast.error("회원가입에 실패했습니다");
        return;
      }
      toast.error(error.response?.data?.message || "회원가입에 실패했습니다");
    },
  });

  const onSubmit: SubmitHandler<SignUpForm> = (data) => {
    signup(data);
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

      {/* Right Section - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 py-12 bg-white">
        <div className="w-full max-w-[480px]">
          <div className="mb-12">
            <h1 className="text-[32px] font-bold text-neutral-800 tracking-tight">
              학생 회원가입
            </h1>
            <p className="mt-3 text-neutral-500">
              도담도담 서비스 이용을 위해 정보를 입력해주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              {/* Account Information */}
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
                    {...register("id", {
                      required: "아이디를 입력해주세요",
                      minLength: { value: 4, message: "4자 이상 입력해주세요" },
                    })}
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
                      {...register("pw", {
                        required: "비밀번호를 입력해주세요",
                        minLength: {
                          value: 8,
                          message: "8자 이상 입력해주세요",
                        },
                      })}
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

              {/* Personal Information */}
              <div className="pt-4 space-y-5">
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-700">
                      이메일
                    </label>
                    {errors.email && (
                      <span className="text-sm text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <input
                    {...register("email", {
                      required: "이메일을 입력해주세요",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "올바른 이메일 형식이 아닙니다",
                      },
                    })}
                    type="email"
                    className="w-full h-12 px-4 border border-neutral-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-neutral-800 text-base"
                    placeholder="example@dgsw.hs.kr"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-700">
                      이름
                    </label>
                    {errors.name && (
                      <span className="text-sm text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <input
                    {...register("name", { required: "이름을 입력해주세요" })}
                    type="text"
                    className="w-full h-12 px-4 border border-neutral-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-neutral-800 text-base"
                    placeholder="이름을 입력하세요"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-700">
                      전화번호
                    </label>
                    {errors.phone && (
                      <span className="text-sm text-red-500">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>
                  <input
                    {...register("phone", {
                      required: "전화번호를 입력해주세요",
                      pattern: {
                        value: /^[0-9]{10,11}$/,
                        message: "올바른 전화번호 형식이 아닙니다",
                      },
                    })}
                    type="tel"
                    className="w-full h-12 px-4 border border-neutral-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-neutral-800 text-base"
                    placeholder="'-' 없이 입력하세요"
                  />
                </div>
              </div>

              {/* Student Information */}
              <div className="pt-4 grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    학년
                  </label>
                  <select
                    {...register("grade", { required: true })}
                    className="w-full h-12 px-4 border border-neutral-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-neutral-800 text-base bg-white"
                  >
                    {[1, 2, 3].map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}학년
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    반
                  </label>
                  <select
                    {...register("room", { required: true })}
                    className="w-full h-12 px-4 border border-neutral-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-neutral-800 text-base bg-white"
                  >
                    {[1, 2, 3, 4].map((room) => (
                      <option key={room} value={room}>
                        {room}반
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    번호
                  </label>
                  <select
                    {...register("number", { required: true })}
                    className="w-full h-12 px-4 border border-neutral-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-neutral-800 text-base bg-white"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}번
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-base font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                "회원가입"
              )}
            </button>

            <div className="text-center text-sm">
              <span className="text-neutral-500">이미 계정이 있으신가요? </span>
              <a
                href="/login"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                로그인하기
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

export default SignUpPage;
