import * as React from "react";
import { Link } from "gatsby";
import { css, Global } from "@emotion/core";
import {
  VisuallyHidden,
  DialogDisclosure,
  useDialogState,
  Dialog,
  DialogBackdrop
} from "reakit";
import { FaGithub } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { usePalette, useFade } from "reakit-system-palette/utils";
import { LinkGetProps } from "@reach/router";
import Logo from "../icons/Logo";
import useViewportWidthGreaterThan from "../hooks/useViewportWidthGreaterThan";
import useLocation from "../hooks/useLocation";
import Anchor from "./Anchor";
import SkipToContent from "./SkipToContent";
import Spacer from "./Spacer";
import HiddenMediaQuery from "./HiddenMediaQuery";
import DocsNavigation from "./DocsNavigation";

export type HeaderProps = {
  transparent?: boolean;
};

function getLinkProps({ isPartiallyCurrent }: LinkGetProps) {
  if (isPartiallyCurrent) {
    return { "aria-current": "page" };
  }
  return {};
}

export default function Header({ transparent }: HeaderProps) {
  const isLarge = useViewportWidthGreaterThan(780);
  const background = usePalette("background");
  const foreground = usePalette("foreground");
  const primary = usePalette("primary");
  const boxShadowColor = useFade(foreground, 0.85);
  const dialog = useDialogState();
  const location = useLocation();

  React.useEffect(dialog.hide, [location.pathname]);

  return (
    <header
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 901;
        height: var(--header-height);
        box-sizing: border-box;
        ${!transparent && `box-shadow: 0 1px 2px ${boxShadowColor}`};
        background: ${background};
        display: flex;
        align-items: center;
        padding: 0 56px;

        & > *:not(:last-child) {
          margin-right: 16px;
        }
        a:not([href^="#"]) {
          display: inline-flex;
          align-items: center;
          height: calc(100% - 5px);
          color: inherit;
          font-weight: 400;
          margin-top: 5px;
          border-bottom: 5px solid transparent;
          box-sizing: border-box;
          &:not([href="/"]) {
            padding: 0 1em;
            &:hover {
              color: ${primary};
              text-decoration: none;
            }
            &[aria-current="page"] {
              color: ${primary};
              border-color: ${primary};
            }
          }
        }

        @media (max-width: 780px) {
          padding: 0 8px;
          & > *:not(:last-child) {
            margin-right: 8px;
          }
        }
      `}
    >
      <Global
        styles={css`
          :root {
            --header-height: 60px;
          }
        `}
      />
      <SkipToContent />
      <HiddenMediaQuery query="min-width: 781px">
        <DialogDisclosure
          {...dialog}
          unstable_system={{ palette: "background" }}
          css={css`
            font-size: 20px;
            padding: 8px;
            border-radius: 50%;
            border: none;
          `}
        >
          <MdMenu />
          <VisuallyHidden>Open sidebar</VisuallyHidden>
        </DialogDisclosure>
        <DialogBackdrop {...dialog} />
        <Dialog
          {...dialog}
          aria-label="Sidebar"
          unstable_hasTransition
          css={css`
            top: 0;
            left: 0;
            height: 100vh;
            margin: 0;
            max-height: initial;
            transform: translateX(0);
            transition: transform 250ms ease-in-out;
            border-radius: 0;
            &[aria-hidden="true"] {
              transform: translateX(-100%);
            }
          `}
        >
          <DocsNavigation />
        </Dialog>
      </HiddenMediaQuery>
      <Anchor as={Link} to="/">
        <Logo colored={!transparent} />
        <VisuallyHidden>Reakit</VisuallyHidden>
      </Anchor>
      <div style={{ flex: 1 }} />
      <HiddenMediaQuery query="max-width: 780px">
        {props => (
          <Anchor as={Link} to="/docs/" getProps={getLinkProps} {...props}>
            Documentation
          </Anchor>
        )}
      </HiddenMediaQuery>
      <Anchor href="https://github.com/reakit/reakit">
        <FaGithub />
        <HiddenMediaQuery query="max-width: 780px">
          <Spacer width={8} />
          GitHub
        </HiddenMediaQuery>
        {!isLarge && <VisuallyHidden>GitHub</VisuallyHidden>}
      </Anchor>
    </header>
  );
}
