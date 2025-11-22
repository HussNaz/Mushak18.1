"use client";

import Image from "next/image";
import { Container, Row, Col, Card } from "react-bootstrap";
import LoginForm from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <Container fluid className="p-0 overflow-hidden">
      <Row className="g-0 min-vh-100">
        {/* Left Side - Image */}
        <Col md={6} className="d-none d-md-flex align-items-center justify-content-center p-2 bg-light">
          <Card className="border-0 shadow-lg w-100 h-100 overflow-hidden" style={{ borderRadius: "1px" }}>
            <Card.Body className="p-0 h-100 position-relative">
              <div className="h-100 w-100 position-relative rounded overflow-hidden">
                <Image
                  src="/images/tax-consultants.png"
                  alt="Enthusiastic Tax Consultants"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
                <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white bg-gradient-to-t from-black/80 to-transparent">
                  <h2 className="display-5 fw-bold mb-2">Welcome to Mushak 18.1</h2>
                  <p className="lead mb-0 fs-6">
                    Streamlining VAT Consultant Licensing with efficiency and transparency.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Side - Login Form */}
        <Col md={6} className="d-flex align-items-center justify-content-center bg-light position-relative">
          {/* Background decoration */}
          <div className="position-absolute top-0 end-0 p-5">
            <div className="rounded-circle bg-primary opacity-10" style={{ width: '300px', height: '300px', filter: 'blur(50px)' }}></div>
          </div>
          <div className="position-absolute bottom-0 start-0 p-5">
            <div className="rounded-circle bg-secondary opacity-10" style={{ width: '200px', height: '200px', filter: 'blur(40px)' }}></div>
          </div>

          <Card className="card-glass shadow-lg border-0 p-4 p-md-5 w-100" style={{ maxWidth: "500px", zIndex: 1 }}>
            <Card.Body>
              <div className="text-center mb-4">
                <h3 className="fw-bold text-primary mb-2">Login to Portal</h3>
                <p className="text-muted">Please enter your credentials to continue</p>
              </div>
              <LoginForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
