import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTokenStore } from "../stores/token";
import toast, { Toaster } from "react-hot-toast";
import { FiEdit2, FiUser, FiMail, FiPhone, FiHash } from "react-icons/fi";

interface StudentInfo {
  id: number;
  name: string;
  grade: number;
  room: number;
  number: number;
  parentPhone: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profileImage: string | null;
  phone: string;
  student: StudentInfo;
  createdAt: string;
  modifiedAt: string;
}

interface ProfileResponse {
  status: number;
  message: string;
  data: UserProfile;
}

interface UpdateProfileDto {
  email: string;
  phone: string;
  profileImage?: string;
  grade: number;
  room: number;
  number: number;
}

const ProfilePage = () => {
  const { accessToken } = useTokenStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState<UpdateProfileDto>({
    email: "",
    phone: "",
    grade: 1,
    room: 1,
    number: 1,
  });

  const { data: profile, refetch } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axios.get<ProfileResponse>(
        `${import.meta.env.VITE_API_URL}/member/my`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data.data;
    },
    enabled: !!accessToken,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updateData: UpdateProfileDto) => {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/member/info`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("프로필이 수정되었습니다");
      setIsEditing(false);
      refetch();
    },
    onError: () => {
      toast.error("프로필 수정에 실패했습니다");
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post<{ data: string }>(
        `${import.meta.env.VITE_API_URL}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data.data;
    },
    onSuccess: (imageUrl) => {
      updateProfileMutation.mutate({
        ...editForm,
        profileImage: imageUrl,
      });
    },
    onError: () => {
      toast.error("이미지 업로드에 실패했습니다");
    },
  });

  React.useEffect(() => {
    if (profile) {
      setEditForm({
        email: profile.email,
        phone: profile.phone,
        grade: profile.student.grade,
        room: profile.student.room,
        number: profile.student.number,
      });
    }
  }, [profile]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImageMutation.mutate(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(editForm);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">프로필 관리</h1>
            <p className="text-blue-100">
              도담도담에서 사용하는 내 프로필을 관리할 수 있습니다
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-blue-50 to-blue-100">
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-white transition-colors"
                  >
                    취소
                  </button>
                )}
              </div>
              <div className="px-6 pb-6">
                <div className="relative -mt-16 mb-4">
                  <div className="relative">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-white object-cover mx-auto shadow-sm"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-white bg-neutral-100 flex items-center justify-center mx-auto">
                        <FiUser size={40} className="text-neutral-400" />
                      </div>
                    )}
                    {isEditing && (
                      <label className="absolute bottom-2 right-1/3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-sm">
                        <FiEdit2 size={16} className="text-white" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-neutral-900">
                    {profile.name}
                  </h2>
                  <p className="text-neutral-500 mt-1">
                    {profile.student.grade}학년 {profile.student.room}반{" "}
                    {profile.student.number}번
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2.5 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiEdit2 size={16} />
                    프로필 수정
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                      <FiMail className="text-neutral-400" />
                      이메일
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="이메일을 입력하세요"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-700">
                        {profile.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                      <FiPhone className="text-neutral-400" />
                      전화번호
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="전화번호를 입력하세요"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-700">
                        {profile.phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Student Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                      <FiHash className="text-neutral-400" />
                      학년
                    </label>
                    {isEditing ? (
                      <select
                        value={editForm.grade}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            grade: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      >
                        {[1, 2, 3].map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}학년
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-700">
                        {profile.student.grade}학년
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                      <FiHash className="text-neutral-400" />반
                    </label>
                    {isEditing ? (
                      <select
                        value={editForm.room}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            room: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      >
                        {[1, 2, 3, 4].map((room) => (
                          <option key={room} value={room}>
                            {room}반
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-700">
                        {profile.student.room}반
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                      <FiHash className="text-neutral-400" />
                      번호
                    </label>
                    {isEditing ? (
                      <select
                        value={editForm.number}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            number: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      >
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(
                          (num) => (
                            <option key={num} value={num}>
                              {num}번
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-700">
                        {profile.student.number}번
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {updateProfileMutation.isPending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <FiEdit2 size={16} />
                          변경사항 저장
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
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

export default ProfilePage;
