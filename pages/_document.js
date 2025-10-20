import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="h-full">
      <Head>
        {/* Prevent flash on load */}
        <meta name="color-scheme" content="dark light" />
      </Head>
      <body className="h-full m-0 bg-[#1a1a40] text-white overflow-x-hidden overflow-y-auto antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
