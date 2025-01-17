import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import { MenuItem } from '@mui/material'

function MultipleTag() {
  const theme = useTheme()

  const data = [
    'Áo da',
    'Áo len',
    'Áo thun',
    'Áo khoác',
    'Áo sơ mi',
    'Quần thun',
    'Quần bó',
    'Áo trẽ vai'
  ]

  return (
    <Autocomplete
      multiple
      limitTags={1}
      id="multiple-limit-tags"
      options={data}
      getOptionLabel={(option) => option}
      renderInput={(params) => <TextField {...params} placeholder="Tags" />}
      renderOption={(props, option) => (
        <MenuItem
          {...props}
          sx={{
            color: 'black',
            bgcolor: 'white',
            '&:hover': {
              bgcolor: '#858585'
            }
          }}
        >
          {option}
        </MenuItem>
      )}
      sx={{
        color: 'black',
        width: '280px',
        '& .MuiOutlinedInput-root': {
          p: 1
        },
        '& .MuiAutocomplete-tag': {
          bgcolor: 'text.tag',
          border: '1px solid',
          borderRadius: 1,
          height: 32,
          pl: 1.5,
          pr: 1.5,
          lineHeight: '32px',
          borderColor: '#7ad6d6',
          color: theme.palette.text.primary,
          '& .MuiChip-label': {
            paddingLeft: 0,
            paddingRight: 0
          },
          '& .MuiSvgIcon-root': {
            color: '#2d6363',
            ml: 1,
            mr: -0.75,
            '&:hover': {
              color: '#2d6363'
            }
          }
        }
      }}
    />
  )
}

export default MultipleTag
