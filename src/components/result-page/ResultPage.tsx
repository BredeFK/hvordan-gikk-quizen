import {Result, ResultFile} from '../../data/types'
import {Box, Card, Flex, Heading, Badge, Separator, Text, Progress} from "@radix-ui/themes"
import "./ResultPage.css";
import {useParams} from 'react-router-dom'
import React from 'react'

export default function ResultPage() {
    const params = useParams<{ date: string }>();
    const selectedDate = params.date ?? todayIso();
    const [results, setResults] = React.useState<Result[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await fetch("/results.json");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = (await res.json()) as ResultFile;
                if (alive) setResults(json.results ?? []);
            } catch (e: any) {
                if (alive) setError(e.message ?? "Unknown error");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    const result = React.useMemo(
        () => results.find((r) => r.date === selectedDate) ?? null,
        [results, selectedDate]
    );

    if (loading) {
        return (
            <Centered>
                <Card size="3" variant="surface">
                    <Text color="gray">Laster…</Text>
                </Card>
            </Centered>
        );
    }

    if (error) {
        return (
            <Centered>
                <Card size="3" variant="surface">
                    <Text color="red">Feil: {error}</Text>
                    <Text color="gray" size="2">
                        Sjekk at <code>public/results.json</code> finnes og er gyldig.
                    </Text>
                </Card>
            </Centered>
        );
    }

    if (!result) {
        return (
            <Centered>
                <Card size="3" variant="surface">
                    <Heading size="4">Ingen resultat</Heading>
                    <Text color="gray" size="2">
                        Fant ikke resultat for <b>{selectedDate}</b>.
                    </Text>
                </Card>
            </Centered>
        );
    }

    const progress = Math.max(0, Math.min(100, Math.round((result.score / result.total) * 100)));

    return (
        <Centered>
            <Box p="4" className="result-box">
                <Card size="3" variant="surface">
                    <Flex direction="column" gap="4">
                        <Flex align="center" justify="between">
                            <Heading size="5">Quiz Resultat</Heading>
                            <Badge color="gray" variant="soft" size='3'>{formatDatePretty(result.date)}</Badge>
                        </Flex>

                        <Separator size="4"/>

                        <Flex align="end" gap="3">
                            <Text as="div" size="9" weight="bold" style={{lineHeight: 1}}>
                                {result.score}
                            </Text>
                            <Text size="4" color="gray">/ {result.total}</Text>
                        </Flex>

                        <Box>
                            <Progress value={progress}/>
                            <Text size="2" color="gray" mt="2" as="div">
                                {progress}% korrekt
                            </Text>
                        </Box>

                    </Flex>
                </Card>
            </Box>
        </Centered>
    );
}

function formatDatePretty(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("nb-NO", {year: "numeric", month: "long", day: "numeric"});
}

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

function Centered({
                      children,
                      maxWidth = 560,
                  }: React.PropsWithChildren<{ maxWidth?: number }>) {
    return (
        <Box
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
            }}
        >
            <Flex direction="column" style={{width: "100%", maxWidth}}>
                {children}
            </Flex>
        </Box>
    );
}
