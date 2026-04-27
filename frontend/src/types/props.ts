import type { PayloadType, VariableSelected } from "./types"

export type WeightInputProps = {
    wValue: number,
    setWValue: (num: number[]) => void,
    isWeightSet: boolean,
    isInvalid: boolean
}

export type VariableCheckboxProps = {
    voltageCheck: boolean,
    accelerationCheck: boolean,
    velocityCheck: boolean,
    forceCheck: boolean,
    intensityCheck: boolean,
    handleChangeSelected: (args: any) => void
}

export type HeaderDataProps = {
    payload: PayloadType | null
}

export type ProjectLayoutProps = {
  numLayout: number,
  variableSelected: VariableSelected
}

export type ChartsAreaProps = {
    variableSelected: VariableSelected,
    payload: PayloadType[]
}

export type MessageAreaProps = {
    messages: [string, string][]
}

export type MessageContentProps = {
    type: string,
    content: string
}

export type ButtonAreaProps = {
    wValue: number[],
    setWValue: (num: number[]) => void,
    isWeightSet: boolean,
    handleSetWeight: () => void,
    handleReset: () => void
}

export type ProjectSidebarProps = {
    handleChangeLayout: (num: number) => void,
    numLayout: number,
    handleChangeVariableSelected: (prev: VariableSelected) => void,
    variableSelected: VariableSelected
}