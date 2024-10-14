import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AuthHook = () => {
    const navigate = useNavigate();

    const userDetails = useCallback(() => {
        try {
            let session = JSON.parse(localStorage.getItem("userInfo"));
            if (new Date(session?.tokenExpirationInMilis) < new Date()) {
                localStorage.clear();
                navigate("/login")
            }
            console.log("token expiring at:-  ",new Date(session?.tokenExpirationInMilis));
            return JSON.parse(localStorage.getItem("userInfo"));
        }
        catch (err) { return {} }
    }, [])


    return userDetails()
}

export default AuthHook