import {Button} from "@radix-ui/themes";
import {startGoogleLogin} from "../../data/authentification";
import logo from '../../assets/google.svg'
import React from "react";
import './ui.css'

export default function GoogleButton({size}: Readonly<{ size: "1" | "2" | "3" | "4" }>) {
    const imgSize = imageSize(size);
    return (
        <Button
            className="google-button"
            variant="solid"
            color="blue"
            size={size}
            onClick={startGoogleLogin}>
            <img src={logo} height={imgSize} width={imgSize} alt="Google logo"/>
            <span>Logg inn</span>
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
