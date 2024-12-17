import { memo } from "react";
import { FiEdit2, FiHash, FiMail, FiPhone } from "react-icons/fi";
import { UpdateProfileDto, UserProfile } from "./types";

interface ProfileFormProps {
  profile: UserProfile;
  isEditing: boolean;
  editForm: UpdateProfileDto;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (form: UpdateProfileDto) => void;
  isLoading?: boolean;
}

interface FormFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string | number;
  isEditing: boolean;
  children?: React.ReactNode;
}

const FormField = memo(
  ({ label, icon, value, isEditing, children }: FormFieldProps) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon}
        {label}
      </label>
      {isEditing ? (
        children
      ) : (
        <div className="px-3 py-2 bg-slate-50 rounded text-slate-700">
          {value}
        </div>
      )}
    </div>
  )
);

FormField.displayName = "FormField";

interface NumberFieldProps {
  label: string;
  value: number;
  maxValue: number;
  isEditing: boolean;
  onChange: (value: number) => void;
}

const NumberField = memo(
  ({ label, value, maxValue, isEditing, onChange }: NumberFieldProps) => (
    <FormField
      label={label}
      icon={<FiHash className="w-4 h-4 text-slate-400" aria-hidden="true" />}
      value={`${value}${label}`}
      isEditing={isEditing}
    >
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
      >
        {Array.from({ length: maxValue }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num}
            {label}
          </option>
        ))}
      </select>
    </FormField>
  )
);

NumberField.displayName = "NumberField";

interface SubmitButtonProps {
  isLoading?: boolean;
}

const SubmitButton = memo(({ isLoading }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={isLoading}
    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
  >
    {isLoading ? (
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      <>
        <FiEdit2 className="w-4 h-4" aria-hidden="true" />
        변경사항 저장
      </>
    )}
  </button>
));

SubmitButton.displayName = "SubmitButton";

const ProfileForm = memo(
  ({
    profile,
    isEditing,
    editForm,
    onSubmit,
    onChange,
    isLoading,
  }: ProfileFormProps) => {
    const handleFormChange =
      (field: keyof UpdateProfileDto) => (value: string | number) => {
        onChange({ ...editForm, [field]: value });
      };

    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="이메일"
              icon={
                <FiMail className="w-4 h-4 text-slate-400" aria-hidden="true" />
              }
              value={profile.email}
              isEditing={isEditing}
            >
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => handleFormChange("email")(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              />
            </FormField>

            <FormField
              label="전화번호"
              icon={
                <FiPhone
                  className="w-4 h-4 text-slate-400"
                  aria-hidden="true"
                />
              }
              value={profile.phone}
              isEditing={isEditing}
            >
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => handleFormChange("phone")(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberField
              label="학년"
              value={editForm.grade}
              maxValue={3}
              isEditing={isEditing}
              onChange={handleFormChange("grade")}
            />
            <NumberField
              label="반"
              value={editForm.room}
              maxValue={4}
              isEditing={isEditing}
              onChange={handleFormChange("room")}
            />
            <NumberField
              label="번호"
              value={editForm.number}
              maxValue={20}
              isEditing={isEditing}
              onChange={handleFormChange("number")}
            />
          </div>

          {isEditing && (
            <div className="pt-4">
              <SubmitButton isLoading={isLoading} />
            </div>
          )}
        </form>
      </div>
    );
  }
);

ProfileForm.displayName = "ProfileForm";

export default ProfileForm;
