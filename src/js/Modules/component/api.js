// Generic reusable function to fetch data from any API
// You can use this same function for any future API in this project
export async function fetchData(url) {
  try {
    let response = await fetch(url);

    // Check if the response is not ok (like 404 or 500 errors)
    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
    }

    let data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data: " + error.message);
    return null;
  }
}
