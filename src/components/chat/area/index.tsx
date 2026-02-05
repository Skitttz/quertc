'use client'

import { ChatAreaEmpty } from "./empty"

export function ChatArea() {
  const isUnselectedChat = true

  if (isUnselectedChat) {
    return <ChatAreaEmpty />
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="border h-[85vh]" />
    </div>
  )
}
