import React from "react";
import { render, screen } from "@testing-library/react";

import { Layout } from "./Layout";

describe("<Layout />", () => {
  it("renders", () => {
    render(<Layout>test</Layout>);
  });
});
