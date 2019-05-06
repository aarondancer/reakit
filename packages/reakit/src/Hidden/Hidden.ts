import * as React from "react";
import { unstable_createComponent } from "../utils/createComponent";
import { mergeProps } from "../utils/mergeProps";
import { BoxOptions, BoxProps, useBox } from "../Box/Box";
import { unstable_createHook } from "../utils/createHook";
import { useHiddenState, HiddenStateReturn } from "./HiddenState";

export type HiddenOptions = BoxOptions &
  Pick<Partial<HiddenStateReturn>, "unstable_hiddenId" | "visible"> & {
    /**
     * TODO: Description
     */
    unstable_hasTransition?: boolean;
  };

export type HiddenProps = BoxProps;

export const useHidden = unstable_createHook<HiddenOptions, HiddenProps>({
  name: "Hidden",
  compose: useBox,
  useState: useHiddenState,
  keys: ["unstable_hasTransition"],

  propsAreEqual(prev, next) {
    if (prev.visible === false && next.visible === false) {
      return true;
    }
    return null;
  },

  useProps(options, htmlProps) {
    const [delayedVisible, setDelayedVisible] = React.useState(options.visible);

    React.useEffect(() => {
      if (options.unstable_hasTransition && options.visible) {
        setDelayedVisible(options.visible);
      }
    }, [options.visible, options.unstable_hasTransition]);

    const onTransitionEnd = React.useCallback(() => {
      if (options.unstable_hasTransition && !options.visible) {
        setDelayedVisible(options.visible);
      }
    }, [options.visible, options.unstable_hasTransition]);

    return mergeProps(
      {
        role: "region",
        id: options.unstable_hiddenId,
        hidden: options.unstable_hasTransition
          ? options.visible
            ? false
            : !delayedVisible
          : !options.visible,
        "aria-hidden": options.unstable_hasTransition
          ? options.visible
            ? !delayedVisible
            : true
          : !options.visible,
        onTransitionEnd
      } as HiddenProps,
      htmlProps
    );
  }
});

export const Hidden = unstable_createComponent({
  as: "div",
  useHook: useHidden
});
