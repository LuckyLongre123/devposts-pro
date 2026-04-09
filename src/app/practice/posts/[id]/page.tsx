import { notFound, redirect } from "next/navigation";
import PostDisplay from "../../../dashboard/posts/PostDisplay";

export const revalidate = 60;
export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        next: { revalidate: 60 },
      },
    );

    if (res.status === 404) notFound();

    if (!res.ok) throw new Error(); // Trigger the catch block

    const post = await res.json();
    return <PostDisplay initialPost={post} />;
  } catch (error) {
    redirect("/posts?error=fetch_failed");
  }
}
