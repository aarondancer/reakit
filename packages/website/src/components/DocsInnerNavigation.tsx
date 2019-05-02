import * as React from "react";
import { unstable_useId } from "reakit/utils/useId";
import { Button } from "reakit";

type Props = {
  pathname: string;
  readmeUrl: string;
  sourceUrl: string;
  title: string;
  tableOfContents?: string;
};

export default function DocsInnerNavigation({
  sourceUrl,
  readmeUrl,
  pathname,
  title,
  tableOfContents
}: Props) {
  const id = unstable_useId();
  const ref = React.useRef<HTMLDivElement>(null);
  const [ids, setIds] = React.useState<string[]>([]);

  const html =
    tableOfContents &&
    tableOfContents
      .replace(/(<\/?p>)/gim, "")
      .replace(new RegExp(`${pathname}/?`, "gim"), "");

  React.useEffect(() => {
    if (html) {
      const matches = html.match(/href="#([^"]+)/gim);
      // const matches;
      const lol = html.match(/href="#([^"]+)/gim) || [];
      // console.log(lol);
      // setIds(matches);
    }
  }, [html]);

  // console.log(ids);

  return (
    <div ref={ref}>
      <Button as="a" href={sourceUrl}>
        View source on GitHub
      </Button>
      <Button as="a" href={readmeUrl}>
        Edit this page
      </Button>
      {html && (
        <>
          <div hidden id={id}>
            {title} sections
          </div>
          <nav
            aria-labelledby={id}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </>
      )}
    </div>
  );
}
