"use client";

import { useState, useRef } from "react";
import { Form, Row, Col, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  address: z.string().min(1, "Address is required"),
  mobile: z.string().regex(/^01\d{9}$/, "Invalid mobile number"),
  email: z.string().email().readonly(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<ProfileFormData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNjY3ZWVhIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzc2NGJhMiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNTUiIHI9IjI1IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC45Ii8+CjxwYXRoIGQ9Ik0zNSAxMjVRMzUgOTAgNzUgOTBUMTE1IDEyNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOSIvPgo8L3N2Zz4="
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock initial data
  const initialData = {
    fullName: "John Doe",
    address: "123 Main St, Dhaka",
    mobile: "01712345678",
    email: "applicant@example.com",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProfileFormData) => {
    setPendingData(data);
    setShowConfirmModal(true);
  };

  const confirmUpdate = async () => {
    if (!pendingData) return;

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setShowConfirmModal(false);
    setShowToast(true);
    setIsEditing(false);

    setTimeout(() => setShowToast(false), 4000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset(initialData);
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="profile-toast">
          <div className="profile-toast-content">
            <span className="profile-toast-icon">✓</span>
            <div className="profile-toast-text">
              <strong>Success!</strong>
              <p>Your profile has been updated successfully</p>
            </div>
          </div>
        </div>
      )}

      {/* Glassmorphic Card */}
      <div className="profile-glass-card">
        {/* Card Header with Avatar */}
        <div className="profile-card-header">
          <div className="profile-avatar-section">
            <div
              className={`profile-avatar-wrapper ${
                isEditing ? "editable" : ""
              }`}
              onClick={handleAvatarClick}
            >
              <Image
                src={avatarUrl}
                alt="Profile Avatar"
                className="profile-avatar-image"
                width={100}
                height={100}
                priority
                unoptimized
              />
              {isEditing && (
                <div className="profile-avatar-overlay">
                  <span className="profile-avatar-upload-icon">📷</span>
                  <span className="profile-avatar-upload-text">Change</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className="profile-avatar-info">
              <h4 className="profile-name">{initialData.fullName}</h4>
              <p className="profile-email">{initialData.email}</p>
            </div>
          </div>

          {!isEditing && (
            <button
              className="btn-gradient-edit"
              onClick={() => setIsEditing(true)}
            >
              <span className="btn-icon">✏️</span>
              Edit Profile
            </button>
          )}
        </div>

        <hr className="profile-divider" />

        {/* Form */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Personal Information Section */}
          <div className="profile-section">
            <h5 className="profile-section-title">
              <span className="section-icon">ℹ️</span>
              Personal Information
            </h5>

            <Row>
              <Col md={6} className="mb-4">
                <div className="floating-input-group">
                  <input
                    type="text"
                    className={`floating-input ${
                      errors.fullName ? "error" : ""
                    } ${!isEditing ? "disabled" : ""}`}
                    {...register("fullName")}
                    disabled={!isEditing}
                    placeholder=" "
                  />
                  <span className="input-icon">👤</span>
                  <label className="floating-label">Full Name</label>
                  {errors.fullName && (
                    <span className="input-error">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>
              </Col>

              <Col md={6} className="mb-4">
                <div className="floating-input-group">
                  <input
                    type="email"
                    className="floating-input disabled"
                    {...register("email")}
                    disabled={true}
                    placeholder=" "
                  />
                  <span className="input-icon">📧</span>
                  <label className="floating-label">Email Address</label>
                  <span className="input-hint">Email cannot be changed</span>
                </div>
              </Col>
            </Row>
          </div>

          {/* Contact Information Section */}
          <div className="profile-section">
            <h5 className="profile-section-title">
              <span className="section-icon">📞</span>
              Contact Information
            </h5>

            <Row>
              <Col md={6} className="mb-4">
                <div className="floating-input-group">
                  <input
                    type="text"
                    className={`floating-input ${
                      errors.mobile ? "error" : ""
                    } ${!isEditing ? "disabled" : ""}`}
                    {...register("mobile")}
                    disabled={!isEditing}
                    placeholder=" "
                  />
                  <span className="input-icon">�</span>
                  <label className="floating-label">Mobile Number</label>
                  {errors.mobile && (
                    <span className="input-error">{errors.mobile.message}</span>
                  )}
                </div>
              </Col>

              <Col md={12} className="mb-4">
                <div className="floating-input-group">
                  <textarea
                    className={`floating-input floating-textarea ${
                      errors.address ? "error" : ""
                    } ${!isEditing ? "disabled" : ""}`}
                    {...register("address")}
                    disabled={!isEditing}
                    placeholder=" "
                    rows={3}
                  />
                  <span className="input-icon">📍</span>
                  <label className="floating-label">Address</label>
                  {errors.address && (
                    <span className="input-error">
                      {errors.address.message}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="profile-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                <span className="btn-icon">✕</span>
                Cancel
              </button>
              <button type="submit" className="btn-gradient-save">
                <span className="btn-icon">💾</span>
                Save Changes
              </button>
            </div>
          )}
        </Form>
      </div>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
        className="profile-confirm-modal"
      >
        <Modal.Body className="profile-modal-body">
          <div className="profile-modal-icon">❓</div>
          <h4 className="profile-modal-title">Confirm Update</h4>
          <p className="profile-modal-text">
            Are you sure you want to update your profile information?
          </p>
          <div className="profile-modal-actions">
            <button
              className="btn-modal-cancel"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </button>
            <button className="btn-modal-confirm" onClick={confirmUpdate}>
              Confirm
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
