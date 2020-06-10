export type locationType = 
  "top-left" |
  "top-middle" |
  "top-right" |
  "bottom-left" |
  "bottom-middle" |
  "bottom-right";

export const locationStyles = {
  "top-left": {
    root: {
      paddingTop: "16px",
      paddingBottom: "8px",
      top: "-8px",
      left: "20px",
    },
    modal: {
      top: "46px",
      left: "20px",
    }
  },
  "top-middle": {
    root: {
      paddingTop: "16px",
      paddingBottom: "8px",
      top: "-8px",
      left: "calc((100vw / 2) - (145px / 2))",
    },
    modal: {
      top: "46px",
      left: "calc((100vw / 2) - (300px / 2))",
    }
  },
  "top-right": {
    root: {
      paddingTop: "16px",
      paddingBottom: "8px",
      top: "-8px",
      right: "20px",
    },
    modal: {
      top: "46px",
      right: "20px",
    }
  },
  "bottom-left": {
    root: {
      paddingTop: "8px",
      paddingBottom: "16px",
      bottom: "-8px",
      left: "20px",
    },
    modal: {
      bottom: "46px",
      left: "20px",
    }
  },
  "bottom-middle": {
    root: {
      paddingTop: "8px",
      paddingBottom: "16px",
      bottom: "-8px",
      left: "calc((100vw / 2) - (145px / 2))",
    },
    modal: {
      bottom: "46px",
      left: "calc((100vw / 2) - (300px / 2))",
    }
  },
  "bottom-right": {
    root: {
      paddingTop: "8px",
      paddingBottom: "16px",
      bottom: "-8px",
      right: "20px",
    },
    modal: {
      bottom: "46px",
      right: "20px",
    }
  },
}