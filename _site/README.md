# simple-screenshot-feedback

[Full demo](http://www.cathykc.com/simple-screenshot-feedback/)

A simple plug and play feedback component for your website. Enable users to take screenshots of specific parts of your application and send feedback to a slack channel.

![](screenshot.gif)

## Documentation
### Installation
```
yarn install simple-screenshot-feedback
```
or
```
npm install --save simple-screenshot-feedback
```

### Usage
```
import Feedback from "simple-screenshot-feedback"

export default function SomePage() {
  return (
    <>
      ...
      <Feedback slackToken={...} slackChannel={...} handleSubmitError={...} />
    </>
  )
}
```

### Options
| Prop                | optional  | default         | type                                                                                              |
|-------------------  |---------- |---------------- |-------------------------------------------------------------------------------------------------- |
| slackToken          | false     |                 | string                                                                                            |
| slackChannel        | false     |                 | string                                                                                            |
| handleSubmitError   | false     |                 | (err: Error) => void                                                                              |
| location            | true      | "bottom-right"  | "top-left" \| "top-middle" \| "top-right" \|  <br>"bottom-left" \| "bottom-middle" \| "bottom-right"  


### SSR
This component uses the `html2canvas` library which on the `window` object being available. If you're using server-side rendering you'll want to make sure this component is only imported on client render using dynamic imports. 

Here's an example with `next/dynamic`:
```
import dynamic from "next/dynamic";
import React from "react";

const FeedbackImport = dynamic(() => import("simple-screenshot-feedback"), { ssr: false });

export default function Feedback({ slackToken, slackChannel, handleSubmitError }) {
  return (
    <FeedbackImport
      slackToken={slackToken}
      slackChannel={slackChannel}
      handleSubmitError={handleSubmitError}
    />
  );
}
```
