import type { PayloadType, VariableSelected, ProgressInfo, LayoutType, ChartKey, ChartPoint } from "./types"

export type WeightInputProps = {
    wValue: number,
    setWValue: (num: number[]) => void,
    isWeightSet: boolean,
    isInvalid: boolean
}

export type VariableCheckboxProps = {
    vrbles: VariableSelected,
    handleChangeSelected: (args: any) => void

}

export type HeaderDataProps = {
    payload: PayloadType | null
}

export type ProjectLayoutProps = {
    numLayout: LayoutType,
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
    handleChangeLayout: (l: LayoutType) => void,
    numLayout: LayoutType,
    handleChangeVariableSelected: (prev: VariableSelected) => void,
    variableSelected: VariableSelected
}

export type ProgressSegmentsProps = {
    progressInfo: ProgressInfo
}

export type ModelAreaProps = {
    payload: PayloadType | null,
    layout: LayoutType
}

export type SingleChartPropsChartJS = {
    dataKey: ChartKey
    data: ChartPoint[]
    height: string
}