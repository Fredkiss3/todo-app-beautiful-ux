import "./globals.css";
// components
import { Toaster } from "react-hot-toast";

// utils
import { getThemePreference } from "~/app/(actions)/theme";
import { DROPDOWN_USER_ID, THEME_COOKIE_KEY } from "~/lib/constants";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const runtime = "edge";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={(await getThemePreference()) === "DARK" ? "dark" : ""}
      suppressHydrationWarning
    >
      <body className={inter.className} suppressHydrationWarning>
        {/* 
          Script used to avoid FOUC and apply the theme of application
          depending on the user's theme preference, before React Finishes 
          hydrating
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function () {
                  function getCookieValue(cookieName) {
                    // Split all cookies into an array
                    var cookies = document.cookie.split(';');
                  
                    // Loop through the cookies
                    for (var i = 0; i < cookies.length; i++) {
                      var cookie = cookies[i].trim();
                  
                      // Check if the cookie starts with the given name
                      if (cookie.indexOf(cookieName + '=') === 0) {
                        // Extract and return the cookie value
                        return cookie.substring(cookieName.length + 1);
                      }
                    }
                  
                    // Return null if the cookie is not found
                    return null;
                  }

                  function setTheme(newTheme) {
                    if (newTheme === 'DARK') {
                      document.documentElement.classList.add('dark');
                    } else if (newTheme === 'LIGHT') {
                      document.documentElement.classList.remove('dark');
                    }
                  }

                  var initialTheme = getCookieValue('${THEME_COOKIE_KEY}');
                  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

                  if (!initialTheme) {
                    initialTheme = darkQuery.matches ? 'DARK' : 'LIGHT';
                  }
                  setTheme(initialTheme);

                  darkQuery.addEventListener('change', function (e) {
                    preferredTheme = getCookieValue('${THEME_COOKIE_KEY}');
                    if (!preferredTheme) {
                      setTheme(e.matches ? 'DARK' : 'LIGHT');
                    }
                  });
                })();
              `,
          }}
        />
        {children}

        <Toaster position="top-center" />

        {/* Script to avoid FOUC of the dropdown content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () {
                var element = document.getElementById("${DROPDOWN_USER_ID}");
                if(element) {
                  element.style.top = '100%';
                  element.style.marginBottom = 0;
                  element.style.marginTop = '0.5rem';
                  element.style.width = '100%';
                  element.style.display = 'none';
                }
          })()`,
          }}
        ></script>
      </body>
    </html>
  );
}
