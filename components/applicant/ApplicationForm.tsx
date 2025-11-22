"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  FloatingLabel,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// --- Zod Schema ---
const educationSchema = z.object({
  degreeName: z.string().min(1, "Degree Name is required"),
  achievementYear: z.number().min(1900).max(new Date().getFullYear()),
  educationalInstitute: z.string().min(1, "Institute is required"),
  grade: z.string().min(1, "Grade is required"),
  specialAchievement: z.string().optional(),
});

const applicationSchema = z.object({
  // Section I
  bin: z.string().length(13, "BIN must be 13 digits"),
  tin: z.string().min(10).max(12, "TIN must be 10 or 12 digits"),
  fullName: z.string().min(1, "Full Name is required"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.date(),
  nationality: z.string().min(1, "Nationality is required"),
  nid: z.string().min(10, "NID must be valid"),
  cellNumber: z.string().regex(/^01\d{9}$/, "Invalid mobile number"),
  email: z.string().email(),

  // Section II
  education: z.array(educationSchema).min(1, "At least one degree is required"),

  // Section III (File IDs/URLs - simplified for mock)
  documents: z.object({
    secondaryCertificate: z.any().refine((val) => val, "Required"),
    passportPhotos: z.any().refine((val) => val, "Required"),
    highestCertificate: z.any().refine((val) => val, "Required"),
    nidCopy: z.any().refine((val) => val, "Required"),
    payOrder: z.any().refine((val) => val, "Required"),
  }),

  // Section IV & Pay Order
  payOrderDetails: z.object({
    amount: z.number().min(5000),
    payOrderNumber: z.string().min(1, "Pay Order Number is required"),
    date: z.date(),
    bankName: z.string().min(1, "Bank Name is required"),
    branchName: z.string().min(1, "Branch Name is required"),
    issuedTo: z
      .boolean()
      .refine((val) => val === true, "Must be issued to Director General"),
  }),

  declaration: z.object({
    designation: z.string().min(1, "Designation is required"),
    agreed: z
      .boolean()
      .refine((val) => val === true, "You must agree to the declaration"),
  }),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

// --- Custom Components ---
const AnimatedInput = ({
  label,
  register,
  name,
  error,
  type = "text",
  as,
  rows,
  placeholder,
  ...props
}: any) => {
  return (
    <motion.div whileHover={{ scale: 1.01 }} className="mb-3">
      <FloatingLabel
        controlId={name}
        label={label}
        className="floating-label-custom"
      >
        <Form.Control
          {...register(name)}
          isInvalid={!!error}
          type={type}
          as={as}
          rows={rows}
          placeholder={placeholder || label}
          className="input-hover-effect shadow-subtle"
          {...props}
        />
        <Form.Control.Feedback type="invalid">
          {error?.message}
        </Form.Control.Feedback>
      </FloatingLabel>
    </motion.div>
  );
};

const FileUpload = ({ onDrop, label, error, file }: any) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "application/pdf": [], "image/jpeg": [], "image/png": [] },
  });

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {label} <span className="text-danger">*</span>
      </Form.Label>
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.02, borderColor: "#0d6efd" }}
        whileTap={{ scale: 0.98 }}
        className={`border p-4 text-center rounded-3 bg-light shadow-subtle ${
          isDragActive ? "border-primary bg-primary-subtle" : ""
        }`}
        style={{ cursor: "pointer", borderStyle: "dashed" }}
      >
        <input {...getInputProps()} />
        {file ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="mb-0 text-success fw-medium">
              File selected: {file.name}
            </p>
          </motion.div>
        ) : (
          <p className="mb-0 text-muted small">
            {isDragActive
              ? "Drop file here..."
              : "Drag & drop or click to select (PDF/JPG, max 1MB)"}
          </p>
        )}
      </motion.div>
      {error && <div className="text-danger small mt-1">{error.message}</div>}
    </Form.Group>
  );
};

export default function ApplicationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      education: [
        {
          degreeName: "",
          achievementYear: new Date().getFullYear(),
          educationalInstitute: "",
          grade: "",
          specialAchievement: "",
        },
      ],
      payOrderDetails: { amount: 5000, issuedTo: false },
      declaration: { agreed: false },
      email: "applicant@example.com",
      cellNumber: "01712345678",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const watchedFiles = watch("documents");

  const handleFileDrop = (
    fieldName: keyof ApplicationFormData["documents"],
    acceptedFiles: File[]
  ) => {
    if (acceptedFiles.length > 0) {
      setValue(`documents.${fieldName}`, acceptedFiles[0], {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsLoading(true);
    setSubmitError(null);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/applicant/application",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.success) {
        router.push("/applicant");
      } else {
        setSubmitError(result.message || "Submission failed");
      }
    } catch (err) {
      setSubmitError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="danger" className="shadow-sm rounded-3">
              {submitError}
            </Alert>
          </motion.div>
        )}

        {/* Section I: General Information */}
        <motion.div variants={itemVariants} className="mb-4">
          <Card className="glass-card border-0">
            <div className="gradient-header">
              Section I: General Information
            </div>
            <Card.Body className="p-4">
              <Row>
                <Col md={6}>
                  <AnimatedInput
                    label="BIN"
                    name="bin"
                    register={register}
                    error={errors.bin}
                    placeholder="13 digits"
                  />
                </Col>
                <Col md={6}>
                  <AnimatedInput
                    label="TIN"
                    name="tin"
                    register={register}
                    error={errors.tin}
                    placeholder="10 or 12 digits"
                  />
                </Col>
                <Col md={12}>
                  <AnimatedInput
                    label="Full Name"
                    name="fullName"
                    register={register}
                    error={errors.fullName}
                  />
                </Col>
                <Col md={12}>
                  <AnimatedInput
                    label="Address"
                    name="address"
                    register={register}
                    error={errors.address}
                    as="textarea"
                    rows={2}
                  />
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Date of Birth <span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                      control={control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          className="form-control input-glow border-0 shadow-sm bg-light"
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select Date"
                          wrapperClassName="w-100"
                        />
                      )}
                    />
                    {errors.dateOfBirth && (
                      <div className="text-danger small">
                        {errors.dateOfBirth.message}
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Nationality <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      {...register("nationality")}
                      isInvalid={!!errors.nationality}
                      className="input-glow border-0 shadow-sm bg-light"
                    >
                      <option value="">Select...</option>
                      <option value="Bangladeshi">Bangladeshi</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.nationality?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <AnimatedInput
                    label="NID"
                    name="nid"
                    register={register}
                    error={errors.nid}
                  />
                </Col>
                <Col md={6}>
                  <AnimatedInput
                    label="Mobile"
                    name="cellNumber"
                    register={register}
                    error={errors.cellNumber}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Section II: Education */}
        <motion.div variants={itemVariants} className="mb-4">
          <Card className="glass-card border-0">
            <div className="gradient-header d-flex justify-content-between align-items-center">
              <span>Section II: Education</span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="light"
                  size="sm"
                  className="rounded-pill px-3 fw-bold text-primary"
                  onClick={() =>
                    append({
                      degreeName: "",
                      achievementYear: 2020,
                      educationalInstitute: "",
                      grade: "",
                      specialAchievement: "",
                    })
                  }
                >
                  + Add Degree
                </Button>
              </motion.div>
            </div>
            <Card.Body className="p-4">
              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 border-bottom pb-3"
                  >
                    <Row>
                      <Col md={6}>
                        <AnimatedInput
                          label="Degree Name"
                          name={`education.${index}.degreeName`}
                          register={register}
                          error={errors.education?.[index]?.degreeName}
                        />
                      </Col>
                      <Col md={6}>
                        <AnimatedInput
                          label="Year"
                          name={`education.${index}.achievementYear`}
                          register={register}
                          error={errors.education?.[index]?.achievementYear}
                          type="number"
                        />
                      </Col>
                      <Col md={6}>
                        <AnimatedInput
                          label="Institute"
                          name={`education.${index}.educationalInstitute`}
                          register={register}
                          error={
                            errors.education?.[index]?.educationalInstitute
                          }
                        />
                      </Col>
                      <Col md={6}>
                        <AnimatedInput
                          label="Grade/Class"
                          name={`education.${index}.grade`}
                          register={register}
                          error={errors.education?.[index]?.grade}
                        />
                      </Col>
                      <Col md={12}>
                        <AnimatedInput
                          label="Special Achievement"
                          name={`education.${index}.specialAchievement`}
                          register={register}
                        />
                      </Col>
                    </Row>
                    {index > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => remove(index)}
                          className="mt-2 rounded-pill"
                        >
                          Remove
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {errors.education && (
                <div className="text-danger">{errors.education.message}</div>
              )}
            </Card.Body>
          </Card>
        </motion.div>

        {/* Section III: Documents */}
        <motion.div variants={itemVariants} className="mb-4">
          <Card className="glass-card border-0">
            <div className="gradient-header">Section III: Document Uploads</div>
            <Card.Body className="p-4">
              <Row>
                <Col md={6}>
                  <FileUpload
                    label="Secondary School Certificate"
                    onDrop={(files: File[]) =>
                      handleFileDrop("secondaryCertificate", files)
                    }
                    error={errors.documents?.secondaryCertificate}
                    file={watchedFiles?.secondaryCertificate}
                  />
                </Col>
                <Col md={6}>
                  <FileUpload
                    label="Highest Education Certificate"
                    onDrop={(files: File[]) =>
                      handleFileDrop("highestCertificate", files)
                    }
                    error={errors.documents?.highestCertificate}
                    file={watchedFiles?.highestCertificate}
                  />
                </Col>
                <Col md={6}>
                  <FileUpload
                    label="3 Passport Photos"
                    onDrop={(files: File[]) =>
                      handleFileDrop("passportPhotos", files)
                    }
                    error={errors.documents?.passportPhotos}
                    file={watchedFiles?.passportPhotos}
                  />
                </Col>
                <Col md={6}>
                  <FileUpload
                    label="NID Copy"
                    onDrop={(files: File[]) => handleFileDrop("nidCopy", files)}
                    error={errors.documents?.nidCopy}
                    file={watchedFiles?.nidCopy}
                  />
                </Col>
                <Col md={6}>
                  <FileUpload
                    label="Pay Order Proof"
                    onDrop={(files: File[]) =>
                      handleFileDrop("payOrder", files)
                    }
                    error={errors.documents?.payOrder}
                    file={watchedFiles?.payOrder}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Section IV: Pay Order */}
        <motion.div variants={itemVariants} className="mb-4">
          <Card className="glass-card border-0">
            <div className="gradient-header">Section IV: Pay Order Details</div>
            <Card.Body className="p-4">
              <h6 className="mb-3 text-primary fw-bold">
                Pay Order Details (5000 BDT)
              </h6>
              <Row className="mb-4">
                <Col md={6}>
                  <AnimatedInput
                    label="Pay Order Number"
                    name="payOrderDetails.payOrderNumber"
                    register={register}
                    error={errors.payOrderDetails?.payOrderNumber}
                  />
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Date <span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                      control={control}
                      name="payOrderDetails.date"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          className="form-control input-glow border-0 shadow-sm bg-light"
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select Date"
                          wrapperClassName="w-100"
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <AnimatedInput
                    label="Bank Name"
                    name="payOrderDetails.bankName"
                    register={register}
                    error={errors.payOrderDetails?.bankName}
                  />
                </Col>
                <Col md={6}>
                  <AnimatedInput
                    label="Branch Name"
                    name="payOrderDetails.branchName"
                    register={register}
                    error={errors.payOrderDetails?.branchName}
                  />
                </Col>
                <Col md={12}>
                  <Form.Check
                    type="checkbox"
                    label="Issued To: Director General, Customs, Excise and VAT Training Academy"
                    {...register("payOrderDetails.issuedTo")}
                    isInvalid={!!errors.payOrderDetails?.issuedTo}
                    className="mt-2"
                  />
                  {errors.payOrderDetails?.issuedTo && (
                    <div className="text-danger small">
                      {errors.payOrderDetails.issuedTo.message}
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Declaration Section */}
        <motion.div variants={itemVariants} className="mb-5">
          <div className="declaration-section shadow-sm">
            <h5 className="mb-4 text-success fw-bold d-flex align-items-center">
              <span className="me-2">📝</span> Declaration
            </h5>
            <Row>
              <Col md={12}>
                <AnimatedInput
                  label="Designation"
                  name="declaration.designation"
                  register={register}
                  error={errors.declaration?.designation}
                />
              </Col>
              <Col md={12}>
                <div className="bg-white p-3 rounded border">
                  <Form.Check
                    type="checkbox"
                    label={
                      <span className="fw-medium">
                        I hereby declare that the particulars provided are
                        complete, true, and correct.
                      </span>
                    }
                    {...register("declaration.agreed")}
                    isInvalid={!!errors.declaration?.agreed}
                  />
                </div>
                {errors.declaration?.agreed && (
                  <div className="text-danger small mt-1">
                    {errors.declaration.agreed.message}
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="d-grid gap-2 mb-5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            size="lg"
            type="submit"
            disabled={isLoading}
            className="btn-gradient-elegant py-3 fw-bold"
          >
            {isLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Submit Application"
            )}
          </Button>
        </motion.div>
      </Form>
    </motion.div>
  );
}
