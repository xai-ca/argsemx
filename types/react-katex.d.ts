declare module 'react-katex' {
    import { Component } from 'react'

    interface InlineMathProps {
        math: string
        [key: string]: any
    }

    export class InlineMath extends Component<InlineMathProps> { }
} 