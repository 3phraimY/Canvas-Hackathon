import { useState, useEffect } from "react";
import { listCourses } from "../hooks/CanvasAPI";
import "./ClassView.css";

export default function ClassView() {
  const [classes, setClasses] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [colorTints, setColorTints] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      const response = await listCourses();
      const coursesData = response.data.map((course, idx) => ({
        id: course.id,
        name: course.name,
        grade: "A", // Placeholder - would come from Canvas API
        percentage: 92, // Placeholder - would come from Canvas API
        order: idx,
      }));
      setClasses(coursesData);
      
      // Initialize color tints
      const initialTints = {};
      coursesData.forEach(course => {
        initialTints[course.id] = "#3498db"; // Default blue tint
      });
      setColorTints(initialTints);
    }
    fetchCourses();
  }, []);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    if (!draggedItem) return;

    const draggedIndex = classes.findIndex(c => c.id === draggedItem.id);
    const targetIndex = classes.findIndex(c => c.id === targetItem.id);

    if (draggedIndex === targetIndex) return;

    const newClasses = [...classes];
    const [draggedClass] = newClasses.splice(draggedIndex, 1);
    newClasses.splice(targetIndex, 0, draggedClass);
    
    setClasses(newClasses);
    setDraggedItem(null);
  };

  const updateColorTint = (classId, color) => {
    setColorTints(prev => ({
      ...prev,
      [classId]: color
    }));
    setEditingId(null);
  };

  return (
    <div className="class-view">
      <h2>My Classes</h2>
      <div className="classes-grid">
        {classes.map(classItem => (
          <div
            key={classItem.id}
            className="class-box"
            draggable
            onDragStart={(e) => handleDragStart(e, classItem)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, classItem)}
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1523241749586-7158d88d84fa?w=400&h=300&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: colorTints[classItem.id],
            }}
          >
            <div 
              className="class-box-overlay"
              style={{
                backgroundColor: `${colorTints[classItem.id]}99`,
              }}
            >
              <div className="class-box-content">
                <h3 className="class-name">{classItem.name}</h3>
                <div className="class-info">
                  <div className="grade-display">
                    <span className="grade-label">Grade:</span>
                    <span className="grade-value">{classItem.grade}</span>
                  </div>
                  <div className="percentage-display">
                    <span className="percentage-label">Percentage:</span>
                    <span className="percentage-value">{classItem.percentage}%</span>
                  </div>
                </div>
                <div className="color-picker-container">
                  {editingId === classItem.id ? (
                    <div className="color-picker">
                      <input
                        type="color"
                        value={colorTints[classItem.id]}
                        onChange={(e) => updateColorTint(classItem.id, e.target.value)}
                        className="color-input"
                      />
                      <button 
                        className="color-confirm-btn"
                        onClick={() => setEditingId(null)}
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <button
                      className="color-button"
                      onClick={() => setEditingId(classItem.id)}
                    >
                      Change Color
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}