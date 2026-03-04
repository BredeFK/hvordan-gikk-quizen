import {Navigate} from "react-router-dom";
import {useUser} from "../../data/useUser";
import ShowError from "../ui/ShowError";
import Loading from "../ui/Loading";

export default function AuthenticationPage() {
    const {user, loading, error} = useUser();

    if (loading) {
        return <Loading loadingText={'Sjekker bruker'}/>
    }

    if (error) {
        return <ShowError errorMessage='Could not contact server' error={error?.message}/>
    }

    if (!user?.authenticated) {
        return <ShowError errorMessage='Not authenticated'/>
    }

    return <Navigate to="/admin" replace/>
}
