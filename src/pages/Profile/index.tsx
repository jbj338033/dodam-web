import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiUser } from "react-icons/fi";
import { useTokenStore } from "../../stores/token";
import { UserProfile, UpdateProfileDto } from "./types";
import ProfileCard from "./ProfileCard";
import ProfileForm from "./ProfileForm";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { accessToken } = useTokenStore();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateProfileDto>({
    email: "",
    phone: "",
    grade: 1,
    room: 1,
    number: 1,
  });

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axios.get(
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
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("프로필 수정에 실패했습니다");
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(
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

  useEffect(() => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(editForm);
  };

  if (!profile) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto py-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FiUser className="text-blue-500" />
                프로필
              </h1>
              <p className="text-slate-500 mt-1">
                도담도담에서 사용하는 내 프로필을 관리할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <ProfileCard
                profile={profile}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onCancel={() => setIsEditing(false)}
                onImageUpload={(file) => uploadImageMutation.mutate(file)}
              />
            </div>
            <div className="lg:col-span-2">
              <ProfileForm
                profile={profile}
                isEditing={isEditing}
                editForm={editForm}
                onSubmit={handleSubmit}
                onChange={setEditForm}
                isLoading={updateProfileMutation.isPending}
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#333333",
            padding: "12px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            border: "1px solid #e2e8f0",
          },
        }}
      />
    </div>
  );
};

export default ProfilePage;
