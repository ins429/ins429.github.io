import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import Loader from '@material-ui/core/CircularProgress'
import Chip from '@material-ui/core/Chip'
import FolderIcon from '@material-ui/icons/FolderOutlined'
import GridContainer from './GridContainer'
import NavBar from './NavBar'
import { admin } from './utils'
import ImageFormDialog from './ImageFormDialog'

const baseUrl = 'https://ins429.dynu.net:60429/family'
const buildImgUrl = (folder, filename) => `${baseUrl}/${folder}/${filename}`
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
  }
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
    <Fragment>
      <NavBar title="Ethan Suyeon Lee - Images">
        <Chip icon={<FolderIcon />} label={folder} variant="outlined" />
        {admin && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenForm(true)}
            style={{ marginLeft: '10px' }}
          >
            New Image
          </Button>
        )}
        <Button
          variant="outlined"
          color="primary"
          style={{ marginLeft: '10px' }}
          component={Link}
          to="/"
        >
          Back
        </Button>
      </NavBar>
      <GridContainer>
        {images.map(img => (
          <Grid key={img} item xs={4} md={3} lg={2}>
            <Image folder={folder} img={img} setSelectedImg={setSelectedImg} />
            {admin && (
              <form action={buildImgUrl(folder, img) + '/delete'}>
                <IconButton size="small" aria-label="Delete" type="submit">
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
              src={buildImgUrl(folder, selectedImg)}
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
      <ImageFormDialog
        folder={folder}
        open={openForm}
        handleClose={() => setOpenForm(false)}
      />
    </Fragment>
  )
}

export default Images
