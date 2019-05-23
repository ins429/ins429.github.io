import { STATUS } from './JobQueue'
import Job from './JobQueue/Job'

const floor = (num, places = 1) => {
  return Math.floor(num * places) / places
}

const floorToHundredth = float => floor(float, 100)

const xhrRequest = ({
  request,
  url,
  method = 'POST',
  formData,
  handleAbort,
  handleUploadProgress
}) =>
  new Promise((resolve, reject) => {
    request.addEventListener('load', resolve)
    request.addEventListener('error', reject)
    request.upload.addEventListener('progress', handleUploadProgress)
    request.addEventListener('abort', handleAbort)
    request.open(method, url)
    request.send(formData)
  })

const upload = ({
  request,
  url,
  formData,
  handleAbort,
  handleUploadProgress
}) =>
  xhrRequest({
    request,
    url,
    formData,
    handleAbort,
    handleUploadProgress
  }).then(result => result, err => ({ error: err || 'Something went wrong' }))

class UploadJob extends Job {
  constructor(args = {}) {
    super(args)

    const { filename, url, formData, progress = 0 } = args

    this.url = url
    this.filename = filename
    this.formData = formData
    this.progress = progress
    this.request = new XMLHttpRequest()

    this.abort = this.abort.bind(this)
    this.retry = this.retry.bind(this)
    this.handleAbort = this.handleAbort.bind(this)
    this.updateProgress = this.updateProgress.bind(this)
    this.handleUploadProgress = this.handleUploadProgress.bind(this)
  }

  async perform() {
    const { url, formData, request, handleAbort, handleUploadProgress } = this

    await upload({ url, formData, request, handleAbort, handleUploadProgress })

    return { result: 'ok' }
  }

  abort() {
    this.request.abort()
  }

  retry() {
    this.updateProgress(0)
    this.updateStatus(STATUS.IDLE)
  }

  handleAbort() {
    this.updateStatus(STATUS.CANCELED)
  }

  handleUploadProgress(e) {
    const progress = floorToHundredth(parseInt((e.loaded / e.total) * 100, 10))

    if (progress !== this.progress) {
      this.updateProgress(progress)
    }
  }

  updateProgress(progress) {
    this.progress = progress
    this.dispatchEvent('onProgressChange')
  }
}

export default UploadJob
