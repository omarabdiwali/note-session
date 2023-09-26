import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import Head from 'next/head'
import { SnackbarProvider } from 'notistack'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SnackbarProvider preventDuplicate>
      <SessionProvider session={session}>
        <Head>
          <title>NoteSession</title>
        </Head>
        <Component {...pageProps} />
      </SessionProvider>
    </SnackbarProvider>
  )
}