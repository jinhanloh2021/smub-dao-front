import '@/styles/globals.css';

export const metadata = {
  title: 'smub-dao',
  description: 'smub-dao',
  icons: {
    icon: '/assets/images/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
        <body>{children}</body>
    </html>
  );
}
