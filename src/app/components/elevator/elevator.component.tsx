'use client'
import { ElevatorState } from "@/providers/elevator.provider";
import { useEffect } from "react";

export const Elevator = ({id,floor, moving, direction, requests, setFloor, setMoving, setRequests, setDirection}: ElevatorState) => {



  useEffect(() => {
    if (moving) {
      let currentInterval = 10000;
      let interval: NodeJS.Timeout;
  
      const startInterval = () => {
        clearInterval(interval);
        interval = setInterval(() => {
          setFloor((prevFloor: number) => {
            if (requests.length === 0) {
              setMoving(false);
              setDirection("idle");
              return prevFloor;
            }
  
            const firstRequest = requests[0];
            if (direction === "idle" && firstRequest) {
              setDirection(firstRequest.floor_to > prevFloor ? "up" : "down");
              return prevFloor;
            }
  
            const relevantRequests = requests.filter(
              (req) => req.direction === direction
            );
            const largestFloorTo = relevantRequests.length
              ? Math.max(...relevantRequests.map((req) => req.floor_to))
              : prevFloor;
            const leastFloorTo = relevantRequests.length
              ? Math.min(...relevantRequests.map((req) => req.floor_to))
              : prevFloor;
  
            let conditionMet = false;
  
            if (direction === "up") {
              if (prevFloor < largestFloorTo) {
                conditionMet = requests.some(
                  (req) =>
                    req.floor_from === prevFloor + 1 ||
                    req.floor_to === prevFloor + 1
                );
                return prevFloor + 1;
              } else {
                setRequests((prev) =>
                  prev.filter((req) => req.floor_to !== prevFloor)
                );
              }
            } else if (direction === "down") {
              if (prevFloor > leastFloorTo) {
                conditionMet = requests.some(
                  (req) =>
                    req.floor_from === prevFloor - 1 ||
                    req.floor_to === prevFloor - 1
                );
                return prevFloor - 1;
              } else {
                setRequests((prev) =>
                  prev.filter((req) => req.floor_to !== prevFloor)
                );
              }
            }
  
            // Adjust interval based on condition
            if (conditionMet && currentInterval !== 20000) {
              currentInterval = 20000;
              startInterval();
            } else if (!conditionMet && currentInterval !== 10000) {
              currentInterval = 10000;
              startInterval();
            }
  
            return prevFloor;
          });
        }, currentInterval);
      };
  
      startInterval();
  
      return () => clearInterval(interval);
    }
  }, [moving, direction, floor, requests, setFloor, setMoving, setDirection, setRequests]);
  

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-lg w-64">
      <h1 className="text-xl font-bold">Elevator {id}</h1>
      <p> {direction === 'idle' ? 'Idle...' :  `Going ${direction}`}</p>
      <div className="text-lg">Current Floor: {floor}</div>
    </div>
  );
}