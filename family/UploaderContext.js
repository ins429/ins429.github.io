import React, { createContext, useState } from 'react'
import JobQueue from './JobQueue/index'
import UploadJob from './UploadJob'

const UploaderContext = createContext()

export const UploaderManager = ({ children }) => {
  const { jobs, enqueue, dequeue } = JobQueue
  const [lastTouchedAt, touch] = useState(null)
  const reload = () => touch(new Date().getTime())

  return (
    <UploaderContext.Provider
      lastTouchedAt={lastTouchedAt}
      value={{
        jobs,
        enqueue: job => {
          enqueue(job)
          job.addEventListener('statusChange', reload)
          job.addEventListener('onProgressChange', reload)
          reload()
        },
        dequeue: jobId => {
          dequeue(jobId)
          reload()
        },
        reload
      }}
    >
      {children}
    </UploaderContext.Provider>
  )
}

export default UploaderContext
