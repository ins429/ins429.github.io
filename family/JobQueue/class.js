const DEFAULT_MAX_ASYNC_JOB_LIMIT = 3

export const STATUS = {
  IDLE: 'IDLE',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  ERROR: 'ERROR',
  CANCELED: 'CANCELED'
}

class JobQueue {
  constructor({ maxJobLimit } = {}) {
    this.jobs = []
    this.maxJobLimit = maxJobLimit || DEFAULT_MAX_ASYNC_JOB_LIMIT

    this.enqueue = this.enqueue.bind(this)
    this.dequeue = this.dequeue.bind(this)
    this.performJobs = this.performJobs.bind(this)
    this.perform = this.perform.bind(this)
    this.findJobById = this.findJobById.bind(this)
  }

  enqueue(job) {
    const { jobs } = this
    const performJobsOnStatusChange = () => this.performJobs()

    this.jobs = jobs.concat(job)
    job.addEventListener(`statusChange`, performJobsOnStatusChange)
    this.performJobs()
  }

  dequeue(jobId) {
    const job = this.findJobById(jobId)

    if (job) {
      job.removeEventListeners()

      this.jobs = this.jobs.filter(({ id }) => id !== jobId)
    }
  }

  performJobs() {
    const { jobs, maxJobLimit, perform } = this
    const runningJobCount = jobs.filter(
      job => job.status === STATUS.IN_PROGRESS
    ).length

    if (runningJobCount < maxJobLimit) {
      jobs.reduce((runningJobCount, job) => {
        if (runningJobCount < maxJobLimit && job.status === STATUS.IDLE) {
          perform(job.id)

          return runningJobCount + 1
        } else {
          return runningJobCount
        }
      }, runningJobCount)
    }
  }

  async perform(jobId) {
    const job = this.findJobById(jobId)

    job.prepare && job.prepare()
    try {
      const result = await job.perform()

      job.finalize && job.finalize(result)
    } catch (e) {
      job.status = STATUS.ERROR
      job.error = e
    }
    this.performJobs()
  }

  findJobById(jobId) {
    const { jobs } = this

    return jobs.find(({ id }) => jobId === id)
  }
}

export default JobQueue
