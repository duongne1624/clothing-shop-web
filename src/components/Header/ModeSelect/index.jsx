import { useColorScheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  const muiMode = localStorage.getItem('mui-mode')

  const handleChange = (event) => {
    setMode(event.target.value)
  }

  return (
    <Box sx={{ minWidth: 135 }}>
      <FormControl fullWidth>
        <InputLabel id="mode-select-label"></InputLabel>
        <Select
          labelId="mode-select-label"
          value={muiMode || mode}
          onChange={handleChange}
        >
          <MenuItem value="light" sx={{ color: 'black' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LightModeIcon /> Light
            </Box>
          </MenuItem>
          <MenuItem value="dark" sx={{ color: 'black' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DarkModeIcon /> Dark
            </Box>
          </MenuItem>
          <MenuItem value="system" sx={{ color: 'black' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsBrightnessIcon /> System
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default ModeToggle