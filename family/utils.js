export const urlParams = new URLSearchParams(window.location.search)

export const admin = urlParams.get('admin')

export const timestamp = () => new Date().getTime()
