import React from 'react'
import {Navigate} from 'react-router-dom'
import {Text} from '@radix-ui/themes'
import {useUser} from '../../data/userContext'
import {Centered} from '../ui/Centered'
import Loading from "../ui/Loading";

export default function AdminRouter({children}: Readonly<{ children: React.ReactNode }>) {
    const {user, loading, error} = useUser()

    if (loading) {
        return <Loading loadingText='Leter etter bruker'/>
    }

    if (error) {
        return (
            <Centered>
                <Text color='red' size='7'>Could not contact server</Text>
            </Centered>
        )
    }

    if (!user?.authenticated) {
        return <Navigate to='/login' replace/>
    }

    return <>{children}</>
}
