import React, { useState } from "react";
import ResumeForm from "../components/ResumeForm";
import ResumePreview from "../components/ResumePreview";
import PDFDownloadButton from "../components/PDFDownloadButton";

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState(null);

  return (
    <div>
      <ResumeForm onUpdate={setResumeData} />
      <ResumePreview data={resumeData} />
      {resumeData && <PDFDownloadButton data={resumeData} />}
    </div>
  );
};

export default ResumeBuilder;
