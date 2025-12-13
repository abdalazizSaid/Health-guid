import React from "react";

export const projectInfo = {
  name: "Health Guide",
  version: "1.0.0",
  description:
    "Health Guide is a web application that helps patients check symptoms, book appointments and manage their health in one place",
};

export const teamMembers = ["Abdalaziz", "Hamed", "Asama"];

export const getTeamSize = () => teamMembers.length;

export const getProjectTitle = () => projectInfo.name;

export const isHealthFeatureEnabled = (featureName) => {
  if (!featureName) return false;
  const enabled = ["appointments", "symptom checker", "patient profile"];
  return enabled.includes(featureName.toLowerCase());
};

const About = () => {
  return (
    <div className="about-page container py-4">
      <h2 className="mb-3">About Health Guide</h2>
      <p className="mb-2">{projectInfo.description}</p>
      <p className="mb-2">Current version {projectInfo.version}</p>
      <h4 className="mt-3 mb-2">Project Team</h4>
      <ul>
        {teamMembers.map((member) => (
          <li key={member}>{member}</li>
        ))}
      </ul>
    </div>
  );
};

export default About;
