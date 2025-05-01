import * as React from "react"

// 카드 컴포넌트
export const Card = ({ className, ref, ...props }: React.ComponentPropsWithRef<"div">) => (
  <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
)

export const CardHeader = ({ className, ref, ...props }: React.ComponentPropsWithRef<"div">) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
)

export const CardTitle = ({ className, ref, ...props }: React.ComponentPropsWithRef<"h3">) => (
  <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
)

export const CardContent = ({ className, ref, ...props }: React.ComponentPropsWithRef<"div">) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
)
