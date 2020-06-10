export async function uploadFile(
  token: string,
  channel: string,
  file: File,
  message: string
): Promise<void> {
  const requestBody = new FormData();
  requestBody.append('token', token);
  requestBody.append('channels', channel);
  requestBody.append('file', file);
  requestBody.append("initial_comment", message);

  const uploadResponse = await fetch("https://slack.com/api/files.upload", {
    method: "POST",
    body: requestBody,
  });

  const uploadBody = await uploadResponse.json();
  if (!uploadBody.ok) {
    throw new Error(JSON.stringify(uploadBody));
  }
}

export async function postMessage(
  token: string,
  channel: string,
  message: string,
): Promise<void> {
  const requestBody = new FormData();
  requestBody.append("token", token);
  requestBody.append("channel", channel);
  requestBody.append("text", message);

  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    body: requestBody
  });

  const responseBody = await response.json();
  if (!responseBody.ok) {
    throw new Error(JSON.stringify(responseBody));
  }
}