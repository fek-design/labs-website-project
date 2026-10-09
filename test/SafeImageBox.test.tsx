import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SafeImageBox } from "@/components/landing/SafeImageBox";

describe("SafeImageBox Component Resilience & Fallback Tests", () => {
  it("renders next/image when a valid src is provided", () => {
    render(
      <SafeImageBox
        src="/images/craft/hero-tshirts.png"
        alt="T-shirt prototype"
        width={300}
        height={300}
      />
    );

    const img = screen.getByAltText("T-shirt prototype");
    expect(img).toBeDefined();
    expect(img.tagName).toBe("IMG");
  });

  it("renders tactile fallback container when src is null or missing", () => {
    render(
      <SafeImageBox
        src={null}
        alt="Missing equipment image"
        fallbackLabel="Ingen billede"
        fallbackIcon="image"
      />
    );

    const fallbackBox = screen.getByRole("img", { name: "Missing equipment image" });
    expect(fallbackBox).toBeDefined();
    expect(screen.getByText("Ingen billede")).toBeDefined();
  });

  it("renders default cube icon when fallbackIcon is not specified", () => {
    render(
      <SafeImageBox
        src=""
        alt="Equipment placeholder"
        fallbackLabel="Prusa MK4"
      />
    );

    const fallbackBox = screen.getByRole("img", { name: "Equipment placeholder" });
    expect(fallbackBox).toBeDefined();
    expect(screen.getByText("Prusa MK4")).toBeDefined();
  });

  it("switches to fallback UI when image trigger onError event", () => {
    render(
      <SafeImageBox
        src="/broken/path/to/asset.png"
        alt="Broken asset item"
        fallbackLabel="Asset Error"
        width={200}
        height={200}
      />
    );

    // Initial render shows image element
    const img = screen.getByAltText("Broken asset item");
    expect(img).toBeDefined();

    // Trigger image loading failure
    fireEvent.error(img);

    // Should now render the fallback container
    const fallbackBox = screen.getByRole("img", { name: "Broken asset item" });
    expect(fallbackBox).toBeDefined();
    expect(screen.getByText("Asset Error")).toBeDefined();
  });
});
