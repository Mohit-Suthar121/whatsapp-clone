import React, { use } from 'react'
import { useThemeStore } from '../../../../store/useThemeStore'

const SendIcon = () => {
  const {theme} = useThemeStore();
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={theme==="dark"?"black":"white"}><path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z"/></svg>
  )
}

export default SendIcon