'use client';

import { useState } from 'react';
import { Table, Badge, Button, Form, InputGroup, Row, Col, Pagination, Card } from 'react-bootstrap';
import Link from 'next/link';

export default function ApplicationsList() {
    // Mock data
    const applications = [
        { id: 1, appId: 'APP-1234', name: 'John Doe', email: 'john@example.com', date: '2025-11-20', status: 'submitted' },
        { id: 2, appId: 'APP-1233', name: 'Jane Smith', email: 'jane@example.com', date: '2025-11-19', status: 'under_review' },
        { id: 3, appId: 'APP-1232', name: 'Bob Johnson', email: 'bob@example.com', date: '2025-11-18', status: 'approved' },
        { id: 4, appId: 'APP-1231', name: 'Alice Brown', email: 'alice@example.com', date: '2025-11-18', status: 'returned' },
        { id: 5, appId: 'APP-1230', name: 'Charlie Davis', email: 'charlie@example.com', date: '2025-11-17', status: 'submitted' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'submitted': return <Badge bg="primary">Submitted</Badge>;
            case 'under_review': return <Badge bg="warning" text="dark">Under Review</Badge>;
            case 'approved': return <Badge bg="success">Approved</Badge>;
            case 'returned': return <Badge bg="danger">Returned</Badge>;
            default: return <Badge bg="secondary">Draft</Badge>;
        }
    };

    return (
        <div>
            <h2 className="mb-4">Applications</h2>

            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <InputGroup className="mb-3">
                                <Form.Control placeholder="Search by Name, NID, Email..." />
                                <Button variant="outline-secondary">Search</Button>
                            </InputGroup>
                        </Col>
                        <Col md={3}>
                            <Form.Select className="mb-3">
                                <option value="">Filter by Status</option>
                                <option value="submitted">Submitted</option>
                                <option value="under_review">Under Review</option>
                                <option value="approved">Approved</option>
                                <option value="returned">Returned</option>
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Select className="mb-3">
                                <option value="">Filter by Year</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Table hover responsive className="mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th>App ID</th>
                            <th>Applicant Name</th>
                            <th>Email</th>
                            <th>Submission Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td>{app.appId}</td>
                                <td>{app.name}</td>
                                <td>{app.email}</td>
                                <td>{app.date}</td>
                                <td>{getStatusBadge(app.status)}</td>
                                <td>
                                    <Button as={Link as any} href={`/admin/applications/${app.id}`} variant="outline-primary" size="sm">
                                        View Details
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Card.Footer className="d-flex justify-content-end">
                    <Pagination className="mb-0">
                        <Pagination.First />
                        <Pagination.Prev />
                        <Pagination.Item active>{1}</Pagination.Item>
                        <Pagination.Item>{2}</Pagination.Item>
                        <Pagination.Item>{3}</Pagination.Item>
                        <Pagination.Next />
                        <Pagination.Last />
                    </Pagination>
                </Card.Footer>
            </Card>
        </div>
    );
}
