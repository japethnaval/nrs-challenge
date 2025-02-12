
'use client'
import { useElevator } from '@/hooks/useElevator'
import { createContext, Dispatch, ReactNode, SetStateAction } from 'react'

export interface ElevatorState  {
    id: number,
    floor: number,
    moving: boolean,
    direction: 'up' | 'down' | 'idle',
    requests: ElevatorQueue[]
    setRequests: Dispatch<SetStateAction<ElevatorQueue[]>>
    setFloor: Dispatch<SetStateAction<number>>
    setMoving: Dispatch<SetStateAction<boolean>>
    setDirection: Dispatch<SetStateAction<'up' | 'down' | 'idle'>>
}

export interface ElevatorQueue {
  id: number
  direction: 'up' | 'down',
  status: 'pending' | 'fulfilled'
  floor_from: number
  floor_to: number
}

export interface ElevatorContextProps  {
  elevator1: ElevatorState
  elevator2: ElevatorState
  elevator3: ElevatorState
  elevator4: ElevatorState
}

export const ElevatorContext = createContext<ElevatorContextProps>(
  {} as ElevatorContextProps,
)

export const ElevatorProvider = ({
  children,
}: {
  children: ReactNode
}) => {
    const elevator1 = useElevator(1)
    const elevator2 = useElevator(2)
    const elevator3 = useElevator(3)
    const elevator4 = useElevator(4)


  return (
    <ElevatorContext.Provider
      value={{
        elevator1,
        elevator2,
        elevator3,
        elevator4
      }}
    >
      {children}
    </ElevatorContext.Provider>
  )
}
