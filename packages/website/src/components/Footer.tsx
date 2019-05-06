import * as React from "react";
import { FaFacebook, FaTwitter, FaGithub } from "react-icons/fa";
import { VisuallyHidden } from "reakit";
import { css } from "@emotion/core";
import { usePalette, useLighten } from "reakit-system-palette/utils";
import Anchor from "./Anchor";
import Paragraph from "./Paragraph";

const year = new Date().getFullYear();

export default function Footer() {
  const foreground = usePalette("foreground");
  const color = useLighten(foreground, 0.35);
  return (
    <footer
      css={css`
        text-align: center;
        color: ${color};
        padding: 3rem 1rem;
        a {
          color: ${color};
          &:hover {
            color: ${foreground};
          }
        }

        p {
          font-size: 0.875em;
          margin: 0;
        }
      `}
    >
      <div
        css={css`
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: min-content;
          justify-content: center;
          grid-gap: 16px;
          margin-bottom: 20px;
        `}
      >
        <Anchor href="https://facebook.com/reakitjs" target="_blank">
          <FaFacebook />
          <VisuallyHidden>Facebook</VisuallyHidden>
        </Anchor>
        <Anchor href="https://twitter.com/reakitjs" target="_blank">
          <FaTwitter />
          <VisuallyHidden>Twitter</VisuallyHidden>
        </Anchor>
        <Anchor href="https://github.com/reakit/reakit" target="_blank">
          <FaGithub />
          <VisuallyHidden>GitHub</VisuallyHidden>
        </Anchor>
      </div>
      <Paragraph>
        Released under the{" "}
        <Anchor href="https://opensource.org/licenses/MIT" target="_blank">
          MIT License
        </Anchor>
      </Paragraph>
      <Paragraph>
        Copyright © 2017-
        {year} Diego Haz
      </Paragraph>
    </footer>
  );
}
