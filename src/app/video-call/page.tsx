"use client"
import dynamic from 'next/dynamic'

const DynamicVideoUI = dynamic(() => import('./VideoUiKit'), {
    ssr: false
})

export default function VideoCall() {
    return <DynamicVideoUI />
}