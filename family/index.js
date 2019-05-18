import React, { Fragment, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Loader from '@material-ui/core/CircularProgress'
import Folders from './Folders'
import Images from './Images'
import { admin, timestamp } from './utils'

const lsUrl = 'https://ins429.dynu.net:60429/family/ls'
const mkdirUrl = 'https://ins429.dynu.net:60429/family/mkdir'
const baseUrl = 'https://ins429.dynu.net:60429/family/images'
const buildFolderUrl = dir => `https://ins429.dynu.net:60429/family/images`

const Family = () => {
  const [loading, setLoading] = useState(false)
  const [filename, setFilename] = useState('')
  const [images, setImages] = useState([])
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [folderName, setFolderName] = useState('')

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true)
      const {
        data: { data: folders }
      } = await axios.get(lsUrl)

      setLoading(false)
      if (folders) {
        setFolders(folders)
      }
    }

    fetchFolders()
  }, [])
  useEffect(
    () => {
      const fetchImages = async dir => {
        const folderUrl = buildFolderUrl(dir)
        setLoading(true)
        const {
          data: { files }
        } = await axios.get(folderUrl)
        setLoading(false)

        if (files) {
          setImages(files)
        }
      }

      if (selectedFolder) {
        fetchImages(selectedFolder)
      }
    },
    [selectedFolder]
  )

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : selectedFolder ? (
        <Images
          images={images}
          folder={selectedFolder}
          handleBackClick={() => setSelectedFolder(null)}
        />
      ) : (
        <Folders
          folders={folders}
          handleFolderClick={folder => () => setSelectedFolder(folder)}
        />
      )}
      {admin && (
        <Fragment>
          <form
            action={buildFolderUrl(selectedFolder)}
            method="POST"
            encType="multipart/form-data"
          >
            <TextField
              label="filename"
              value={filename}
              onChange={({ target: { value } }) => setFilename(value)}
              margin="normal"
              variant="outlined"
            />
            <input
              id="outlined-button-file"
              accept="image/*"
              type="file"
              name="file"
              onChange={({ target: { files } }) =>
                setFilename(`${timestamp()}-${files[0].name}`)
              }
            />
            <label htmlFor="outlined-button-file">
              <Button size="small" variant="outlined" component="span">
                Browse...
              </Button>
            </label>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              type="submit"
            >
              Upload
            </Button>
          </form>
          <form action={mkdirUrl} method="POST">
            <TextField
              label="dir"
              name="dir"
              value={folderName}
              onChange={({ target: { value } }) => setFolderName(value)}
              margin="normal"
              variant="outlined"
            />
            <Button
              size="small"
              variant="outlined"
              color="primary"
              type="submit"
            >
              mkdir
            </Button>
          </form>
        </Fragment>
      )}
    </Fragment>
  )
}

ReactDOM.render(<Family />, document.getElementById('root'))
