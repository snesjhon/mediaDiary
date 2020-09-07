import { ChakraProvider } from "@chakra-ui/core";
import initFirebase from "../utils/initFirebase";

initFirebase();

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
