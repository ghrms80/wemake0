import { Link } from "react-router";
import { Card, CardContent, CardFooter, CardHeader } from "~/common/components/ui/card";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";

interface TeamCardProps {
  id: string;
  leaderUsername: string;
  leaderAvatarUrl: string;
  leaderAvatarFallback: string;
  positions: string[];
  projectDescription: string;
}

export function TeamCard({
  id,
  leaderUsername,
  leaderAvatarUrl,
  leaderAvatarFallback,
  positions,
  projectDescription,
}: TeamCardProps) {
  return (
    <Link to={`/teams/${id}`}>
      <Card className="bg-transparent hover:bg-card/50 transition-colors">
        <CardHeader>
          <div className="space-y-4">
            <Badge variant="secondary" className="inline-flex items-center gap-2">
              <span>@{leaderUsername}</span>
              <Avatar className="size-5">
                <AvatarImage src={leaderAvatarUrl} />
                <AvatarFallback>{leaderAvatarFallback}</AvatarFallback>
              </Avatar>
            </Badge>
            <span className="text-muted-foreground">is looking for</span>{' '}
            <p className="">
              {positions.map((position, index) => (
                <span key={position}>
                  <Badge variant="default" className="text-base font-normal">
                    {position}
                  </Badge>
                  {index < positions.length - 1 && <span>, </span>}
                </span>
              ))}
              <span className="text-muted-foreground"> to build {projectDescription}</span>
            </p>
          </div>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button variant="link">
            Join team &rarr;
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}