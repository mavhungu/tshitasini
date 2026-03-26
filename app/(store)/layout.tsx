// import { PayPalsProvider } from '@/components/store/PayPalProvider'
import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'

export default function StoreLayout({ children,}: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
        {/* <PayPalsProvider> */}
          <main className="flex-1 pt-16">{children}</main>
        {/* </PayPalsProvider> */}
      <Footer />
    </div>
  )
}
