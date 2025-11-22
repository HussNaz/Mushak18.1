"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { forwardRef, ComponentProps } from "react";

// Fix for TypeScript error with react-bootstrap and next/link
const NextLinkBase = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(
  (props, ref) => <Link ref={ref} {...props} />
);

NextLinkBase.displayName = "NextLink";
const NextLink = NextLinkBase as any;

export default function AppNavbar() {
  const pathname = usePathname();
  const isApplicantSection = pathname?.startsWith("/applicant");

  return (
    <Navbar variant="dark" expand="lg" className="sticky-top py-3">
      <Container fluid>
        <Navbar.Brand
          as={NextLink}
          href="/"
          className="fw-bold text-white d-flex align-items-center"
        >
          <img
            src="/bdlogo.png"
            alt="NBR Logo"
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
          />
          <div>
            <div className="lh-1">VAT Consultant</div>
            <small className="text-white-50 fs-6 fw-normal">
              Licensing Portal
            </small>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto fw-medium gap-3 align-items-center">
            {!isApplicantSection && (
              <Nav.Link
                as={NextLink}
                href="/"
                className="text-white nav-link-custom px-2"
              >
                Home
              </Nav.Link>
            )}
            <Nav.Link
              as={NextLink}
              href="/contact"
              className="text-white nav-link-custom px-2"
            >
              Contact Us
            </Nav.Link>
            <Nav.Link
              as={NextLink}
              href="/documents"
              className="text-white nav-link-custom px-2"
            >
              Documents
            </Nav.Link>

            {isApplicantSection ? (
              <>
                <Button
                  as={NextLink}
                  href="/"
                  variant="outline-light"
                  className="btn-compact rounded-pill border-opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Log Out
                </Button>

                <NavDropdown
                  title={<div className="profile-avatar shadow-sm">A</div>}
                  id="profile-dropdown"
                  align="end"
                  className="profile-dropdown ms-2"
                >
                  <NavDropdown.Item as={NextLink} href="/applicant/profile">
                    Update Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#">Change Password</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Button
                as={NextLink}
                href="/auth/signup"
                variant="outline-light"
                className="px-4 rounded-pill ms-lg-3"
              >
                Sign Up
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
