import {Button, Card, Code, Flex, Heading, Text} from "@radix-ui/themes";
import React from "react";
import validator from "validator";
import {useNavigate} from "react-router-dom";
import './NoResultPage.css';

export default function NoResultPage({selectedDate, today, lastResultDay}: Readonly<{
    selectedDate: string,
    today: string,
    lastResultDay: string
}>) {

    const navigate = useNavigate();

    function feedbackMessage() {
        if (selectedDate === today) {
            return <>Vi har kanskje ikke tatt quizen enda, sjekk igjen senere i dag</>;
        }

        if (validator.isDate(selectedDate)) {
            const date = new Date(selectedDate);
            const now = new Date();
            if (date > now) {
                return <>Du kan ikke se resultater for datoer som er i fremtiden</>;
            }
            return (
                <>
                    Fant ikke resultat for <Code className='code' color='jade'>{selectedDate}</Code>.
                </>
            )
        }

        return <>Ugyldig dato</>;
    }

    function handleClick() {
        navigate(`/${lastResultDay}`)
    }

    return (
        <Card size='3' variant='surface' className='no-result-box'>
            <Flex direction='column' gap='3'>
                <Heading size='6'>Ingen resultat</Heading>
                <Text size='2' color='gray'>
                    {feedbackMessage()}
                </Text>
                <Button className='button-previous-result' size='2' onClick={handleClick}>
                    Se forrige dato med resultat
                </Button>
            </Flex>
        </Card>
    );
}
