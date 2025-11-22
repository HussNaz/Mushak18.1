"use client";

import { Row, Col } from "react-bootstrap";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-modern text-light py-5 mt-auto">
      <div className="container-fluid px-4 px-md-5">
        <Row className="gy-4">
          <Col md={4} className="mb-4 mb-md-0">
            <div className="footer-logo-section mb-3">
              <div className="footer-logo-bg">
                <img src="/bdlogo.png" alt="NBR Logo" width="40" />
              </div>
              <h5 className="mb-0 fw-bold">VAT Licensing</h5>
            </div>
            <p className="small" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
              Official portal of the National Board of Revenue (NBR) for VAT
              Consultant Licensing and management.
            </p>
          </Col>

          <Col md={2} xs={6}>
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link href="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/documents" className="footer-link">
                  Documents
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3} xs={6}>
            <h6 className="footer-heading">Legal & Support</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Terms of Service
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Help Center
                </a>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="footer-heading">Contact</h6>
            <ul
              className="list-unstyled small"
              style={{ color: "rgba(255, 255, 255, 0.85)" }}
            >
              <li className="mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="me-2"
                  style={{ verticalAlign: "middle", color: "#14b8a6" }}
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                National Board of Revenue
              </li>
              <li className="mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="me-2"
                  style={{ verticalAlign: "middle", color: "#14b8a6" }}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Segunbagicha, Dhaka-1000
              </li>
              <li className="mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="me-2"
                  style={{ verticalAlign: "middle", color: "#14b8a6" }}
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                support@nbr.gov.bd
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="border-light my-4" style={{ opacity: 0.2 }} />

        <div
          className="text-center small"
          style={{ color: "rgba(255, 255, 255, 0.75)" }}
        >
          <p className="mb-0">
            &copy; {new Date().getFullYear()} National Board of Revenue,
            Bangladesh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
