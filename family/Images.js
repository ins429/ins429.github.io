import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import TextField from '@material-ui/core/TextField'
import Loader from '@material-ui/core/CircularProgress'
import Chip from '@material-ui/core/Chip'
import FolderIcon from '@material-ui/icons/FolderOutlined'
import GridContainer from './GridContainer'
import NavBar from './NavBar'
import ImageFormDialog from './ImageFormDialog'
import { UploaderManager } from './UploaderContext'

const styles = {
  imageDialog: {
    background: 'black'
  }
}

const baseUrl = 'https://ins429.dynu.net:60429/family'
const buildImgUrl = (folder, filename) => `${baseUrl}/${folder}/${filename}`
const buildThumbnail = filename => {
  const tokens = filename.split('.')

  return [...tokens.slice(0, -1), 'thumb', tokens[tokens.length - 1]].join('.')
}
const buildFullImageUrl = (folder, filename) => {
  if (!filename) {
    return ''
  }
  const tokens = filename.split('.')

  return `${baseUrl}/${folder}/${tokens
    .filter(token => token !== 'thumb')
    .join('.')}`
}
const buildFolderUrl = folder =>
  `https://ins429.dynu.net:60429/family/${folder}/images`

const Image = ({ folder, img, setSelectedImg }) => (
  <Paper>
    <img
      width="100%"
      src={buildImgUrl(folder, img)}
      alt={img}
      onClick={() => setSelectedImg(img)}
    />
  </Paper>
)

const Images = ({
  match: {
    params: { folder }
  },
  admin,
  classes
}) => {
  const [selectedImg, setSelectedImg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [images, setImages] = useState([])

  useEffect(() => {
    const fetchImages = async () => {
      const folderUrl = buildFolderUrl(folder)
      setLoading(true)
      const {
        data: { data }
      } = await axios.get(folderUrl)
      setLoading(false)

      if (data) {
        setImages(data)
      }
    }

    fetchImages()
  }, [])

  return loading ? (
    <Loader />
  ) : (
    <UploaderManager>
      <NavBar title="Images">
        <Chip icon={<FolderIcon />} label={folder} variant="outlined" />
        {admin && (
          <IconButton
            color="primary"
            onClick={() => setOpenForm(true)}
            style={{ marginLeft: '10px' }}
            size="small"
          >
            <AddAPhotoIcon />
          </IconButton>
        )}
        <IconButton
          size="small"
          aria-label="Back"
          color="primary"
          style={{ marginLeft: '10px' }}
          component={Link}
          to={admin ? '/admin' : '/'}
        >
          <ArrowBackIcon />
        </IconButton>
      </NavBar>
      <GridContainer>
        {images.filter(img => img.indexOf('.thumb') > -1).map(img => (
          <Grid key={img} item xs={4} md={3} lg={2}>
            <Image folder={folder} img={img} setSelectedImg={setSelectedImg} />
            {admin && (
              <form
                action={buildImgUrl(folder, img)}
                onSubmit={e => {
                  e.preventDefault()
                  const password = window.prompt('Password?')
                  axios.delete(`${buildFullImageUrl(folder, img)}`, {
                    data: { password }
                  })
                  setImages(images.filter(image => image !== img))
                }}
              >
                <IconButton size="small" aria-label="Delete" type="submit">
                  <DeleteIcon />
                </IconButton>
              </form>
            )}
          </Grid>
        ))}
      </GridContainer>
      <Dialog
        fullScreen
        open={!!selectedImg}
        onClose={() => setSelectedImg(null)}
      >
        <DialogContent className={classes.imageDialog}>
          <img
            height="100%"
            width="100%"
            src={buildFullImageUrl(folder, selectedImg)}
            alt={selectedImg}
            style={{ objectFit: 'contain' }}
          />
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
      <ImageFormDialog
        folder={folder}
        open={openForm}
        handleClose={() => setOpenForm(false)}
        handleImageUpload={filename =>
          setTimeout(
            () => setImages(images.concat(buildThumbnail(filename))),
            3000
          )
        }
      />
    </UploaderManager>
  )
}

export default withStyles(styles)(Images)
