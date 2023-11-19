import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import { watchContractEvent } from '@wagmi/core';
import { contractABI } from '../utils/constants';


const unwatch1 = watchContractEvent(
  {
    address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    abi: contractABI,
    eventName: 'KittyBorn',
  },
  (log) => console.log(log),
)


export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head />
        <body>
          {/* Make Color mode to persists when you refresh the page. */}
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
