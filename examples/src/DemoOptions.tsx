import React from "react";

import * as styles from "./DemoOptions.module.css"

export default function DemoOptions({
  handleLocation,
  handleSlackToken,
  handleSlackChannel,
}) {
  const handleChangeLocation = ({ target: { value } }) => {
    handleLocation(value);
  }

  const handleChangeSlackToken = ({ target: { value }}) => {
    handleSlackToken(value);
  }

  const handleChangeSlackChannel = ({ target: { value }}) => {
    handleSlackChannel(value);
  }

  return (
    <div>
      <h3>Component options</h3>
      <div className={styles.option}>
        <strong>Feedback modal location</strong>
        <select className={styles.input} onChange={handleChangeLocation}>
          <option value="top-left">top-left</option>
          <option value="top-middle">top-middle</option>
          <option value="top-right">top-right</option>
          <option value="bottom-left">bottom-left</option>
          <option value="bottom-middle">bottom-middle</option>
          <option value="bottom-right">bottom-right</option>
        </select>
      </div>
      <div className={styles.option}>
        <strong>Slack settings</strong>
        <p>See the Usage section in the documentation for steps on how to set up a Slack bot!</p>
        <div className={styles.formRow}>
          <h5 className={styles.formLabel}>Slack token</h5>
          <input
            className={styles.input}
            onChange={handleChangeSlackToken}
            placeholder="Paste your slack token (e.g. xoxb-1234...)"       
          />
        </div>
        <div className={styles.formRow}>
          <h5 className={styles.formLabel}>Slack channel</h5>
          <input
            className={styles.input}
            onChange={handleChangeSlackChannel}
            placeholder="e.g. #feedback-demo"
          />
        </div>
      </div>
    </div>
  )
}