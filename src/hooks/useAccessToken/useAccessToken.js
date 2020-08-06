import { useCallback, useState, useEffect } from 'react';
import fscreen from 'fscreen';

export default function useAccessToken() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const setToken = useCallback(() => {
        isFullScreen ? fscreen.exitFullscreen() : fscreen.requestFullscreen(document.documentElement);
    }, [token]);

    return [token, setToken];
}
