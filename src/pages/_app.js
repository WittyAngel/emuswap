import Header from '../components/Header'
import { AppContextProvider } from "../contexts/AppContext"
import '../styles/style.scss'

function EmuSwap({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <Header />
      <Component {...pageProps} />
    </AppContextProvider>
  )
}

export default EmuSwap
