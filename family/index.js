import React, { Fragment, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

const baseUrl = 'https://ins429.dynu.net:60429/family/images'
// const baseUrl = 'http://localhost:60429/family/images'
const buildImgUrl = filename => `${baseUrl}/${filename}`
const urlParams = new URLSearchParams(window.location.search)
const admin = urlParams.get('admin')
const timestamp = () => new Date().getTime()

const Image = ({ img }) => {
  const [open, setOpen] = useState(false)

  return (
    <Paper>
      <img
        width="200px"
        src={buildImgUrl(img)}
        alt={img}
        onClick={() => setOpen(true)}
      />
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          <Paper>
            <img height="100%" width="100%" src={buildImgUrl(img)} alt={img} />
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

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
      <Grid container spacing={24}>
        {images.map(img => (
          <Grid key={img} item>
            <Image img={img} />
            {admin && (
              <form action={buildImgUrl(img) + '/delete'}>
                <input type="submit" value="delete" />
              </form>
            )}
          </Grid>
        ))}
      </Grid>
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
  )
}

ReactDOM.render(<Family />, document.getElementById('root'))
