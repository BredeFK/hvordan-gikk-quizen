import {Button} from "@radix-ui/themes";
import {startGoogleLogin} from "../../data/backend";
import logo from '../../assets/google.svg';
import React from "react";
import './ui.css'
import {NetworkError} from "../../data/types.ts";

export default function GoogleButton({size, error}: Readonly<{ size: "1" | "2" | "3" | "4", error: Error | null }>) {
    const imgSize = imageSize(size);
    const [loading, setLoading] = React.useState(false);

    const handleClick = () => {
        try {
            setLoading(true);
            startGoogleLogin();
        } catch {
            setLoading(false);
        }
    };

    const isNetworkError = error instanceof NetworkError;

    return (
        <Button
            className="google-button"
            variant="solid"
            color="blue"
            size={size}
            onClick={handleClick}
            disabled={loading || isNetworkError}>
            {loading ? (
                <span>Logger inn…</span>
            ) : (
                <>
                    <img src={logo} height={imgSize} width={imgSize} alt="Google logo"/>
                    <span>Logg inn</span>
                </>
            )}
        </Button>
    )
}

function imageSize(size: "1" | "2" | "3" | "4"): number {
    switch (size) {
        case '1':
            return 12;
        case '2':
            return 16;
        case '3':
            return 20;
        case '4':
            return 24;
        default:
            return 12;
    }
}
