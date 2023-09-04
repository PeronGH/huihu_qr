import type { HtmlEscaped, HtmlEscapedString } from "hono/utils/html.ts";

export type Children =
  | string
  | HtmlEscapedString
  | HtmlEscapedString[];

export interface PropsWithChildren {
  children?: Children;
}

// deno-lint-ignore ban-types
export type FC<P = {}> = (props: P & PropsWithChildren) => HtmlEscaped;
