import html2canvas from 'html2canvas';
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { postMessage, uploadFile } from "./slack";
import { locationType, locationStyles } from "./location";

import sendIcon from "./img/send-icon.svg"
import checkIcon from "./img/check-icon.svg"

import * as styles from "./Feedback.module.css";

interface Props {
  slackToken: string,
  slackChannel: string,
  handleSubmitError: (err: Error) => void;
  location?: locationType;
}

interface Coordinates {
  x0: number,
  y0: number,
  x1: number,
  y1: number,
}

export default function Feedback({
  slackToken,
  slackChannel,
  handleSubmitError,
  location = "bottom-right",
}: Props): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [includeScreenshot, setIncludeScreenshot] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const [lastSelection, setLastSelection] = useState<Coordinates|null>(null);
  const [currentSelection, setCurrentSelection] = useState<Coordinates|null>(null);
  const currentSelectionRef = useRef(currentSelection);

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // if (!modalRef.current || !overlayRef);

    const handleDragging = (e: MouseEvent) => {
      if (!currentSelectionRef.current) return;
      currentSelectionRef.current.x1 = e.clientX;
      currentSelectionRef.current.y1 = e.clientY;
      setCurrentSelection(Object.assign({}, currentSelectionRef.current));
    }

    const handleStartDrag = (e: MouseEvent) => {
      currentSelectionRef.current = {
        x0: e.clientX,
        y0: e.clientY,
        x1: e.clientX,
        y1: e.clientY,
      };
      overlayRef.current?.addEventListener("mousemove", handleDragging);
    }

    const handleEndDrag = (e: MouseEvent) => {
      setLastSelection(currentSelectionRef.current);
      overlayRef.current?.removeEventListener("mousemove", handleDragging);
    }

    const preventStartDrag = (e: MouseEvent) => {
      e.stopPropagation();
    }

    const maybePreventEndDrag = (e: MouseEvent) => {
      if (!currentSelectionRef.current) {
        e.stopPropagation();
      }
    }

    const maybePreventDragging = (e: MouseEvent) => {
      if (!currentSelectionRef.current) {
        e.stopPropagation();
      }
    }

    if (includeScreenshot) {
      overlayRef.current?.addEventListener("mousedown", handleStartDrag);
      overlayRef.current?.addEventListener("mouseup", handleEndDrag);
    } else {
      setLastSelection(null);
      overlayRef.current?.removeEventListener("mousedown", handleStartDrag);
      overlayRef.current?.removeEventListener("mouseup", handleEndDrag);
    }

    modalRef.current?.addEventListener("mousedown", preventStartDrag);
    modalRef.current?.addEventListener("mouseup", maybePreventEndDrag);
    modalRef.current?.addEventListener("mousemove", maybePreventDragging);

    return () => {
      overlayRef.current?.removeEventListener("mousedown", handleStartDrag);
      overlayRef.current?.removeEventListener("mouseup", handleEndDrag);
      overlayRef.current?.removeEventListener("mousemove", handleDragging);

      modalRef.current?.removeEventListener("mousedown", preventStartDrag);
      modalRef.current?.removeEventListener("mouseup", maybePreventEndDrag);
      modalRef.current?.removeEventListener("mousemove", maybePreventDragging);
    }
  }, [
    isOpen,
    includeScreenshot,
    modalRef.current,
    overlayRef.current,
  ])

  const submitFeedback = async () => {
    setIsOpen(false);
    setIsLoading(true);

    const slackText = `📣 Feedback: ${feedbackText}`

    try {
      if (includeScreenshot) {
        const screenshotData = await takeScreenshot();
        if (!screenshotData) throw "Error taking screenshot."

        const file = new File([screenshotData], "screenshot.png");
        await uploadFile(slackToken, slackChannel, file, slackText);
      } else {
        await postMessage(slackToken, slackChannel, slackText);
      }
    } catch (e) {
      handleSubmitError(e);
      resetState();
      return;
    }

    resetState();
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 800)
  }

  const takeScreenshot = async (): Promise<Blob|null> => {
    const canvas = await html2canvas(document.body);

    let capturedCanvas: HTMLCanvasElement;

    if (lastSelection) {
      const { x0, y0, x1, y1 } = lastSelection;

      capturedCanvas = document.createElement('canvas');
      capturedCanvas.width = Math.abs(x1 - x0);
      capturedCanvas.height = Math.abs(y1 - y0);

      const croppedContext = capturedCanvas.getContext('2d');
      croppedContext?.drawImage(
        canvas,
        Math.min(x0, x1), 
        Math.min(y0, y1),
        Math.abs(x1 - x0),
        Math.abs(y1 - y0),
        0,
        0,
        Math.abs(x1 - x0),
        Math.abs(y1 - y0),
      );
    } else {
      capturedCanvas = canvas;
    }

    return new Promise((resolve, reject) => {
      capturedCanvas.toBlob((blob) => resolve(blob));
    })
  }

  useEffect(() => {
    currentSelectionRef.current = null;
    setCurrentSelection(null);
  }, [lastSelection]);


  const resetState = () => {
    setLastSelection(null);
    setIncludeScreenshot(false);
    setIsLoading(false);
  }

  const closeFeedback = () => {
    resetState();
    setIsOpen(false);
  }

  const toggleIncludeScreenshot = () => {
    setIncludeScreenshot(!includeScreenshot);
  }

  const handleFeedbackTextChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackText(value);
  }

  const renderRoot = () => {
    if (isLoading) {
      return <div className={styles.loader}><div></div><div></div><div></div></div> 
    } else if (justSubmitted) {
      return (
        <>
          <img alt="check" className={styles.submittedIcon} src={checkIcon}/>Thank you!
        </>
      )
    } else {
      return (
        <>
          <img alt="send" className={styles.feedbackIcon} src={sendIcon}/> Send feedback
        </>
      )
    }
  }

  const renderScreenshotOverlay = ({ x0, y0, x1, y1 }: Coordinates) => {
    const left = Math.min(x0, x1);
    const top = Math.min(y0, y1);
    const right = Math.max(x0, x1);
    const bottom = Math.max(y0, y1);
    const width = Math.abs(x1 - x0);
    const height = Math.abs(y1 - y0);

    return (
      <>
        <div
          className={styles.activeScreenshotOverlay}
          style={{
            height: "100vh",
            width: `${left}px`,
            top: 0,
            left: 0,
          }}
        />
        <div
          className={styles.activeScreenshotOverlay}
          style={{
            height: "100vh",
            width: `calc(100vw - ${right}px)`,
            top: 0,
            right: 0,
          }}
        />
        <div
          className={styles.activeScreenshotOverlay}
          style={{
            height: `${top}px`,
            width: `${width}px`,
            top: 0,
            left: `${left}px`,
          }}
        />
        <div
          className={styles.activeScreenshotOverlay}
          style={{
            height: `calc(100vh - ${bottom}px)`,
            width: `${width}px`,
            bottom: 0,
            left: `${left}px`,
          }}
        />
      </>
    )
  }

  const screenshotCoordinates = currentSelection || lastSelection;

  return createPortal(
    <div data-html2canvas-ignore="true">
      <div
        className={`${styles.root} ${isLoading && styles.rootLoading}`}
        onClick={() => !isLoading && setIsOpen(true)}
        style={locationStyles[location].root}
      >
        {renderRoot()}
      </div>
      {isOpen && <>
        <div ref={overlayRef}>
          <div
            className={`${styles.overlay} ${includeScreenshot && styles.overlayScreenshot}`}
            onClick={() => !includeScreenshot && closeFeedback()}
            style={{ opacity: !screenshotCoordinates ? 1 : 0 }}
          />
          {screenshotCoordinates && renderScreenshotOverlay(screenshotCoordinates)}
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            style={locationStyles[location].modal}
          > 
            <div className={styles.screenshotOption}>
              <label className={styles.switch}>
                <input
                  checked={includeScreenshot}
                  onChange={toggleIncludeScreenshot}
                  type="checkbox"
                />
                <span className={styles.slider} />
              </label>
              <div className={styles.screenshotOptionText}>Include a screenshot</div>
            </div>
            {includeScreenshot && <div className={styles.screenshotInstructions}>
              Drag to highlight part of the page.
            </div>}
            <textarea
              autoFocus={true}
              className={styles.textInput}
              onChange={handleFeedbackTextChange}
              placeholder="We’d love to hear your feedback! Tell us what you’re thinking."
              rows={4}
              value={feedbackText}
            />
            <button
              className={`${styles.btn} ${styles.submit}`}
              onClick={submitFeedback}
            >Submit</button>
            <button
              className={`${styles.btn} ${styles.cancel}`}
              onClick={closeFeedback}
            >Cancel</button>
          </div>
        </div>
      </>}
    </div>,
    document.body
  );
}