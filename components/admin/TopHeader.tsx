import { ReactNode } from 'react'

interface TopHeaderProps {
  user: {
    email: string
    firstName: string
    lastName: string
    avatarInitial: string
  }
  children?: ReactNode
}

export function TopHeader({ user, children }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-background border-b border-border px-4 md:px-6 h-16 flex items-center justify-between gap-4">

      {/* Left — mobile menu trigger */}
      <div className="flex items-center gap-3">
        {children}
        {/* <span className="text-sm text-muted-foreground hidden sm:block">
          Welcome back,{' '}
          <span className="font-semibold text-foreground">
            {user.firstName || user.email}
          </span>
        </span> */}
      </div>

      {/* Right — admin avatar */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium text-foreground leading-none">
            {user.firstName
              ? `${user.firstName} ${user.lastName}`
              : 'Admin'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[160px]">
            {user.email}
          </p>
        </div>
        <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
          {user.avatarInitial}
        </div>
      </div>

    </header>
  )
}
