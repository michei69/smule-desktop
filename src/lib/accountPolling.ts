import { useEffect, useState } from "react";
import Settings from "./settings";

//TODO: implement a provider instead of whatever this is
export default function useLocalStorageAccount() {
    const [value, setValue] = useState(() => Settings.getProfile());
  
    useEffect(() => {
        // Handler for storage events from other tabs/windows
        const handleStorageChange = (e) => {
            if (e.key === "profile") setValue(e.newValue);
        };

        // Handler for same-tab changes
        const checkForChange = () => {
            const newValue = Settings.getProfile();
            if (newValue !== value) setValue(newValue);
        };

        // Listen to storage events
        window.addEventListener('storage', handleStorageChange);
        
        // Set up polling for same-tab detection
        const intervalId = setInterval(checkForChange, 500); // Check every 500ms
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, [value]);

    return value;
}