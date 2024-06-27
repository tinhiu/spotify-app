import React from 'react'

type TrackPageProps = {
  params: {
    trackId: string
  }
}

const TrackPage = ({ params: { trackId } }: TrackPageProps) => {
  console.log(trackId)
  return (
    <div>TrackPage</div>
  )
}

export default TrackPage