import React from "react";
import {Flex, Text, Avatar, DropdownMenu} from "@radix-ui/themes";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {User} from "../../data/types";
import {fetchUser, logout} from "../../data/backend";
import GoogleButton from "./GoogleButton";
import {fallback} from "../../data/utils";

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);
    const location = useLocation()

    const refresh = React.useCallback(() => {
        setLoading(true);
        fetchUser()
            .then(setUser)
            .catch(() => setUser({authenticated: false}))
            .finally(() => setLoading(false));
    }, []);

    React.useEffect(() => {
        refresh();
    }, [refresh]);

    const handleLogout = async () => {
        await logout();
        refresh();
    };

    const isStatistikk = location.pathname.startsWith('/statistikk')

    const title = `Hvordan Gikk ${isStatistikk ? 'Statistikken' : 'Quizen'}?`
    const shortTitle = isStatistikk ? 'Statistikk' : 'HGQ'

    return (
        <header>
            <Flex justify="between" align="center" px="4" className='header-flex'>
                <Text title='Gå til hjemmeside' weight="bold" size='8' className='logo' onClick={() => navigate('/')}>
                    <span className='logo-long'>{title}</span>
                    <span className='logo-short'>{shortTitle}</span>
                </Text>

                <Flex align="center" gap="3">
                    <HeaderUser loading={loading} user={user} logout={handleLogout}/>
                </Flex>
            </Flex>
        </header>
    );
}

function HeaderUser({loading, user, logout}: Readonly<{ loading: boolean, user: User | null, logout: () => void }>) {
    if (loading) {
        return <Text size="2">Loading…</Text>
    }

    if (user?.authenticated) {
        return <Authenticated user={user} logout={logout}/>
    } else {
        return <GoogleButton size='2'/>
    }
}

function Authenticated({user, logout,}: Readonly<{ user: User; logout: () => void }>) {
    const display = user.givenName || user.familyName || user.email || "Iterate bruker";

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className='dropdown-trigger'>
                <Flex align="center" gap="2">
                    <Avatar src={user.picture} fallback={fallback(user.email)} size="3"
                            radius="small" color='blue'/>
                </Flex>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content align="end" sideOffset={6}>
                <DropdownMenu.Label>
                    <Flex align="center" gap="1">
                        <Text>Logget inn som</Text>
                        <Text weight='bold'>{display}</Text>
                    </Flex>
                </DropdownMenu.Label>
                <DropdownMenu.Separator/>

                <DropdownMenu.Item className='dropdown-item' asChild>
                    <Link to="/bruker">Min side</Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item className='dropdown-item' asChild>
                    <Link to="/admin">Admin</Link>
                </DropdownMenu.Item>

                <DropdownMenu.Separator/>

                <DropdownMenu.Item className='dropdown-item' color="red" onClick={logout}>
                    Logg ut
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}



