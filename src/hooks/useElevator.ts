'use client'
import { ElevatorQueue } from "@/providers/elevator.provider";
import { useState } from "react";

export const useElevator = (id: number) => {

      const [floor, setFloor] = useState<number>(1);
      const [moving, setMoving] = useState<boolean>(false);
      const [direction, setDirection] = useState<'up' | 'down'|'idle'>('idle');
      const [requests, setRequests] = useState<ElevatorQueue[]>([]);
      

      return {
        id,
        direction,
        moving,
        floor,
        requests,
        setRequests,
        setDirection,
        setFloor,
        setMoving
      }
}