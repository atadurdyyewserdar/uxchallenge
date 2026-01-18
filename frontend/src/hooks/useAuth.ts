import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'

export function useAuth() {
    const { isAuth, status, error } = useSelector((state: RootState) => state.auth)
    return { isAuth, status, error }
}