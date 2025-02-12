'use client'
import { ElevatorState } from "@/providers/elevator.provider";
import { useEffect } from "react";

export const Elevator = ({id,floor, moving, direction, requests, setFloor, setMoving, setRequests, setDirection}: ElevatorState) => {


  useEffect(() => {
    if (moving) {
      const relevantRequests = requests.filter((req) => req.direction === direction);

      const largestFloorTo = relevantRequests.reduce((max, req) => Math.max(max, req.floor_to), -Infinity);
  
      const leastFloorTo = relevantRequests.reduce((min, req) => Math.min(min, req.floor_to), Infinity);
  
      const interval = setInterval(() => {
        setFloor((prevFloor: number) => {
          // stops moving until the largest floor requested
          if (direction === "up" && prevFloor < largestFloorTo) {
            return prevFloor + 1;
          // stops moving until the least floor requested
          } else if (direction === "down" && prevFloor > leastFloorTo) {
            return prevFloor - 1;
          } else {
            setMoving(false)
            setDirection('idle')
          
            setRequests((prev) => prev.filter((req) => req.floor_to !== prevFloor));

            return prevFloor;
          }
        });
      }, 10000);
  
      return () => clearInterval(interval);
    }
  }, [moving, direction, setFloor, setMoving, requests, setDirection, setRequests]);
  

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-lg w-64">
      <h1 className="text-xl font-bold">Elevator {id}</h1>
      <p> {direction === 'idle' ? 'Idle...' :  `Going ${direction}`}</p>
      <div className="text-lg">Current Floor: {floor}</div>
    </div>
  );
}