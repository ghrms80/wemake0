import { DateTime } from "luxon";
import type { Route } from "./+types/daily-leaderboard-page";
import { data, isRouteErrorResponse } from "react-router";
import { z } from "zod";

const paramsSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
  day: z.coerce.number(),
});

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
    date,
  }
}

export default function DailyLeaderboardPage({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Daily Leaderboard Page</h1>
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
