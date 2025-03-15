import React from "react";
import { PDFDownloadLink, Page, Text, View, Document } from "@react-pdf/renderer";

const ResumePDF = ({ data }) => (
  <Document>
    <Page>
      <View>
        <Text>{data.name}</Text>
        <Text>{data.jobTitle}</Text>
        <Text>{data.summary}</Text>
        <Text>Skills: {data.skills}</Text>
        <Text>Experience: {data.experience}</Text>
      </View>
    </Page>
  </Document>
);

const PDFDownloadButton = ({ data }) => (
  <PDFDownloadLink document={<ResumePDF data={data} />} fileName="resume.pdf">
    {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
  </PDFDownloadLink>
);

export default PDFDownloadButton;
