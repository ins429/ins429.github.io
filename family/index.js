import React, { Fragment, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import FolderIcon from '@material-ui/icons/FolderOutlined'

const lsUrl = 'https://ins429.dynu.net:60429/family/ls'
const mkdirUrl = 'https://ins429.dynu.net:60429/family/mkdir'
const baseUrl = 'https://ins429.dynu.net:60429/family/images'
const buildImgUrl = filename => `${baseUrl}/${filename}`
const urlParams = new URLSearchParams(window.location.search)
const admin = urlParams.get('admin')
const timestamp = () => new Date().getTime()
const buildFolderUrl = dir =>
  `https://ins429.dynu.net:60429/family/${dir}/images`

const Image = ({ img, setSelectedImg }) => (
  <Paper>
    <img
      width="100%"
      src={buildImgUrl(img)}
      alt={img}
      onClick={() => setSelectedImg(img)}
    />
  </Paper>
)

const Family = () => {
  const [filename, setFilename] = useState('')
  const [images, setImages] = useState([])
  const [folders, setFolders] = useState([])
  const [selectedImg, setSelectedImg] = useState(null)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [folderName, setFolderName] = useState('')

  useEffect(() => {
    const fetchFolders = async () => {
      const {
        data: { data: folders }
      } = await axios.get(lsUrl)

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
        const {
          data: { files }
        } = await axios.get(folderUrl)

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
    <div style={{ margin: '10px' }}>
      Ethan Suyeon Lee
      <Grid container spacing={24}>
        {folders.map(folder => (
          <Grid key={folder} item xs={4} md={3} lg={2}>
            <div onClick={() => setSelectedFolder(folder)}>
              <FolderIcon />
              {folder}
            </div>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={24}>
        {images.map(img => (
          <Grid key={img} item xs={4} md={3} lg={2}>
            <Image img={img} setSelectedImg={setSelectedImg} />
            {admin && (
              <form action={buildImgUrl(img) + '/delete'}>
                <IconButton size="small" aria-label="Delete">
                  <DeleteIcon />
                </IconButton>
              </form>
            )}
          </Grid>
        ))}
      </Grid>
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
      <Dialog
        fullWidth
        maxWidth="lg"
        open={!!selectedImg}
        onClose={() => setSelectedImg(null)}
      >
        <DialogContent>
          <Paper>
            <img
              height="100%"
              width="100%"
              src={buildImgUrl(selectedImg)}
              alt={selectedImg}
              style={{ objectFit: 'contain' }}
            />
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setSelectedImg(images[images.indexOf(selectedImg) - 1])
            }
            color="primary"
          >
            Prev
          </Button>
          <Button
            onClick={() =>
              setSelectedImg(images[images.indexOf(selectedImg) + 1])
            }
            color="primary"
          >
            Next
          </Button>
          <Button onClick={() => setSelectedImg(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

ReactDOM.render(<Family />, document.getElementById('root'))
