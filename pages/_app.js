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
          <link rel="shortcut icon" href="/images/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </SessionProvider>
    </SnackbarProvider>
  )
}