import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import About, {
  projectInfo,
  teamMembers,
  getTeamSize,
  getProjectTitle,
  isHealthFeatureEnabled,
} from "../src/Components/About";
import Footer from "../src/Components/Footer";

describe("About component", () => {
  it("renders the About heading", () => {
    render(<About />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(/about health guide/i);
  });

  it("shows the project description text", () => {
    render(<About />);
    const text = screen.getByText(/helps patients check symptoms/i);
    expect(text).toBeInTheDocument();
  });

  it("renders all team members in the list", () => {
    render(<About />);
    teamMembers.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("projectInfo has correct name", () => {
    expect(projectInfo.name).toBe("Health Guide");
  });

  it("getTeamSize returns correct team size", () => {
    expect(getTeamSize()).toBe(3);
  });

  it("getProjectTitle returns Health Guide", () => {
    expect(getProjectTitle()).toBe("Health Guide");
  });

  it("isHealthFeatureEnabled works correctly", () => {
    expect(isHealthFeatureEnabled("appointments")).toBe(true);
    expect(isHealthFeatureEnabled("symptom checker")).toBe(true);
    expect(isHealthFeatureEnabled("patient profile")).toBe(true);
    expect(isHealthFeatureEnabled("random feature")).toBe(false);
  });
});

describe("Footer component", () => {
  it("renders the footer element", () => {
    render(<Footer />);
    const footerElement = screen.getByRole("contentinfo");
    expect(footerElement).toBeInTheDocument();
  });

  it("shows the copyright text", () => {
    render(<Footer />);
    const text = screen.getByText(/2025 Health Guide/i);
    expect(text).toBeInTheDocument();
  });

  it("shows the team names", () => {
    render(<Footer />);
    expect(screen.getByText(/Abdalaziz/i)).toBeInTheDocument();
    expect(screen.getByText(/Hamed/i)).toBeInTheDocument();
    expect(screen.getByText(/Asama/i)).toBeInTheDocument();
  });
});
