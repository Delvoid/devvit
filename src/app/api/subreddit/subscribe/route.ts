import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubredditSubscriptionValidator } from '@/lib/validators/subreddit';
import { Sub } from '@radix-ui/react-dropdown-menu';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: { userId: session.user.id, subredditId },
    });

    if (subscriptionExists) {
      return new Response('Already subscribed', { status: 409 });
    }

    await db.subscription.create({ data: { userId: session.user.id, subredditId } });

    return new Response(JSON.stringify(subredditId), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response('Could not subscribe, please try again later', { status: 500 });
  }
}