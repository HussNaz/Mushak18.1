import ProfileForm from "@/components/applicant/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="profile-page-wrapper">
      {/* Page Header */}
      <div className="profile-page-header">
        <h2 className="profile-page-title">
          <span className="profile-icon">👤</span>
          Profile Management
        </h2>
        <p className="profile-page-subtitle">
          Manage your personal information and keep your profile up to date
        </p>
      </div>

      {/* Form Container */}
      <div className="profile-form-container">
        <ProfileForm />
      </div>
    </div>
  );
}
