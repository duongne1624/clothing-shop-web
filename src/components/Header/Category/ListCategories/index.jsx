import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

function ListCategories() {

  return (
    <>
      <h2 style={{
        margin: '5px 10px'
      }}>
        Danh mục
      </h2>
      {/* {categories.map((category) => (
        <Accordion key={category.label} sx={{
          boxShadow: 1,
          '&.Mui-expanded': { margin: 0 }
        }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              padding: '5px 20px',
              '&:hover': { backgroundColor: '#cccccc' },
              minHeight: 'unset',
              '&.Mui-expanded': { minHeight: 'unset' },
              '& .MuiAccordionSummary-content.Mui-expanded': { margin: '12px 0 !important' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img width='20' height='20' src={category.icon} alt={category.alt} /> {category.label}
            </div>
          </AccordionSummary>
          {category.type.map((type) => (
            <AccordionSummary key={type.label} sx={{
              padding: '5px 50px',
              '&:hover': {
                backgroundColor: '#cccccc'
              }
            }}>
              {type.label}
            </AccordionSummary>
          ))}
        </Accordion>
      ))} */}
    </>
  )
}

export default ListCategories