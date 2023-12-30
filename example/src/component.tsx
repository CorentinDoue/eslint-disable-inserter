import React from "react"

export const MyComponent = () => {
  let count = 0
  count += 1
  const messages: any = undefined
  return (
    <div>
      <h1>MyComponent</h1>
      <p>Count: {count + messages.myMessage}</p>
      {/* eslint-disable-next-line eqeqeq -- FIXME */}
      <p>Is Zero: {count == 0 ? messages.yes : messages.no}</p>
    </div>
  )
}
