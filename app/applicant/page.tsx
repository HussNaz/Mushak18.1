"use client";

import { Card, Row, Col, Badge } from "react-bootstrap";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ApplicantDashboard() {
  // Mock data
  const applicationStatus: string = "draft"; // 'draft', 'submitted', 'under_review', 'approved'
  const applicantName = "John Doe";
  const [progress, setProgress] = useState(0);

  // Animated progress effect
  useEffect(() => {
    const targetProgress =
      applicationStatus === "draft"
        ? 25
        : applicationStatus === "submitted"
        ? 50
        : applicationStatus === "under_review"
        ? 75
        : 100;

    const timer = setTimeout(() => setProgress(targetProgress), 300);
    return () => clearTimeout(timer);
  }, [applicationStatus]);

  const stages = [
    { name: "Draft", value: 25 },
    { name: "Submitted", value: 50 },
    { name: "Under Review", value: 75 },
    { name: "Approved", value: 100 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "submitted":
        return "primary";
      case "under_review":
        return "warning";
      case "approved":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <div>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="d-flex align-items-center mb-4 pb-3 border-bottom"
      >
        <div className="welcome-avatar me-3">{applicantName.charAt(0)}</div>
        <div>
          <h2 className="mb-0 fw-bold">Welcome back, {applicantName}!</h2>
          <p className="text-muted mb-0">
            Track your application progress below
          </p>
        </div>
      </motion.div>

      <Row className="mb-4">
        <Col lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="dashboard-card">
              <Card.Body className="p-4">
                <h5 className="card-title fw-bold mb-4">Application Status</h5>

                {/* Custom Animated Progress Bar */}
                <div className="mb-4">
                  <div className="progress-container mb-3">
                    <motion.div
                      className="progress-bar-custom"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    {stages.map((stage, index) => (
                      <div
                        key={stage.name}
                        className={`progress-stage text-center ${
                          progress >= stage.value ? "active" : ""
                        }`}
                        style={{ flex: 1 }}
                      >
                        <div className="fw-bold">{stage.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Badge and Action Button */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mt-4 p-3 bg-light rounded">
                  <div className="d-flex align-items-center">
                    <strong className="me-2">Current Status:</strong>
                    <Badge
                      bg={getStatusColor(applicationStatus)}
                      className="status-badge"
                    >
                      {applicationStatus}
                    </Badge>
                  </div>

                  {applicationStatus === "draft" && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/applicant/application"
                        className="btn-gradient-action text-decoration-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                        Continue Application
                      </Link>
                    </motion.div>
                  )}

                  {applicationStatus === "approved" && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/license/123"
                        className="btn-gradient-action text-decoration-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        View License
                      </Link>
                    </motion.div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}
