'use client';

import { useState } from 'react';
import { Card, Row, Col, Button, Badge, Form, Modal, Alert } from 'react-bootstrap';
import { useParams, useRouter } from 'next/navigation';

export default function ApplicationDetails() {
    const params = useParams();
    const router = useRouter();
    const [status, setStatus] = useState('submitted');
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock Data
    const application = {
        id: params.id,
        appId: 'APP-1234',
        submittedAt: '2025-11-20',
        status: status,
        generalInfo: {
            fullName: 'John Doe',
            bin: '1234567890123',
            tin: '123456789012',
            address: '123 Main St, Dhaka',
            dob: '1990-01-01',
            nationality: 'Bangladeshi',
            nid: '1234567890123',
            mobile: '01712345678',
            email: 'john@example.com',
        },
        education: [
            { degree: 'B.Com', year: 2015, institute: 'Dhaka University', grade: 'First Class' }
        ],
        payOrder: {
            number: 'PO123456',
            amount: 5000,
            bank: 'Sonali Bank',
            branch: 'Motijheel',
            date: '2025-11-15'
        }
    };

    const handleApprove = async () => {
        setIsProcessing(true);
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('approved');
        setIsProcessing(false);
        alert('Application Approved! Redirecting to License...');
        router.push(`/license/${params.id}`);
    };

    const handleReturn = async () => {
        setIsProcessing(true);
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStatus('returned');
        setShowReturnModal(false);
        setIsProcessing(false);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Application Details: {application.appId}</h2>
                <div>
                    <Badge bg={status === 'approved' ? 'success' : status === 'returned' ? 'danger' : 'primary'} className="fs-6">
                        {status.toUpperCase()}
                    </Badge>
                </div>
            </div>

            <Row>
                <Col md={8}>
                    {/* General Info */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Header className="bg-light fw-bold">General Information</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6} className="mb-3"><strong>Full Name:</strong> {application.generalInfo.fullName}</Col>
                                <Col md={6} className="mb-3"><strong>BIN:</strong> {application.generalInfo.bin}</Col>
                                <Col md={6} className="mb-3"><strong>TIN:</strong> {application.generalInfo.tin}</Col>
                                <Col md={6} className="mb-3"><strong>NID:</strong> {application.generalInfo.nid}</Col>
                                <Col md={6} className="mb-3"><strong>Mobile:</strong> {application.generalInfo.mobile}</Col>
                                <Col md={6} className="mb-3"><strong>Email:</strong> {application.generalInfo.email}</Col>
                                <Col md={12} className="mb-3"><strong>Address:</strong> {application.generalInfo.address}</Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Education */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Header className="bg-light fw-bold">Education</Card.Header>
                        <Card.Body>
                            {application.education.map((edu, idx) => (
                                <div key={idx} className="mb-2">
                                    <strong>{edu.degree}</strong> - {edu.institute} ({edu.year}) <br />
                                    <span className="text-muted">Grade: {edu.grade}</span>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>

                    {/* Pay Order */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Header className="bg-light fw-bold">Pay Order Details</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}><strong>Number:</strong> {application.payOrder.number}</Col>
                                <Col md={6}><strong>Amount:</strong> {application.payOrder.amount} BDT</Col>
                                <Col md={6}><strong>Bank:</strong> {application.payOrder.bank}</Col>
                                <Col md={6}><strong>Branch:</strong> {application.payOrder.branch}</Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    {/* Actions */}
                    <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
                        <Card.Header className="bg-dark text-white">Admin Actions</Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="success"
                                    onClick={handleApprove}
                                    disabled={status === 'approved' || isProcessing}
                                >
                                    {isProcessing ? 'Processing...' : 'Approve & Generate License'}
                                </Button>
                                <Button
                                    variant="warning"
                                    onClick={() => setShowReturnModal(true)}
                                    disabled={status === 'approved' || status === 'returned' || isProcessing}
                                >
                                    Return to Applicant
                                </Button>
                                <Button variant="outline-secondary">Edit Applicant Info</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Return Modal */}
            <Modal show={showReturnModal} onHide={() => setShowReturnModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Return Application</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Reason for Return / Feedback</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            placeholder="Enter details..."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReturnModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleReturn}>Confirm Return</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
