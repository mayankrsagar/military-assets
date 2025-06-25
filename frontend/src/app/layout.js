import './globals.css';

import ReduxProvider from '@/store/ReduxProvider';

export const metadata = {
  title: 'Military Asset Mgmt',
  description: 'Manage military assets across bases',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <main className="min-h-screen bg-gray-50">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  )
}
