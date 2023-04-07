import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const SinglePostPage: NextPage = () => {
  const { isLoaded: userLoaded } = useUser();

  api.posts.getAll.useQuery();

  if (!userLoaded) {
    console.log("loading");
    return <div />;
  }
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div>Post Page</div>
      </main>
    </>
  );
};

export default SinglePostPage;
