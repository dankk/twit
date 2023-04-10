import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PostView } from "~/components/postview";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import Image from "next/image";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { useEffect } from "react";
import { useScrollPosition } from "~/hooks/useScrollPosition";

const ProfileFeed = (props: { userId: string }) => {
  const scrollPosition = useScrollPosition("main");

  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
    api.posts.getPosts.useInfiniteQuery(
      {
        userId: props.userId,
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  if (isLoading) return <LoadingPage />;
  if (!data) return <>Something went wrong...</>;
  const posts = data.pages.flatMap((page) => page.posts);
  if (posts.length === 0) return <>User has not posted...</>;

  return (
    <div className="flex flex-col">
      {posts.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <>No data...</>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profileImageUrl ?? ""}
            alt={`${data.username ?? ""}'s profile pic`}
            width={128}
            height={128}
            className={
              "absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-2 border-black"
            }
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.username ?? ""
        }`}</div>
        <div className="w-full border-b border-slate-400">
          <ProfileFeed userId={data.id} />
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
