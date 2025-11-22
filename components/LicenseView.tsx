'use client';

import { useRef } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';

export default function LicenseView({ licenseData }: { licenseData: any }) {
    const licenseRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        if (licenseRef.current) {
            doc.html(licenseRef.current, {
                callback: function (doc) {
                    doc.save('VAT_Consultant_License.pdf');
                },
                x: 10,
                y: 10,
                width: 190, // target width in the PDF document
                windowWidth: 800, // window width in CSS pixels
            });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="mb-4 d-print-none gap-2 d-flex">
                <Button variant="primary" onClick={handlePrint}>Print License</Button>
                {/* <Button variant="outline-secondary" onClick={handleDownloadPDF}>Download PDF</Button> */}
            </div>

            <Card className="border-0 shadow-lg p-5" style={{ width: '210mm', minHeight: '297mm', background: '#fff' }} ref={licenseRef}>
                <div className="text-center mb-5">
                    <img src="/bd-logo.png" alt="Govt Logo" width="80" className="mb-3" />
                    <h4 className="fw-bold text-uppercase">Government of the People's Republic of Bangladesh</h4>
                    <h5 className="fw-bold">National Board of Revenue</h5>
                    <h6 className="text-muted">Customs, Excise and VAT Training Academy</h6>
                </div>

                <div className="text-center mb-5">
                    <h2 className="fw-bold text-decoration-underline text-success">VAT CONSULTANT LICENSE</h2>
                    <p className="mt-2">License Number: <span className="fw-bold fs-5">{licenseData.licenseNumber}</span></p>
                </div>

                <div className="mb-5">
                    <p className="fs-5 lh-lg">
                        This is to certify that <strong>{licenseData.fullName}</strong>,
                        Holder of NID No: <strong>{licenseData.nid}</strong>,
                        BIN: <strong>{licenseData.bin}</strong>,
                        Address: <strong>{licenseData.address}</strong>,
                        has been granted a license to practice as a VAT Consultant under the Value Added Tax and Supplementary Duty Act, 2012.
                    </p>
                </div>

                <Row className="mb-5">
                    <Col md={6}>
                        <p><strong>Date of Issue:</strong> {licenseData.issueDate}</p>
                        <p><strong>Valid Until:</strong> {licenseData.expiryDate}</p>
                    </Col>
                    <Col md={6} className="text-end">
                        <div className="mb-3">
                            <img src="https://placehold.co/150x50?text=Signature" alt="Signature" />
                        </div>
                        <p className="fw-bold mb-0">Director General</p>
                        <p className="small text-muted">Customs, Excise and VAT Training Academy</p>
                    </Col>
                </Row>

                <div className="mt-auto pt-5 border-top d-flex justify-content-between align-items-end">
                    <div>
                        <QRCodeSVG value={`https://nbr.gov.bd/verify/${licenseData.licenseNumber}`} size={100} />
                        <p className="small text-muted mt-2">Scan to Verify</p>
                    </div>
                    <div className="text-end">
                        <p className="small text-muted mb-0">System Generated Certificate</p>
                        <p className="small text-muted">This document is valid without a physical signature.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
