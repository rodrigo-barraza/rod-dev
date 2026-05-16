import { createContext, useContext, useState, type ReactNode } from 'react'

interface AlertContextValue {
    message: string;
    setMessage: (message: string) => void;
}

export const AlertContext = createContext<AlertContextValue>({
    message: '',
    setMessage: () => {},
})

export const useAlertContext = () => useContext(AlertContext);

interface AlertProviderProps {
    children: ReactNode;
}

export const AlertProvider = ({ children }: AlertProviderProps) => {
    const [message, setMessage] = useState('')

    return (
      <>
        <AlertContext.Provider value={{ message, setMessage }}>
          { message && <div className="alert">{message}</div> }
          {children}
        </AlertContext.Provider>
      </>
    );
}