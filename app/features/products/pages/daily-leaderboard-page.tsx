import { DateTime } from "luxon";
import type { Route } from "./+types/daily-leaderboard-page";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import { Button } from "~/common/components/ui/button";
import ProductPagination from "~/common/components/product-pagination";

const paramsSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
  day: z.coerce.number(),
});

export const meta: Route.MetaFunction = ({ params }) => {
  const urlDate = DateTime.fromObject({
    year: Number(params.year),
    month: Number(params.month),
    day: Number(params.day),
  })
    .setZone("Asia/Seoul")
    .setLocale("ko-KR");
  return [
    {
      title: `Best of ${urlDate.toLocaleString(DateTime.DATE_MED)} | wemake`,
    },
  ];
};

export const loader = ({ params }: Route.LoaderArgs) => {
  // const { year, month, day } = params;
  const { success, data:parsedData } = paramsSchema.safeParse(params);

  if (!success)
  {
    throw data(
      {
        error_code: "invalid_params",
        error_message: "Invalid params",
      },
      {
        status: 400,
      }
    );
  }

  const date = DateTime.fromObject(parsedData).setZone("Asia/Seoul");

  if (!date.isValid) {
    // throw new Error("Invalid date");
    throw data(
      {
        error_code: "invalid_date",
        error_message: "Invalid date",
      },
      {
        status: 400,
      }
    );
  }

  const today = DateTime.now().setZone("Asia/Seoul").startOf("day");
  if (date > today){
    throw data(
      {
        error_code: "future_date",
        error_message: "Future date",
      },
      {
        status: 400,
      }
    );
  }

  return {
    // date,
    ...parsedData,
  }
}

export default function DailyLeaderboardPage({ loaderData }: Route.ComponentProps) {
  const urlDate = DateTime.fromObject({
    year: loaderData.year,
    month: loaderData.month,
    day: loaderData.day,
  });

  const previousDay = urlDate.minus({ days: 1 });
  const nextDay = urlDate.plus({ days: 1 });
  const isToday = urlDate.equals(DateTime.now().startOf("day"));

  return (
    <div className="space-y-10">
      <Hero title={`The best products of ${urlDate.toLocaleString(DateTime.DATE_MED)}`} />
      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" asChild>
          <Link to={`/products/leaderboards/daily/${previousDay.year}/${previousDay.month}/${previousDay.day}`}>
            &larr; {previousDay.toLocaleString(DateTime.DATE_SHORT)}
          </Link>
        </Button>
        {!isToday ? (
          <Button variant="secondary" asChild>
            <Link to={`/products/leaderboards/daily/${nextDay.year}/${nextDay.month}/${nextDay.day}`}>
              {nextDay.toLocaleString(DateTime.DATE_SHORT)} &rarr;
            </Link>
          </Button>
        ) : null}
      </div>
      <div className="space-y-5 w-full max-w-screen-md mx-auto">
        {Array.from({ length: 5 }).map((_, index) => (
          <ProductCard
            key={`productId-${index}`}
            id={`productId-${index}`}
            title="Product Name"
            description="Product Description"
            commentCount={12}
            viewCount={12}
            upvoteCount={120}
          />
        ))}
      </div>
      <ProductPagination totalPages={10} />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        {error.data.error_message} / {error.data.error_code}
      </div>
    );
  }

  if (error instanceof Error) {
    return <div>{error.message}</div>
  }

  return <div>Unknown error</div>
}
