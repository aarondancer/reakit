import * as React from "react";
import { Link } from "gatsby";
import { Box } from "reakit";
import SEO from "../components/SEO";

const IndexPage = () => (
  <>
    <Box unstable_system={{ color: "primary" }}>Box</Box>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <Link to="/page-2/">Go to page 2</Link>
  </>
);

export default IndexPage;
