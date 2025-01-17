import Header from '~/components/Header'
import Footer from '~/components/Footer'
import SaleProducts from './SaleProduct'
import NewProducts from './NewProduct'

function Home() {
  return (
    <>
      <style>
        {`
          html {
            scroll-behavior: smooth;
          }
          .section {
            scroll-margin-top: 50px; /* Offset để bù chiều cao header */
            padding: 50px 20px;
          }
        `}
      </style>
      <Header />
      <div style={{ paddingTop: '50px' }}>
        <div id="sale-products" className="section sale-products">
          <SaleProducts />
        </div>
        <div id="new-products" className="section new-products">
          <NewProducts />
        </div>

      </div>
      <Footer />
    </>
  )
}

export default Home
