import React, { Fragment, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const baseUrl = 'https://ins429.ddns.net:60429/family/images'
// const baseUrl = 'http://localhost:60429/family/images'
const buildImgUrl = filename => `${baseUrl}/${filename}`
const urlParams = new URLSearchParams(window.location.search)
const admin = urlParams.get('admin')
const timestamp = () => new Date().getTime()

const Family = () => {
  const [filename, setFilename] = useState('')
  const [images, setImages] = useState([])
  useEffect(() => {
    const fetchImages = async () => {
      const {
        data: { files }
      } = await axios.get(baseUrl)

      if (files) {
        setImages(files)
      }
    }

    fetchImages()
  }, [])

  return (
    <div>
      Ethan Suyeon Lee
      <div>
        {images.map(img => (
          <Fragment>
            <a key={img} href={buildImgUrl(img)}>
              <img width="200px" src={buildImgUrl(img)} alt={img} />
            </a>
            {admin && (
              <form action={buildImgUrl(img) + '/delete'}>
                <input type="submit" value="delete" />
              </form>
            )}
          </Fragment>
        ))}
        {admin && (
          <form action={baseUrl} method="POST" encType="multipart/form-data">
            <input
              type="text"
              name="filename"
              value={filename}
              onChange={({ target: { value } }) => setFilename(value)}
            />
            <input
              type="file"
              name="file"
              onChange={({ target: { files } }) =>
                setFilename(`${timestamp()}-${files[0].name}`)
              }
            />
            <input type="submit" value="submit" />
          </form>
        )}
      </div>
    </div>
  )
}

ReactDOM.render(<Family />, document.getElementById('root'))
