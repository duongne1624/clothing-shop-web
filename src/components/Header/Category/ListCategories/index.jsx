import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { categories } from '~/assets/categories'

function ListCategories() {

  return (
    <>
      {categories.map((category) => (
        <Accordion key={category.label}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img width='20' height='20' src={category.icon} alt={category.alt} /> {category.label}
            </div>
          </AccordionSummary>
          {category.type.map((type) => (
            <AccordionSummary key={type.label}>
              {type.label}
            </AccordionSummary>
          ))}
        </Accordion>
      ))}
    </>
  )
}

export default ListCategories