'use client';

import { Row, Col, Card } from 'react-bootstrap';

export default function AdminDashboard() {
    // Mock data
    const stats = {
        totalApplications: 150,
        pendingReview: 45,
        approved: 90,
        returned: 15,
        totalFees: 750000, // 150 * 5000
    };

    return (
        <div>
            <h2 className="mb-4">Admin Dashboard</h2>

            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-white bg-primary mb-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Applications</Card.Title>
                            <Card.Text className="display-4">{stats.totalApplications}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-white bg-warning mb-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Pending Review</Card.Title>
                            <Card.Text className="display-4">{stats.pendingReview}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-white bg-success mb-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Approved</Card.Title>
                            <Card.Text className="display-4">{stats.approved}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-white bg-info mb-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Fees (BDT)</Card.Title>
                            <Card.Text className="display-6">৳{stats.totalFees.toLocaleString()}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Header>Recent Activity</Card.Header>
                        <Card.Body>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Application #APP-1234 submitted
                                    <span className="badge bg-secondary rounded-pill">Just now</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    License generated for #APP-1230
                                    <span className="badge bg-success rounded-pill">1 hr ago</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Application #APP-1225 returned
                                    <span className="badge bg-danger rounded-pill">2 hrs ago</span>
                                </li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
