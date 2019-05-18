import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Loader from '@material-ui/core/CircularProgress'
import Folders from './Folders'
import Images from './Images'
import { admin } from './utils'

const lsUrl = 'https://ins429.dynu.net:60429/family/ls'
const buildFolderUrl = dir => `https://ins429.dynu.net:60429/family/images`

const Family = () => {
  const [loading, setLoading] = useState(false)
  const [filename, setFilename] = useState('')
  const [images, setImages] = useState([])
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)

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

  return loading ? (
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
  )
}

ReactDOM.render(<Family />, document.getElementById('root'))
