"use client";

import Sidebar from "@/components/applicant/Sidebar";
import { Container, Button } from "react-bootstrap";
import { useState } from "react";

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div className="d-flex">
      <Sidebar
        isOpen={showMobileSidebar}
        onClose={() => setShowMobileSidebar(false)}
      />
      <div className="flex-grow-1 p-4 bg-light">
        <div className="d-md-none mb-3">
          <Button
            variant="outline-primary"
            onClick={() => setShowMobileSidebar(true)}
            className="d-flex align-items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            Menu
          </Button>
        </div>
        <Container fluid>{children}</Container>
      </div>
    </div>
  );
}
