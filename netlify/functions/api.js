const DIRECTUS_URL = "https://directus-latest-i2px.onrender.com";

exports.handler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    };
  }

  // Extract path from the function call
  let path = event.path;
  if (path.startsWith("/api")) {
    path = path.replace(/^\/api/, "");
  }
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  // Build query string if present
  const queryString = event.rawQuery || "";
  const url = `${DIRECTUS_URL}${path}${queryString ? "?" + queryString : ""}`;
  
  console.log(`Proxying ${event.httpMethod} ${path} to ${url}`);

  try {
    const fetchOptions = {
      method: event.httpMethod,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (event.headers.authorization) {
      fetchOptions.headers.Authorization = event.headers.authorization;
    }

    // Add body for POST/PUT/PATCH
    if (["POST", "PUT", "PATCH"].includes(event.httpMethod)) {
      if (event.body) {
        fetchOptions.body = event.isBase64Encoded 
          ? Buffer.from(event.body, "base64").toString()
          : event.body;
      }
    }

    const response = await fetch(url, fetchOptions);
    const text = await response.text();

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    const contentType = response.headers.get("content-type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    return {
      statusCode: response.status,
      headers,
      body: text,
    };
  } catch (error) {
    console.error("Proxy error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Proxy error", details: error.message }),
    };
  }
};
