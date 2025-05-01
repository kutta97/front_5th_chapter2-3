import * as React from "react"

// 테이블 컴포넌트
export const Table = ({ className, ref, ...props }: React.ComponentPropsWithRef<"table">) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={`table-fixed w-full caption-bottom text-sm ${className}`} {...props} />
  </div>
)

export const TableHeader = ({ className, ref, ...props }: React.ComponentPropsWithRef<"thead">) => (
  <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
)

export const TableBody = ({ className, ref, ...props }: React.ComponentPropsWithRef<"tbody">) => (
  <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
)

export const TableRow = ({ className, ref, ...props }: React.ComponentPropsWithRef<"tr">) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
    {...props}
  />
)

export const TableHead = ({ className, ref, ...props }: React.ComponentPropsWithRef<"th">) => (
  <th
    ref={ref}
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
)

export const TableCell = ({ className, ref, ...props }: React.ComponentPropsWithRef<"td">) => (
  <td ref={ref} className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
)
