import React, { useEffect, useState, createContext } from "react"

const localStorageKey = "mode"

const getMode = () =>
  new Promise((res) =>
    setTimeout(() => {
      res(localStorage.getItem(localStorageKey) || "system")
    }, 3000)
  )

const saveMode = async (mode) => {
  localStorage.setItem("mode", mode)
}

// exposed context for doing awesome things directly in React
export const ThemeContext = createContext({
  mode: "system",
  theme: "light",
  setMode: () => {},
})

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const initialMode = localStorage.getItem(localStorageKey) || "system"
    return initialMode
  })

  // This will only get called during the 1st render
  useState(() => {
    getMode().then(setMode)
  })

  // When the mode changes, save it to the localStorage and to the database
  useEffect(() => {
    localStorage.setItem(localStorageKey, mode)
    saveMode(mode)
  }, [mode])

  const [theme, setTheme] = useState(() => {
    if (mode !== "system") {
      return mode
    }
    const isSystemInDarkMode = matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    return isSystemInDarkMode ? "dark" : "light"
  })

  // Update the theme according to the mode
  useEffect(() => {
    if (mode !== "system") {
      setTheme(mode)
      return
    }

    const isSystemInDarkMode = matchMedia("(prefers-color-scheme: dark)")
    // If system mode, immediately change theme according to the current system value
    setTheme(isSystemInDarkMode.matches ? "dark" : "light")

    // As the system value can change, we define an event listener when in system mode
    // to track down its changes
    const listener = (event) => {
      setTheme(event.matches ? "dark" : "light")
    }
    isSystemInDarkMode.addListener(listener)
    // eslint-disable-next-line consistent-return
    return () => {
      isSystemInDarkMode.removeListener(listener)
    }
  }, [mode])

  // Update the visuals on theme change
  useEffect(() => {
    // Clear previous classNames on the body and add the new one
    const htmlElement = document.querySelector("html")
    if (theme === "dark") {
      htmlElement.classList.add("dark")
    } else {
      htmlElement.classList.remove("dark")
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
