import { redirect } from 'next/navigation';

export default async function WomensWatchRedirect({ params }) {
  const { slug } = await params;
  redirect(`/watches/${slug}`);
}
