import {Navigate} from 'react-router-dom'
import {useUser} from '../../data/useUser'
import Loading from "../ui/Loading";
import type {ReactNode} from "react";
import ShowError from "../ui/ShowError.tsx";

export default function AdminRouter({children}: Readonly<{ children: ReactNode }>) {
    const {user, loading, error} = useUser()

    if (loading) {
        return <Loading loadingText='Leter etter bruker'/>
    }

    if (error) {
        return <ShowError errorMessage='Could not contact server' error={error?.message}/>
    }

    if (!user?.authenticated) {
        return <Navigate to='/login' replace/>
    }

    return <>{children}</>
}
