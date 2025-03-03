import { Inter } from "next/font/google"

const inter = Inter({ 
    subsets: ["latin"],
    display: 'swap',
})

// 关键 CSS
const criticalCSS = `
  .absolute { position: absolute; }
  .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
  .z-0 { z-index: 0; }
  .object-cover { object-fit: cover; }
  /* 其他首屏必需的样式 */
`

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh">
            <head>
                <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
            </head>
            <body className={inter.className}>
                {children}
            </body>
        </html>
    )
} 