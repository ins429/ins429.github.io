import React, { Fragment, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import FolderIcon from '@material-ui/icons/FolderOutlined'
import GridContainer from './GridContainer'
import NavBar from './NavBar'
import { admin, timestamp } from './utils'

const baseUrl = 'https://ins429.dynu.net:60429/family/images'
const buildImgUrl = filename => `${baseUrl}/${filename}`
const buildFolderUrl = dir => `https://ins429.dynu.net:60429/family/images`

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

const Images = ({ folder, images, handleBackClick }) => {
  const [selectedImg, setSelectedImg] = useState(null)
  const [filename, setFilename] = useState('')

  return (
    <Fragment>
      <NavBar title="Ethan Suyeon Lee - Images">
        <Chip icon={<FolderIcon />} label={folder} variant="outlined" />
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBackClick}
          style={{ marginLeft: '10px' }}
        >
          Back
        </Button>
      </NavBar>
      <GridContainer>
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
      </GridContainer>
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
              images[images.indexOf(selectedImg) - 1]
                ? setSelectedImg(images[images.indexOf(selectedImg) - 1])
                : setSelectedImg(images[images.length - 1])
            }
            color="primary"
          >
            Prev
          </Button>
          <Button
            onClick={() =>
              images[images.indexOf(selectedImg) + 1]
                ? setSelectedImg(images[images.indexOf(selectedImg) + 1])
                : setSelectedImg(images[0])
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
      {admin && (
        <form
          action={buildFolderUrl(folder)}
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
          <Button size="small" variant="outlined" color="primary" type="submit">
            Upload
          </Button>
        </form>
      )}
    </Fragment>
  )
}

export default Images
