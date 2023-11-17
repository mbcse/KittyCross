import { ChakraProvider } from "@chakra-ui/react";
import { Web3Modal } from "../lib/WalletConnectConfig";
import theme from "../theme";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Web3Modal>
        <Component {...pageProps} />
      </Web3Modal>
    </ChakraProvider>
  );
}

export default MyApp;
