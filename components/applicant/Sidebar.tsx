"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sidebarVariants = {
    desktop: { x: 0, width: "280px" },
    mobileOpen: { x: 0, width: "280px" },
    mobileClosed: { x: "-100%", width: "280px" },
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/applicant",
      icon: (
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
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      name: "My Profile",
      path: "/applicant/profile",
      icon: (
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
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
    {
      name: "Apply for License",
      path: "/applicant/application",
      icon: (
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
      ),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sidebar-backdrop"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`applicant-sidebar d-flex flex-column flex-shrink-0 p-3 text-white ${
          isMobile ? "position-fixed h-100 z-index-sidebar" : ""
        }`}
        style={{ minHeight: "calc(100vh - 56px)" }}
        variants={sidebarVariants}
        initial={isMobile ? "mobileClosed" : "desktop"}
        animate={
          isMobile ? (isOpen ? "mobileOpen" : "mobileClosed") : "desktop"
        }
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none w-100">
          <a
            href="/applicant"
            className="d-flex align-items-center text-white text-decoration-none"
          >
            <span className="sidebar-brand fs-5 ms-2">Applicant Portal</span>
          </a>
          {isMobile && (
            <Button variant="link" className="text-white p-0" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          )}
        </div>
        <hr className="sidebar-divider" />
        <Nav className="flex-column mb-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Nav.Item key={item.path} className="mb-1">
                <Nav.Link
                  as={Link}
                  href={item.path}
                  className={`sidebar-item d-flex align-items-center gap-2 px-3 py-2 ${
                    isActive ? "sidebar-item-active" : ""
                  }`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.name}</span>
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav>
      </motion.div>
    </>
  );
}
