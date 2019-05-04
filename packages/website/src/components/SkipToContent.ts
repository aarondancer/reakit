import { css, cx } from "emotion";
import { useBox, BoxOptions, BoxProps } from "reakit";
import { unstable_createHook } from "reakit/utils/createHook";
import { unstable_createComponent } from "reakit/utils/createComponent";
import { usePalette, useDarken } from "reakit-system-palette/utils";

export type SkipToContentOptions = BoxOptions;
export type SkipToContentHTMLProps = BoxProps;
export type SkipToContentProps = SkipToContentOptions & SkipToContentHTMLProps;

export const useSkipToContent = unstable_createHook<
  SkipToContentOptions,
  SkipToContentHTMLProps
>({
  name: "SkipToContent",
  compose: useBox,

  useProps(_, htmlProps) {
    const background = usePalette("background");
    const backgroundColor = useDarken(background, 0.05);
    const foreground = usePalette("foreground");

    const skipToContent = css`
      left: -999px;
      position: absolute;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
      z-index: -999;
      &:focus,
      &:active {
        background-color: ${backgroundColor} !important;
        color: ${foreground} !important;
        left: auto;
        top: auto;
        height: auto;
        width: max-content;
        overflow: auto;
        padding: 1em;
        border: 4px solid ${foreground};
        text-align: center;
        z-index: 999;
      }
    `;
    return {
      tabIndex: 0,
      children: "Skip to content",
      href: "#content",
      ...htmlProps,
      className: cx(skipToContent, htmlProps.className)
    };
  }
});

const SkipToContent = unstable_createComponent({
  as: "a",
  useHook: useSkipToContent
});

export default SkipToContent;
