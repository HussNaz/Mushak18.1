"use client";

import ApplicationForm from "@/components/applicant/ApplicationForm";
import { motion } from "framer-motion";

export default function ApplicationPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="header-container"
      >
        <h2 className="mb-0 fw-bold">
          Application for VAT Consultant License (Mushak 18.1)
        </h2>
      </motion.div>
      <ApplicationForm />
    </div>
  );
}
