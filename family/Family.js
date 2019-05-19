import React, { useEffect, useState } from 'react'
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
  const [folders, setFolders] = useState([])

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

  return loading ? <Loader /> : <Folders folders={folders} />
}

export default Family
