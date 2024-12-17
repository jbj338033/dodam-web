import { useState, useEffect, useRef, memo } from "react";
import { NavLink } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";
import { UserProfile } from "./types";

interface Props {
  profile: UserProfile | undefined;
  onLogout: () => void;
}

interface ProfileImageProps {
  profile: UserProfile | undefined;
}

const ProfileImage = memo(({ profile }: ProfileImageProps) => {
  if (profile?.profileImage) {
    return (
      <img
        src={profile.profileImage}
        alt={profile.name}
        className="w-7 h-7 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
      <FiUser className="w-4 h-4 text-slate-400" />
    </div>
  );
});

ProfileImage.displayName = "ProfileImage";

interface ProfileInfoProps {
  profile: UserProfile | undefined;
}

const ProfileInfo = memo(({ profile }: ProfileInfoProps) => (
  <div className="px-4 py-3 border-b border-slate-200">
    <p className="font-medium text-slate-900">{profile?.name}</p>
    <p className="text-xs text-slate-500 mt-0.5">
      {profile?.student.grade}학년 {profile?.student.room}반{" "}
      {profile?.student.number}번
    </p>
  </div>
));

ProfileInfo.displayName = "ProfileInfo";

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  profile: UserProfile | undefined;
}

const DropdownMenu = memo(
  ({ isOpen, onClose, onLogout, profile }: DropdownMenuProps) => (
    <div
      className={`absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 transition-all duration-200 origin-top-right ${
        isOpen
          ? "transform opacity-100 scale-100"
          : "transform opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <ProfileInfo profile={profile} />
      <NavLink
        to="/profile"
        onClick={onClose}
        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <FiUser className="w-4 h-4" />내 프로필
      </NavLink>
      <button
        onClick={onLogout}
        type="button"
        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <FiLogOut className="w-4 h-4" />
        로그아웃
      </button>
    </div>
  )
);

DropdownMenu.displayName = "DropdownMenu";

const ProfileDropdown = memo(({ profile, onLogout }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        type="button"
        className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
      >
        <ProfileImage profile={profile} />
        <span className="hidden md:block">{profile?.name}</span>
      </button>

      <DropdownMenu
        isOpen={isOpen}
        onClose={handleClose}
        onLogout={onLogout}
        profile={profile}
      />
    </div>
  );
});

ProfileDropdown.displayName = "ProfileDropdown";

export default ProfileDropdown;
