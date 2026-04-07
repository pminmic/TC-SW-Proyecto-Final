import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type LayoutCardProps = {
  title: string
  description?: string
  content?: React.ReactNode
}

export function LayoutCard({
  title,
  description,
  content,
}: LayoutCardProps) {
  return (
    <div className="h-full w-full p-2">
      <Card className="h-full rounded-2xl">
        <CardHeader>
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>

          <CardAction className="flex items-center gap-2">
            <Badge variant="secondary">Panel</Badge>
            <Button size="sm" variant="outline">
              Acción
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="h-[calc(100%-88px)] overflow-auto">
          {content ?? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
              Contenido del panel
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}