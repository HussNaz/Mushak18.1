'use client';

import { Container, Card, Table, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function DocumentsPage() {
    return (
        <div className="py-5 bg-light">
            <Container>
                <h2 className="mb-4 text-success fw-bold">Documents & Information</h2>

                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-success text-white">
                        <h5 className="mb-0">About Mushak 18.1 (VAT Consultant License)</h5>
                    </Card.Header>
                    <Card.Body>
                        <p className="lead">
                            The <strong>Mushak 18.1</strong> form is the official application for obtaining a VAT Consultant License
                            from the National Board of Revenue (NBR), Bangladesh. It is governed by Section 130 and Rule 109(1)
                            of the Value Added Tax (VAT) & Supplementary Duty (SD) Act 2012.
                        </p>
                        <p>
                            This license authorizes qualified individuals to practice as VAT Consultants, representing taxpayers
                            in VAT-related matters before the NBR.
                        </p>
                    </Card.Body>
                </Card>

                <Card className="shadow-sm mb-4">
                    <Card.Header>
                        <h5 className="mb-0">Required Documents for Application</h5>
                    </Card.Header>
                    <Card.Body>
                        <p>Applicants must submit the following documents along with their Mushak 18.1 application:</p>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Document Name</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Educational Certificates</td>
                                    <td>Attested copies of SSC, HSC, Graduation, and Post-Graduation certificates.</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>National ID Card (NID)</td>
                                    <td>Copy of valid National ID card.</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Passport Size Photos</td>
                                    <td>3 recent passport-sized color photographs.</td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>TIN Certificate</td>
                                    <td>Valid Taxpayer Identification Number (TIN) certificate.</td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td>Treasury Challan / Pay Order</td>
                                    <td>Original copy of Treasury Challan or Pay Order of BDT 5,000 (Application Fee).</td>
                                </tr>
                                <tr>
                                    <td>6</td>
                                    <td>Experience Certificate</td>
                                    <td>If applicable, proof of prior experience in tax/VAT consultancy.</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <div className="text-center mt-5">
                    <p className="mb-3">Ready to apply?</p>
                    <Button as={Link as any} href="/auth/signup" variant="primary" size="lg">
                        Start Online Application
                    </Button>
                </div>
            </Container>
        </div>
    );
}
