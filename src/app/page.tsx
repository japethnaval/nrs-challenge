'use client'
import { ElevatorContext } from "@/providers/elevator.provider"
import { Elevator } from "./components/elevator/elevator.component"
import { useContext, useDeferredValue, useEffect, useState } from "react"
import { generateANumber } from "@/utils/generateANumber"

const Home = () => {
  // const TOTAL_FLOORS = Array.from({ length: 10 }, (_, i) => i + 1) // Floors 1 to 10
  const { elevator1, elevator2, elevator3, elevator4 } = useContext(ElevatorContext)
  const [requestQueue, setRequestQueue] = useState<number[]>([])
  const deferredRequestQueue = useDeferredValue(requestQueue)


  const handleClick = (floor_to: number) => {
    const elevators = [elevator1, elevator2, elevator3, elevator4]
    const floor_from = generateANumber(floor_to)
    const direction = floor_from > floor_to ? "down" : "up"
  
    console.log("Request:", { floor_from, floor_to, direction })
  
   /**
    * Find elevators already moving in the requested direction
    * We validate the direction to compare weather the elevator has passed the floor where the
    * request originated from
    **/ 
    const matchingElevators = elevators
      .filter((elevator) => 
        elevator.direction === direction &&
        (direction === "up" ? elevator.floor <= floor_from : elevator.floor >= floor_from)
      )
      .sort((a, b) => Math.abs(a.floor - floor_from) - Math.abs(b.floor - floor_from))
  
    
    /**
     * There is an moving elevator we can ride on...
     */
    if (matchingElevators.length > 0) {
      const assignedElevator = matchingElevators[0]
  
      assignedElevator.setRequests((prev) => [
        ...prev,
        { id: Date.now(), direction, status: "pending", floor_from, floor_to }
      ])
  
      console.log("Assigned to a moving elevator", assignedElevator.id, { floor_from, floor_to, direction })
      return
    }
  
    /**
     * There are no matching elevator based on the request, check for idle elevators
     */
    const idleElevator = elevators.find((elevator) => elevator.direction === "idle")
  
    if (idleElevator) {
      if (direction === "down" && idleElevator.floor < floor_from) {
        // Elevator is below the requested floor, going UP...
        idleElevator.setRequests((prev) => [
          ...prev,
          { id: Date.now(), direction: "up", status: "pending", floor_from: idleElevator.floor, floor_to: floor_from }
        ])
  
        // idleElevator.setDirection("up")
        idleElevator.setMoving(true)
  
        console.log(`Idle elevator ${idleElevator.id} moving UP first to pick up`, idleElevator.floor, "->", floor_from)
  
        // // Elevator reached the requested floor, going DOWN...
        setTimeout(() => {
          idleElevator.setDirection("down")
          idleElevator.setRequests((prev) => [
            ...prev,
            { id: Date.now(), direction: "down", status: "pending", floor_from, floor_to }
          ])
          idleElevator.setMoving(true)
  
          console.log(`Idle elevator ${idleElevator.id} now moving DOWN`, floor_from, "->", floor_to)
        }, Math.abs(floor_from - idleElevator.floor) * 20000)
  
        // return
      }
  
      /**
       * EVERYTHING WENT SMOOTH
       */
      // idleElevator.setDirection(direction)
      idleElevator.setRequests((prev) => [
        ...prev,
        { id: Date.now(), direction, status: "pending", floor_from, floor_to }
      ])
      idleElevator.setMoving(true)
  
      console.log("Assigned to an idle elevator", idleElevator.id, { floor_from, floor_to, direction })
      return
    }
  
    /**
     * There are no available elevators as of the moment, do queing
     */
    console.log("No available elevator for request. Pass it into the queue")
    setTimeout(() =>  setRequestQueue((prevQueue) => [...prevQueue, floor_from]), 12000)
   
  }


  useEffect(() => {
    console.log('SERVICE INITIALIZED ===> TRIGGERING THE QUEUE!')
    const requestInterval = setInterval(() => {
      const randomFloor = Math.floor(Math.random() * 10) + 1
      
      setRequestQueue((prevQueue) => [...prevQueue, randomFloor])
    }, 12000)
  
    return () => clearInterval(requestInterval)
  }, [])

  
  useEffect(() => {
    if (deferredRequestQueue.length > 0) {
      const nextFloor = deferredRequestQueue[0]
      handleClick(nextFloor)
      setRequestQueue((prevQueue) => prevQueue.slice(1))
    }
  }, [deferredRequestQueue])

  return (
    <div className="flex gap-8">
      <div className="flex gap-4 flex-col">
        <Elevator {...elevator1} />
        <Elevator {...elevator2} />
        <Elevator {...elevator3} />
        <Elevator {...elevator4} />
      </div>

      {/* <div className="flex gap-4 flex-col-reverse">
        {TOTAL_FLOORS.map((floor) => (
          <button
            key={floor}
            onClick={() => handleClick(floor)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Floor {floor}
          </button>
        ))}
      </div> */}
    </div>
  )
}

export default Home
