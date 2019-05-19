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
import { admin } from './utils'
import ImageFormDialog from './ImageFormDialog'

const baseUrl = 'https://ins429.dynu.net:60429/family/images'
const buildImgUrl = filename => `${baseUrl}/${filename}`

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
  const [openForm, setOpenForm] = useState(false)

  return (
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
      <ImageFormDialog
        folder={folder}
        open={openForm}
        handleClose={() => setOpenForm(false)}
      />
    </Fragment>
  )
}

export default Images
