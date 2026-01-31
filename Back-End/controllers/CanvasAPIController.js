const axios = require("axios");

const CANVAS_ACCESS_TOKEN = process.env.CANVAS_ACCESS_TOKEN;
const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL;

// List all courses controller
const listCourses = async (req, res) => {
  try {
    const response = await axios.get(`${CANVAS_BASE_URL}/api/v1/courses`, {
      headers: {
        Authorization: `Bearer ${CANVAS_ACCESS_TOKEN}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get assignments for a specific course
const courseAssignments = async (req, res) => {
  const { courseId } = req.params;
  try {
    const response = await axios.get(
      `${CANVAS_BASE_URL}/api/v1/courses/${courseId}/assignments`,
      {
        headers: {
          Authorization: `Bearer ${CANVAS_ACCESS_TOKEN}`,
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    console.log(`${CANVAS_BASE_URL}/api/v1/courses/${courseId}/assignments`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listCourses,
  courseAssignments,
};
