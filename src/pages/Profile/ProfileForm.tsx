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

const ProfileForm = ({
  profile,
  isEditing,
  editForm,
  onSubmit,
  onChange,
  isLoading,
}: ProfileFormProps) => {
  const renderField = (
    label: string,
    icon: React.ReactNode,
    value: string | number,
    editComponent: React.ReactNode
  ) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon}
        {label}
      </label>
      {isEditing ? (
        editComponent
      ) : (
        <div className="px-3 py-2 bg-slate-50 rounded text-slate-700">
          {value}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField(
            "이메일",
            <FiMail className="w-4 h-4 text-slate-400" />,
            profile.email,
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => onChange({ ...editForm, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />
          )}
          {renderField(
            "전화번호",
            <FiPhone className="w-4 h-4 text-slate-400" />,
            profile.phone,
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => onChange({ ...editForm, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "학년", value: editForm.grade, max: 3 },
            { label: "반", value: editForm.room, max: 4 },
            { label: "번호", value: editForm.number, max: 20 },
          ].map((field) => (
            <div key={field.label} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiHash className="w-4 h-4 text-slate-400" />
                {field.label}
              </label>
              {isEditing ? (
                <select
                  value={field.value}
                  onChange={(e) =>
                    onChange({
                      ...editForm,
                      [field.label === "학년"
                        ? "grade"
                        : field.label === "반"
                          ? "room"
                          : "number"]: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                >
                  {Array.from({ length: field.max }, (_, i) => i + 1).map(
                    (num) => (
                      <option key={num} value={num}>
                        {num}
                        {field.label}
                      </option>
                    )
                  )}
                </select>
              ) : (
                <div className="px-3 py-2 bg-slate-50 rounded text-slate-700">
                  {field.value}
                  {field.label}
                </div>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiEdit2 className="w-4 h-4" />
                  변경사항 저장
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
