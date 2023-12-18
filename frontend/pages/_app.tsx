import "@/styles/globals.css";
import Layout from "../components/Layout";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <Layout>
      <Head>
        <title>
          Tinder For Reuse — Discover The Future of Matchmaking in the
          Construction Industry
        </title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
