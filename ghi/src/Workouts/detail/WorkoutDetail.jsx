import React, { useState, useEffect } from "react";
import "./WorkoutDetail.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

function WorkoutDetail() {
  const [userid, setUserid] = useState(0);
  const [workout, setWorkout] = useState({
    userid: userid,
    name: "",
    intensity: "",
    favorite: false,
  });

  const [exercises, setExercises] = useState([]);

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const workoutid = params.workoutid;

  async function loadWorkout() {
    const response = await fetch(`http://localhost:8000/workouts/${workoutid}`);
    if (response.ok) {
      const data = await response.json();
      setWorkout(data);
      setFormData(data);
    }
  }
  async function loadExercises() {
    const response = await fetch(
      `http://localhost:8000/api/${workoutid}/exerciseinstances/`
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setExercises(data.instances);
    }
  }

  const getToken = async () => {
    try {
      const loginUrl = `http://localhost:8000/token/`;
      const fetchConfig = {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
      };

      const response = await fetch(loginUrl, fetchConfig);
      const data = await response.json();
      setUserid(data.user.userid);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  console.log("exercises", exercises);
  useEffect(() => {
    loadWorkout();
    getToken();
    loadExercises();
  }, []);

  return (
    <div>
      <h1 className="title">{workout.name}</h1>
      <h3>Intensity: {workout.intensity}</h3>
      <div>
        <table>
          <thead>
            <tr
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
                justifyContent: "space-between",
              }}
            >
              <th style={{ textAlign: "start" }}>Exercises</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => {
              return (
                <Accordion key={exercise.exerciseinstanceid}>
                  <AccordionSummary>
                    <Typography>{exercise.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                        <strong>Target Muscle:</strong> {exercise.muscle}
                      </div>
                      <div>
                        <strong>Sets:</strong> {exercise.sets}
                      </div>
                      <div>
                        <strong>Reps:</strong> {exercise.reps}
                      </div>
                    </div>
                    <div
                      style={{
                        marginLeft: "auto",
                        maxWidth: "20rem",
                        textAlign: "right",
                      }}
                    >
                      <strong>Instructions:</strong> {exercise.instructions}
                    </div>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkoutDetail;