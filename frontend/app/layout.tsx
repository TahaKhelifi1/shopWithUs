'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import Header from './components/Header';
import { ApolloProvider } from '@apollo/client';
import './globals.css';
import { usePathname } from 'next/navigation';
import { Notifications } from '@mantine/notifications';

import  client  from '../lib/apollo-client';
import Footer from './components/Footer';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeader = !pathname?.includes('/admin/');

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="bg-[#f8fafc] text-[#1e293b]">

          <ApolloProvider client={client}>
            <MantineProvider>
              <Notifications />
              {showHeader && <Header />}
              {children}
            </MantineProvider>
          </ApolloProvider>

      </body>
    </html>
  );
}
