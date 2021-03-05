import { GlobalContextProvider } from '../context/GlobalContext'
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  return (
    <GlobalContextProvider>
      <Component {...pageProps} />
    </GlobalContextProvider>
  );
}

export default MyApp
