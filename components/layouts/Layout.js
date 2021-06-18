import React from "react";
import Header from "./Header";
import { Global, css } from "@emotion/react";
import Head from "next/head"

const Layout = (props) => {
  return (
    <>
      <Head>
        <title>Product Hunt Firebase y Next.js</title>  
      </Head>

      <Header />
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
