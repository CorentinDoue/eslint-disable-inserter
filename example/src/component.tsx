import React from "react"

export const MyComponent = () => {
  let count = 0
  count += 1
  const messages: any = undefined
  return (
    <div>
      <h1
        // @ts-ignore
        arg1={1}
        // eslint-disable-next-line react/no-unknown-property
        arg2={() => {
          count += messages.toto
          return (
            <div>
              <h1>{messages.toto ?? "Fallback"}</h1>
            </div>
          )
        }}
      >
        MyComponent
      </h1>
      <p>Count: {count + messages.myMessage}</p>
      {/* eslint-disable-next-line eqeqeq -- FIXME */}
      <p>Is Zero: {count == 0 ? messages.yes : messages.no}</p>
    </div>
  )
}
