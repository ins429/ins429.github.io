import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

const mkdirUrl = 'https://ins429.dynu.net:60429/family/mkdir'

const styles = {
  root: {
    borderBottom: `1px solid #ccc`,
    margin: 0,
    padding: '10px'
  },
  closeButton: {
    position: 'absolute',
    right: '3px',
    top: '3px'
  }
}

const FolderFormDialog = ({ open, handleClose, classes, handleSubmit }) => {
  const [folderName, setFolderName] = useState('')

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
      <form
        action={mkdirUrl}
        method="POST"
        onSubmit={e => {
          e.preventDefault()
          handleSubmit(folderName)
        }}
      >
        <DialogTitle disableTypography className={classes.root}>
          <Typography variant="h6">New folder</Typography>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Folder name"
            name="dir"
            value={folderName}
            onChange={({ target: { value } }) => setFolderName(value)}
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="outlined" color="primary" type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default withStyles(styles)(FolderFormDialog)
