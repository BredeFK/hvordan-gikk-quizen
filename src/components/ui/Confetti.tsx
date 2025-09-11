import ReactConfetti from "react-confetti";
import React from "react";

export default function Confetti() {
    return (
        <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={800}
            tweenDuration={6000}
            gravity={0.15}
            initialVelocityY={15}
        />
    )
}
