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
        <title>Rondas — Discover The Future of Secondhand</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
