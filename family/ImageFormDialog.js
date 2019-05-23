import React, { useContext, useState, useRef } from 'react'
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
import FormControl from '@material-ui/core/FormControl'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { timestamp } from './utils'
import UploaderContext from './UploaderContext'
import UploadJob from './UploadJob'

const buildFolderUrl = dir => `https://ins429.dynu.net:60429/family/${dir}`

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
  },
  fileInput: {
    display: 'none'
  },
  browseButton: {
    marginTop: '5px'
  }
}

const ImageFormDialog = ({ folder, open, handleClose, classes }) => {
  const [files, setFiles] = useState([])
  const [password, setPassword] = useState('')
  const { enqueue, reload, jobs } = useContext(UploaderContext)
  const form = useRef(null)

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
      <form
        ref={form}
        action={buildFolderUrl(folder)}
        method="POST"
        encType="multipart/form-data"
        onSubmit={e => {
          e.preventDefault()

          files.forEach(file => {
            const formData = new FormData()

            formData.append('filename', file.filename)
            formData.append('file', file.file, file.filename)
            formData.append('password', password)

            enqueue(
              new UploadJob({
                url: buildFolderUrl(folder),
                filename: file.filename,
                formData
              })
            )
          })
        }}
      >
        <DialogTitle disableTypography className={classes.root}>
          <Typography variant="h6">New image</Typography>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {files.map((file, index) => (
            <TextField
              key={index}
              fullWidth
              name="filename"
              label="Filename"
              value={file.filename}
              onChange={({ target: { value } }) =>
                setFiles(
                  files.map(_file, _index =>
                    index === _index ? { ...file, filename: value } : _file
                  )
                )
              }
              margin="normal"
              variant="outlined"
            />
          ))}
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            margin="normal"
            variant="outlined"
          />
          <FormControl>
            <input
              id="outlined-button-file"
              accept="image/*"
              multiple
              type="file"
              name="file"
              onChange={({ target: { files } }) => {
                let newFiles = []

                for (let i = 0; i < files.length; i++) {
                  newFiles = [
                    ...newFiles,
                    {
                      file: files[i],
                      filename: `${timestamp()}-${files[i].name}`
                    }
                  ]
                }

                setFiles(newFiles)
              }}
              className={classes.fileInput}
            />
            <label htmlFor="outlined-button-file">
              <Button
                size="small"
                variant="outlined"
                component="span"
                className={classes.browseButton}
              >
                Browse...
              </Button>
            </label>
          </FormControl>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Filename</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map(job => (
                <TableRow key={job.id}>
                  <TableCell component="th" scope="row">
                    {job.filename}
                  </TableCell>
                  <TableCell align="right">{job.status}</TableCell>
                  <TableCell align="right">{job.progress}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

export default withStyles(styles)(ImageFormDialog)
