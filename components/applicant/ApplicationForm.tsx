"use client";

import { useState, useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  UseFormRegister,
  Path,
  FieldError,
} from "react-hook-form";
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

const applicationSchema = z
  .object({
    // Section I
    applicantType: z.enum(["General", "Departmental", "CA Certified"], {
      errorMap: () => ({ message: "Please select an applicant type" }),
    }),
    tin: z.string().regex(/^\d{12}$/, "TIN must be a 12-digit number"),
    fullName: z.string().min(1, "Full Name is required"),
    address: z.string().min(1, "Address is required"),
    dateOfBirth: z.date({ required_error: "Date of Birth is required" }),
    nid: z
      .string()
      .regex(/^(\d{10}|\d{13}|\d{17})$/, "NID must be 10, 13, or 17 digits"),
    cellNumber: z
      .string()
      .regex(
        /^01\d{9}$/,
        "Mobile number must start with 01 and be 11 digits long"
      ),
    email: z.string().email(),
    bin: z.string().optional(),

    // Section II
    education: z
      .array(educationSchema)
      .min(1, "At least one degree is required"),

    // Section III (File IDs/URLs - simplified for mock)
    documents: z.object({
      secondaryCertificate: z.any().refine((val) => val, "Required"),
      passportPhotos: z.any().refine((val) => val, "Required"),
      highestCertificate: z.any().refine((val) => val, "Required"),
      nidCopy: z.any().refine((val) => val, "Required"),
      payOrder: z.any().refine((val) => val, "Required"),
    }),

    declaration: z.object({
      agreed: z
        .boolean()
        .refine((val) => val === true, "You must agree to the declaration"),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.applicantType !== "General") {
      if (!data.bin || data.bin.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "BIN is required",
          path: ["bin"],
        });
      } else if (!/^\d{13}$/.test(data.bin)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "BIN must be 13 digits",
          path: ["bin"],
        });
      }
    }
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
interface AnimatedInputProps extends React.ComponentProps<typeof Form.Control> {
  label: string;
  register: UseFormRegister<ApplicationFormData>;
  name: Path<ApplicationFormData>;
  error?: FieldError;
}

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
}: AnimatedInputProps) => {
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

interface FileUploadProps {
  onDrop: (files: File[]) => void;
  label: string;
  error?: any;
  file?: File | any;
  isActive?: boolean;
  onClick?: () => void;
}

const FileUpload = ({
  onDrop,
  label,
  error,
  file,
  isActive,
  onClick,
}: FileUploadProps) => {
  const [localError, setLocalError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      setLocalError(null);
      onDrop(acceptedFiles);
    },
    maxFiles: 1,
    maxSize: 1048576, // 1MB
    accept: { "application/pdf": [], "image/jpeg": [], "image/png": [] },
    noClick: true, // We handle clicks manually
    onDropRejected: (fileRejections) => {
      if (fileRejections[0].errors[0].code === "file-too-large") {
        setLocalError("File is larger than 1MB");
      } else {
        setLocalError("Invalid file type or size");
      }
    },
  });

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  const handleChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    open();
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {label} <span className="text-danger">*</span>
      </Form.Label>
      <motion.div
        {...getRootProps()}
        onClick={file ? handlePreviewClick : open}
        whileHover={{ scale: 1.01, borderColor: "#0d6efd" }}
        whileTap={{ scale: 0.99 }}
        className={`border p-3 text-center rounded-3 shadow-subtle position-relative ${
          isDragActive ? "border-primary bg-primary-subtle" : ""
        } ${localError || error ? "border-danger" : ""} ${
          isActive ? "border-primary ring-2 ring-primary bg-light" : "bg-white"
        }`}
        style={{
          cursor: "pointer",
          borderStyle: "dashed",
          transition: "all 0.2s ease",
          borderWidth: isActive ? "2px" : "1px",
        }}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2 text-truncate">
              <i className="bi bi-file-earmark-check text-success fs-4"></i>
              <span className="fw-medium text-truncate" title={file.name}>
                {file.name}
              </span>
            </div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleChange}
              className="rounded-pill px-3 ms-2"
            >
              Change
            </Button>
          </div>
        ) : (
          <div className="py-2">
            <p className="mb-0 text-muted small">
              {isDragActive
                ? "Drop file here..."
                : "Drag & drop or click to select (PDF/JPG, max 1MB)"}
            </p>
          </div>
        )}
      </motion.div>
      {(localError || error) && (
        <div className="text-danger small mt-1">
          {localError || error.message}
        </div>
      )}
    </Form.Group>
  );
};

export default function ApplicationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData | null>(null);
  const [activePreview, setActivePreview] = useState<{
    file: File | null;
    label: string;
  }>({ file: null, label: "" });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
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
      // Auto-select for preview
      setActivePreview({
        file: acceptedFiles[0],
        label: fieldName, // Simplified label, can be mapped if needed
      });
    }
  };

  const renderPreview = () => {
    const { file } = activePreview;
    if (!file) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted p-5">
          <i className="bi bi-file-earmark-text display-1 mb-3 opacity-25"></i>
          <p>Upload a document to preview</p>
        </div>
      );
    }

    const fileURL = URL.createObjectURL(file);
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";

    return (
      <div className="h-100 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <h6 className="mb-0 text-truncate fw-bold text-primary">
            {file.name}
          </h6>
          <a
            href={fileURL}
            download={file.name}
            className="btn btn-sm btn-outline-secondary rounded-pill"
          >
            <i className="bi bi-download me-1"></i> Download
          </a>
        </div>
        <div className="flex-grow-1 bg-light rounded border overflow-hidden position-relative">
          {isImage && (
            <img
              src={fileURL}
              alt="Preview"
              className="img-fluid w-100 h-100 object-fit-contain"
            />
          )}
          {isPDF && (
            <iframe
              src={fileURL}
              className="w-100 h-100 border-0"
              title="PDF Preview"
            />
          )}
          {!isImage && !isPDF && (
            <div className="d-flex align-items-center justify-content-center h-100">
              <p>Preview not available for this file type</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const onSubmit = (data: ApplicationFormData) => {
    setFormData(data);
    setShowPreview(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = async () => {
    if (!formData) return;
    setIsLoading(true);
    setSubmitError(null);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/applicant/application",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (result.success) {
        router.push("/applicant");
      } else {
        setSubmitError(result.message || "Submission failed");
        setShowPreview(false); // Go back to edit on error
      }
    } catch (error) {
      setSubmitError("An error occurred. Please try again.");
      setShowPreview(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form with saved data when returning from preview
  useEffect(() => {
    if (!showPreview && formData) {
      reset(formData);
    }
  }, [showPreview, formData, reset]);

  if (showPreview && formData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-4"
      >
        <Card className="glass-card border-0 shadow-lg">
          <div className="gradient-header text-center">
            <h3>Application Preview</h3>
            <p className="mb-0 text-white-50">
              Please review your details before submitting
            </p>
          </div>
          <Card.Body className="p-5">
            {/* Section I */}
            <h5 className="text-primary border-bottom pb-2 mb-3">
              Section I: General Information
            </h5>
            <Row className="mb-4">
              <Col md={6} className="mb-2">
                <strong>Applicant Type:</strong> {formData.applicantType}
              </Col>
              <Col md={6} className="mb-2">
                <strong>TIN:</strong> {formData.tin}
              </Col>
              {formData.bin && (
                <Col md={6} className="mb-2">
                  <strong>BIN:</strong> {formData.bin}
                </Col>
              )}
              <Col md={6} className="mb-2">
                <strong>NID:</strong> {formData.nid}
              </Col>
              <Col md={6} className="mb-2">
                <strong>Mobile:</strong> {formData.cellNumber}
              </Col>
              <Col md={6} className="mb-2">
                <strong>Date of Birth:</strong>{" "}
                {formData.dateOfBirth?.toLocaleDateString()}
              </Col>
              <Col md={6} className="mb-2">
                <strong>Email:</strong> {formData.email}
              </Col>
              <Col md={12} className="mb-2">
                <strong>Full Name:</strong> {formData.fullName}
              </Col>
              <Col md={12} className="mb-2">
                <strong>Address:</strong> {formData.address}
              </Col>
            </Row>

            {/* Section II */}
            <h5 className="text-primary border-bottom pb-2 mb-3">
              Section II: Education
            </h5>
            {formData.education.map((edu, idx) => (
              <div
                key={idx}
                className="mb-4 p-4 bg-white rounded-3 shadow-sm border"
              >
                <h6 className="fw-bold text-secondary mb-3">
                  Qualification #{idx + 1}
                </h6>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="d-flex flex-column">
                      <span className="text-muted small text-uppercase fw-bold">
                        Degree
                      </span>
                      <span className="fw-medium fs-5">{edu.degreeName}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex flex-column">
                      <span className="text-muted small text-uppercase fw-bold">
                        Year
                      </span>
                      <span className="fw-medium fs-5">
                        {edu.achievementYear}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex flex-column">
                      <span className="text-muted small text-uppercase fw-bold">
                        Institute
                      </span>
                      <span className="fw-medium">
                        {edu.educationalInstitute}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex flex-column">
                      <span className="text-muted small text-uppercase fw-bold">
                        Grade/Class
                      </span>
                      <span className="fw-medium">{edu.grade}</span>
                    </div>
                  </Col>
                  {edu.specialAchievement && (
                    <Col md={12}>
                      <div className="d-flex flex-column mt-2 p-3 bg-light rounded">
                        <span className="text-muted small text-uppercase fw-bold">
                          Special Achievement
                        </span>
                        <span className="fw-medium fst-italic">
                          {edu.specialAchievement}
                        </span>
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            ))}

            {/* Section III */}
            <h5 className="text-primary border-bottom pb-2 mb-3 mt-4">
              Section III: Documents
            </h5>
            <Row>
              <Col md={6} className="mb-3">
                <div className="p-3 border rounded bg-light h-100">
                  <strong className="d-block text-muted small text-uppercase mb-1">
                    SSC Certificate
                  </strong>
                  <span className="text-break">
                    {formData.documents.secondaryCertificate?.name}
                  </span>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="p-3 border rounded bg-light h-100">
                  <strong className="d-block text-muted small text-uppercase mb-1">
                    Highest Certificate
                  </strong>
                  <span className="text-break">
                    {formData.documents.highestCertificate?.name}
                  </span>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="p-3 border rounded bg-light h-100">
                  <strong className="d-block text-muted small text-uppercase mb-1">
                    Passport Photos
                  </strong>
                  <span className="text-break">
                    {formData.documents.passportPhotos?.name}
                  </span>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="p-3 border rounded bg-light h-100">
                  <strong className="d-block text-muted small text-uppercase mb-1">
                    NID Copy
                  </strong>
                  <span className="text-break">
                    {formData.documents.nidCopy?.name}
                  </span>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="p-3 border rounded bg-light h-100">
                  <strong className="d-block text-muted small text-uppercase mb-1">
                    Pay Order Copy
                  </strong>
                  <span className="text-break">
                    {formData.documents.payOrder?.name}
                  </span>
                </div>
              </Col>
            </Row>

            <div className="d-flex justify-content-center gap-3 mt-5">
              <Button
                variant="outline-secondary"
                size="lg"
                onClick={() => {
                  setShowPreview(false);
                }}
                className="px-5"
              >
                Edit Application
              </Button>
              <Button
                variant="success"
                size="lg"
                onClick={handleFinalSubmit}
                disabled={isLoading}
                className="px-5 btn-gradient-elegant"
              >
                {isLoading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  "Confirm Submission"
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div animate="visible" variants={containerVariants}>
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
                  <div className="w-[90%] mx-auto md:w-full">
                    <Form.Group className="mb-3">
                      <FloatingLabel
                        controlId="applicantType"
                        label="Applicant Type"
                        className="floating-label-custom"
                      >
                        <Form.Select
                          {...register("applicantType")}
                          isInvalid={!!errors.applicantType}
                          className="input-hover-effect shadow-subtle"
                        >
                          <option value="">Select Type...</option>
                          <option value="General">General</option>
                          <option value="Departmental">Departmental</option>
                          <option value="CA Certified">CA Certified</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.applicantType?.message}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </div>
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
                {watch("applicantType") !== "General" &&
                  watch("applicantType") && (
                    <Col md={6}>
                      <AnimatedInput
                        label="Applicant's BIN"
                        name="bin"
                        register={register}
                        error={errors.bin}
                        placeholder="13 digits"
                      />
                    </Col>
                  )}
                <Col md={6}>
                  <AnimatedInput
                    label="NID"
                    name="nid"
                    register={register}
                    error={errors.nid}
                  />
                </Col>
                <Col md={6}>
                  <div className="w-[90%] mx-auto md:w-full">
                    <AnimatedInput
                      label="Full Name"
                      name="fullName"
                      register={register}
                      error={errors.fullName}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="w-[90%] mx-auto md:w-full">
                    <AnimatedInput
                      label="Address"
                      name="address"
                      register={register}
                      error={errors.address}
                      as="textarea"
                      rows={2}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <Form.Group className="mb-3 floating-label-group position-relative">
                        <Form.Control
                          type="date"
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : field.value || ""
                          }
                          onChange={(e) => {
                            const date = (e.target as HTMLInputElement)
                              .valueAsDate;
                            field.onChange(date);
                          }}
                          isInvalid={!!errors.dateOfBirth}
                          placeholder=" "
                          className="input-hover-effect shadow-subtle"
                        />
                        <Form.Label className="position-absolute">
                          Date of Birth <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {errors.dateOfBirth?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}
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
                <Col md={6}>
                  <AnimatedInput
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    autocomplete="email"
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
                        <Controller
                          control={control}
                          name={`education.${index}.achievementYear`}
                          render={({ field }) => (
                            <Form.Group className="mb-3 floating-label-group position-relative">
                              <Form.Control
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    (e.target as HTMLInputElement).valueAsNumber
                                  )
                                }
                                isInvalid={
                                  !!errors.education?.[index]?.achievementYear
                                }
                                placeholder=" "
                                className="input-hover-effect shadow-subtle"
                                min="1900"
                                max={new Date().getFullYear()}
                              />
                              <Form.Label className="position-absolute">
                                Year <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control.Feedback type="invalid">
                                {
                                  errors.education?.[index]?.achievementYear
                                    ?.message
                                }
                              </Form.Control.Feedback>
                            </Form.Group>
                          )}
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
                      <Col md={6}>
                        <div className="w-[90%] mx-auto md:w-full">
                          <AnimatedInput
                            label="Special Achievement"
                            name={`education.${index}.specialAchievement`}
                            register={register}
                          />
                        </div>
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
                <Col md={6} className="d-flex flex-column gap-3">
                  <FileUpload
                    label="Secondary School Certificate"
                    file={watchedFiles?.secondaryCertificate}
                    isActive={
                      activePreview.file === watchedFiles?.secondaryCertificate
                    }
                    onClick={() =>
                      setActivePreview({
                        file: watchedFiles?.secondaryCertificate,
                        label: "Secondary School Certificate",
                      })
                    }
                    onDrop={(files: File[]) =>
                      handleFileDrop("secondaryCertificate", files)
                    }
                    error={errors.documents?.secondaryCertificate}
                  />
                  <FileUpload
                    label="Highest Education Certificate"
                    file={watchedFiles?.highestCertificate}
                    isActive={
                      activePreview.file === watchedFiles?.highestCertificate
                    }
                    onClick={() =>
                      setActivePreview({
                        file: watchedFiles?.highestCertificate,
                        label: "Highest Education Certificate",
                      })
                    }
                    onDrop={(files: File[]) =>
                      handleFileDrop("highestCertificate", files)
                    }
                    error={errors.documents?.highestCertificate}
                  />
                  <FileUpload
                    label="Passport Photos"
                    file={watchedFiles?.passportPhotos}
                    isActive={
                      activePreview.file === watchedFiles?.passportPhotos
                    }
                    onClick={() =>
                      setActivePreview({
                        file: watchedFiles?.passportPhotos,
                        label: "Passport Photos",
                      })
                    }
                    onDrop={(files: File[]) =>
                      handleFileDrop("passportPhotos", files)
                    }
                    error={errors.documents?.passportPhotos}
                  />
                  <FileUpload
                    label="NID Copy"
                    file={watchedFiles?.nidCopy}
                    isActive={activePreview.file === watchedFiles?.nidCopy}
                    onClick={() =>
                      setActivePreview({
                        file: watchedFiles?.nidCopy,
                        label: "NID Copy",
                      })
                    }
                    onDrop={(files: File[]) => handleFileDrop("nidCopy", files)}
                    error={errors.documents?.nidCopy}
                  />
                  <FileUpload
                    label="Pay Order Copy"
                    file={watchedFiles?.payOrder}
                    isActive={activePreview.file === watchedFiles?.payOrder}
                    onClick={() =>
                      setActivePreview({
                        file: watchedFiles?.payOrder,
                        label: "Pay Order Copy",
                      })
                    }
                    onDrop={(files: File[]) =>
                      handleFileDrop("payOrder", files)
                    }
                    error={errors.documents?.payOrder}
                  />
                </Col>
                <Col md={6}>
                  <div
                    className="h-100 p-3 border rounded-3 bg-white shadow-sm"
                    style={{ minHeight: "400px" }}
                  >
                    {renderPreview()}
                  </div>
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
              <Col md={6}>
                <div className="w-[90%] mx-auto md:w-full">
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
                </div>
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
            disabled={!watch("declaration.agreed")}
            className="btn-gradient-elegant py-3 fw-bold"
            style={{ maxWidth: "300px", margin: "0 auto" }}
          >
            Review Application
          </Button>
        </motion.div>
      </Form>
    </motion.div>
  );
}
