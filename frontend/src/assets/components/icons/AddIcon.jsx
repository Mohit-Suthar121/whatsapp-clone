import React from 'react'
import { useThemeStore } from '../../../../store/useThemeStore'

const AddIcon = () => {
  const {theme} = useThemeStore();
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={theme==="dark"?"white":"black"}><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
  )
}

export default AddIcon