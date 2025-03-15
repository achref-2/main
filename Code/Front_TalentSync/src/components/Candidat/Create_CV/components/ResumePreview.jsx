import React from "react";

const ResumePreview = ({ data }) => {
  if (!data) return <p>No data yet!</p>;

  return (
    <div>
      <h1>{data.name}</h1>
      <h2>{data.jobTitle}</h2>
      <p>{data.summary}</p>
      <h3>Skills</h3>
      <ul>
        {data.skills.split(",").map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
      <h3>Experience</h3>
      <p>{data.experience}</p>
    </div>
  );
};

export default ResumePreview;
