import { Skeleton } from "@/components/ui/skeleton"

export default function BlueprintsLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
      <Skeleton className="mx-auto h-10 w-72 max-w-full" />
      <Skeleton className="mx-auto min-h-[420px] w-full max-w-3xl flex-1 rounded-2xl" />
    </div>
  )
}
