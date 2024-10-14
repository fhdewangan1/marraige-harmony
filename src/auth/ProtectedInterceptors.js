import React, { useEffect } from 'react'
import AuthHook from './AuthHook'
import { ProtectedAxiosConfig } from '../config/AxiosConfig'
import { useNavigate } from 'react-router-dom'


const ProtectedInterceptors = () => {
  const { jwtToken, error, userName, userRoles } = AuthHook()
  const navigate = useNavigate()

  useEffect(() => {
    const requestInterceptor = ProtectedAxiosConfig.interceptors.request.use(
      (config) => {
        if (jwtToken) {
          config.headers['Authorization'] = 'Bearer ' + jwtToken;
          config.headers['Content-Type'] = 'application/json';
        }
        return config
      },
      (error) => { navigate("/"); return Promise.reject(error) })

    const responseInterceptor = ProtectedAxiosConfig.interceptors.response.use((response) => { return response }, (error) => { navigate("/"); return Promise.reject(error) })
    return () => {
      ProtectedAxiosConfig.interceptors.request.eject(requestInterceptor)
      ProtectedAxiosConfig.interceptors.response.eject(responseInterceptor)
    }

  }, [jwtToken])

  return ProtectedAxiosConfig
}

export default ProtectedInterceptors