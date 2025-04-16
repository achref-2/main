import React, { useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// Styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    marginBottom: 2,
  },
});

// PDF Document Component
const CVDocument = ({ cvData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Personal Information</Text>
        <Text style={styles.text}>Name: {cvData.name}</Text>
        <Text style={styles.text}>Email: {cvData.email}</Text>
        <Text style={styles.text}>Phone: {cvData.phone}</Text>
        <Text style={styles.text}>LinkedIn: {cvData.linkedin}</Text>
        <Text style={styles.text}>GitHub: {cvData.github}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Education</Text>
        {cvData.education.map((edu, index) => (
          <Text key={index} style={styles.text}>
            {edu.degree} - {edu.institution} ({edu.year})
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Experience</Text>
        {cvData.experience.map((exp, index) => (
          <Text key={index} style={styles.text}>
            {exp.role} at {exp.company} ({exp.duration})
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Skills</Text>
        <Text>{cvData.skills.join(", ")}</Text>
      </View>
    </Page>
  </Document>
);

// CV Builder Component
const CVBuilder = () => {
  const [cvData, setCvData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    education: [{ degree: "", institution: "", year: "" }],
    experience: [{ role: "", company: "", duration: "" }],
    skills: [],
  });

  const handleChange = (e, section, index = null) => {
    if (section === "skills") {
      setCvData({ ...cvData, skills: e.target.value.split(",") });
    } else if (index !== null) {
      const updatedSection = [...cvData[section]];
      updatedSection[index][e.target.name] = e.target.value;
      setCvData({ ...cvData, [section]: updatedSection });
    } else {
      setCvData({ ...cvData, [e.target.name]: e.target.value });
    }
  };

  const addSectionItem = (section) => {
    setCvData({
      ...cvData,
      [section]: [...cvData[section], { degree: "", institution: "", year: "" }],
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CV Builder</h1>

      <div>
        <h2>Personal Information</h2>
        <input
          name="name"
          placeholder="Name"
          value={cvData.name}
          onChange={(e) => handleChange(e)}
        />
        <input
          name="email"
          placeholder="Email"
          value={cvData.email}
          onChange={(e) => handleChange(e)}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={cvData.phone}
          onChange={(e) => handleChange(e)}
        />
        <input
          name="linkedin"
          placeholder="LinkedIn"
          value={cvData.linkedin}
          onChange={(e) => handleChange(e)}
        />
        <input
          name="github"
          placeholder="GitHub"
          value={cvData.github}
          onChange={(e) => handleChange(e)}
        />
      </div>

      <div>
        <h2>Education</h2>
        {cvData.education.map((edu, index) => (
          <div key={index}>
            <input
              name="degree"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleChange(e, "education", index)}
            />
            <input
              name="institution"
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => handleChange(e, "education", index)}
            />
            <input
              name="year"
              placeholder="Year"
              value={edu.year}
              onChange={(e) => handleChange(e, "education", index)}
            />
          </div>
        ))}
        <button onClick={() => addSectionItem("education")}>Add Education</button>
      </div>

      <div>
        <h2>Experience</h2>
        {cvData.experience.map((exp, index) => (
          <div key={index}>
            <input
              name="role"
              placeholder="Role"
              value={exp.role}
              onChange={(e) => handleChange(e, "experience", index)}
            />
            <input
              name="company"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => handleChange(e, "experience", index)}
            />
            <input
              name="duration"
              placeholder="Duration"
              value={exp.duration}
              onChange={(e) => handleChange(e, "experience", index)}
            />
          </div>
        ))}
        <button onClick={() => addSectionItem("experience")}>Add Experience</button>
      </div>

      <div>
        <h2>Skills</h2>
        <input
          placeholder="Comma-separated skills"
          value={cvData.skills.join(",")}
          onChange={(e) => handleChange(e, "skills")}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <PDFDownloadLink
          document={<CVDocument cvData={cvData} />}
          fileName="cv.pdf"
        >
          {({ loading }) =>
            loading ? "Preparing document..." : "Download CV as PDF"
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default CVBuilder;
