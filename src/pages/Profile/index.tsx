import { useState, useEffect, memo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiUser } from "react-icons/fi";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useTokenStore } from "../../stores/token";
import { UserProfile, UpdateProfileDto } from "./types";
import ProfileCard from "./ProfileCard";
import ProfileForm from "./ProfileForm";
import { dodamAxios } from "../../libs/axios";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PageHeader = memo(({ title, description, icon }: PageHeaderProps) => (
  <div className="border-b border-slate-200 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto py-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {icon}
            {title}
          </h1>
          <p className="text-slate-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  </div>
));

PageHeader.displayName = "PageHeader";

const useProfile = () => {
  const { accessToken } = useTokenStore();

  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await dodamAxios.get("/member/my");
      return data.data;
    },
    enabled: !!accessToken,
  });
};

const useProfileMutations = () => {
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (updateData: UpdateProfileDto) => {
      await dodamAxios.patch("/member/info", updateData);
    },
    onSuccess: () => {
      toast.success("프로필이 수정되었습니다");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("프로필 수정에 실패했습니다");
    },
  });

  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await dodamAxios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onError: () => {
      toast.error("이미지 업로드에 실패했습니다");
    },
  });

  return { updateProfile, uploadImage };
};

const initialFormState: UpdateProfileDto = {
  email: "",
  phone: "",
  grade: 1,
  room: 1,
  number: 1,
};

const Profile = memo(() => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateProfileDto>(initialFormState);

  const { data: profile } = useProfile();
  const { updateProfile, uploadImage } = useProfileMutations();

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await updateProfile.mutateAsync(editForm);
      setIsEditing(false);
    },
    [updateProfile, editForm]
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      const imageUrl = await uploadImage.mutateAsync(file);
      updateProfile.mutate({
        ...editForm,
        profileImage: imageUrl,
      });
    },
    [uploadImage, updateProfile, editForm]
  );

  const handleEdit = useCallback(() => setIsEditing(true), []);
  const handleCancel = useCallback(() => setIsEditing(false), []);

  if (!profile) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <PageHeader
        title="프로필"
        description="도담도담에서 사용하는 내 프로필을 관리할 수 있습니다"
        icon={<FiUser className="text-blue-500" />}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <ProfileCard
                profile={profile}
                isEditing={isEditing}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onImageUpload={handleImageUpload}
              />
            </div>
            <div className="lg:col-span-2">
              <ProfileForm
                profile={profile}
                isEditing={isEditing}
                editForm={editForm}
                onSubmit={handleSubmit}
                onChange={setEditForm}
                isLoading={updateProfile.isPending}
              />
            </div>
          </div>
        </div>
      </main>

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
});

Profile.displayName = "Profile";

export default Profile;
