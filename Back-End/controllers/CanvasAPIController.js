const axios = require("axios");
const ical = require("ical");

const CANVAS_ACCESS_TOKEN = process.env.CANVAS_ACCESS_TOKEN;
const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL;

// Helper to extract assignment ID from uid
function extractAssignmentId(uid) {
  // uid format: event-assignment-367755
  const match = uid && uid.match(/event-assignment-(\d+)/);
  return match ? match[1] : null;
}

// extract module_item_id from event.url or event.description if present
function extractModuleItemId(event) {
  // Try to extract from url.val if present
  if (event.url && event.url.val) {
    const match = event.url.val.match(/module_item_id=(\d+)/);
    if (match) return match[1];
  }
  // extract from description if present
  if (event.description) {
    const match = event.description.match(/module_item_id=(\d+)/);
    if (match) return match[1];
  }
  return null;
}

// List all courses controller
const listCourses = async (req, res) => {
  try {
    const response = await axios.get(`${CANVAS_BASE_URL}/api/v1/courses`, {
      headers: {
        Authorization: `Bearer ${CANVAS_ACCESS_TOKEN}`,
      },
    });
    // Filter courses to only those with a calendar.ics URL
    const filteredCourses = response.data.filter(
      (course) => course.calendar && course.calendar.ics,
    );

    // For each course, parse the ical and add has_upcoming_assignments and upcoming_assignments
    const now = new Date();
    const coursesWithAssignments = await Promise.all(
      filteredCourses.map(async (course) => {
        try {
          const response = await axios.get(course.calendar.ics);
          const events = ical.parseICS(response.data);
          const upcomingEvents = Object.values(events)
            .filter(
              (e) => e.type === "VEVENT" && e.start && new Date(e.start) > now,
            )
            .map((e) => {
              const assignmentId = extractAssignmentId(e.uid);
              const moduleItemId = extractModuleItemId(e);
              let assignment_URL = null;
              if (assignmentId) {
                assignment_URL = `https://${CANVAS_BASE_URL.replace(/^https?:\/\//, "")}/courses/${course.id}/assignments/${assignmentId}`;
                if (moduleItemId) {
                  assignment_URL += `?module_item_id=${moduleItemId}`;
                }
              }
              return {
                summary: e.summary,
                description: e.description,
                start: e.start,
                end: e.end,
                location: e.location,
                url: e.url,
                uid: e.uid,
                assignment_URL,
              };
            });
          const hasUpcoming = upcomingEvents.length > 0;
          return {
            ...course,
            has_upcoming_assignments: hasUpcoming,
            upcoming_assignments: upcomingEvents,
          };
        } catch (err) {
          // If ical fetch fails, assume no upcoming assignments
          return {
            ...course,
            has_upcoming_assignments: false,
            upcoming_assignments: [],
          };
        }
      }),
    );
    res.json(coursesWithAssignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listCourses,
};
