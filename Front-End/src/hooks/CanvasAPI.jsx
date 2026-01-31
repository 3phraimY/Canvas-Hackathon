import axios from "axios";
export async function listCourses() {
  try {
    const response = await axios.get("http://localhost:3000/listCourses");
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fecting data:", error);
    return error;
  }
}
