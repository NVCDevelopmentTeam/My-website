const SUBSCRIBE_API_ENDPOINT = process.env.SUBSCRIBE_API_ENDPOINT; // e.g. https://mywebsite.com/api/subscribe

export async function post(url, data) {
  const response = await fetch(SUBSCRIBE_API_ENDPOINT + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return response.json();
}
