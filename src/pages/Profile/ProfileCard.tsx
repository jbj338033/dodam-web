import { memo } from "react";
import { FiEdit2, FiUser } from "react-icons/fi";
import { UserProfile } from "./types";

interface ProfileCardProps {
  profile: UserProfile;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onImageUpload: (file: File) => void;
}

interface HeaderProps {
  isEditing: boolean;
  onCancel: () => void;
}

const Header = memo(({ isEditing, onCancel }: HeaderProps) => (
  <div className="relative h-32 bg-gradient-to-r from-slate-50 to-slate-100">
    {isEditing && (
      <button
        onClick={onCancel}
        type="button"
        className="absolute top-4 right-4 px-3 py-1.5 bg-white text-sm text-slate-600 rounded hover:bg-slate-50"
      >
        취소
      </button>
    )}
  </div>
));

Header.displayName = "Header";

interface ProfileImageProps {
  profile: UserProfile;
  isEditing: boolean;
  onImageUpload: (file: File) => void;
}

const ProfileImage = memo(
  ({ profile, isEditing, onImageUpload }: ProfileImageProps) => (
    <div className="relative">
      {profile.profileImage ? (
        <img
          src={profile.profileImage}
          alt=""
          className="w-32 h-32 rounded-full border-4 border-white object-cover mx-auto"
        />
      ) : (
        <div
          className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center mx-auto"
          role="img"
          aria-label="기본 프로필 이미지"
        >
          <FiUser className="w-10 h-10 text-slate-400" aria-hidden="true" />
        </div>
      )}
      {isEditing && (
        <label
          className="absolute bottom-2 right-1/3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.currentTarget.click();
            }
          }}
        >
          <FiEdit2 className="w-4 h-4 text-white" aria-hidden="true" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageUpload(file);
            }}
            aria-label="프로필 이미지 업로드"
          />
        </label>
      )}
    </div>
  )
);

ProfileImage.displayName = "ProfileImage";

interface ProfileInfoProps {
  profile: UserProfile;
}

const ProfileInfo = memo(({ profile }: ProfileInfoProps) => (
  <div className="text-center mb-6">
    <h2 className="text-lg font-bold text-slate-900">{profile.name}</h2>
    <p className="text-sm text-slate-500 mt-1">
      {profile.student.grade}학년 {profile.student.room}반{" "}
      {profile.student.number}번
    </p>
  </div>
));

ProfileInfo.displayName = "ProfileInfo";

interface EditButtonProps {
  onClick: () => void;
}

const EditButton = memo(({ onClick }: EditButtonProps) => (
  <button
    onClick={onClick}
    type="button"
    className="w-full py-2 bg-slate-100 text-slate-700 rounded font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
  >
    <FiEdit2 className="w-4 h-4" aria-hidden="true" />
    프로필 수정
  </button>
));

EditButton.displayName = "EditButton";

const ProfileCard = memo(
  ({
    profile,
    isEditing,
    onEdit,
    onCancel,
    onImageUpload,
  }: ProfileCardProps) => {
    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <Header isEditing={isEditing} onCancel={onCancel} />
        <div className="px-6 pb-6">
          <div className="relative -mt-16 mb-4">
            <ProfileImage
              profile={profile}
              isEditing={isEditing}
              onImageUpload={onImageUpload}
            />
          </div>
          <ProfileInfo profile={profile} />
          {!isEditing && <EditButton onClick={onEdit} />}
        </div>
      </div>
    );
  }
);

ProfileCard.displayName = "ProfileCard";

export default ProfileCard;
