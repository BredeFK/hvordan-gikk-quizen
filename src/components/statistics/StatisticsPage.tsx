import * as React from 'react'
import {Box, Card, Flex, Text, Table, Separator} from '@radix-ui/themes'
import {Result, StatisticsInfo, TableData} from '../../data/types'
import {Centered} from '../ui/centered/Centered'
import {BarChart} from '@mui/x-charts/BarChart'
import {useTheme} from '@mui/material/styles'
import calculateStatistics, {formatDate, round1} from '../../data/statistics'

export default function StatisticsPage({results, error, loading}: Readonly<{
    results: Result[],
    error: string | null,
    loading: boolean
}>) {
    const theme = useTheme()
    const [info, setInfo] = React.useState<StatisticsInfo | null>(null)

    React.useEffect(() => {
        if (!results || results.length === 0) {
            setInfo(null)
            return
        }
        const info = calculateStatistics(results)
        if (info) {
            setInfo(info)
        }
    }, [results])

    if (loading) {
        return <Centered><Text color='gray'>Laster…</Text></Centered>
    }
    if (error) {
        return <Centered><Text color='red'>Kunne ikke laste statistikk: {error}</Text></Centered>
    }
    if (results.length === 0) {
        return <Centered><Text color='gray'>Ingen data.</Text></Centered>
    }
    if (!info) {
        return <Centered><Text color='gray'>Klarte ikke å regne ut statistikk</Text></Centered>
    }

    return (
        <Box p='4'>
            <Text size='8' weight='bold'>Quiz statistikk</Text>
            <Separator size='4' mt='3' mb='3'/>

            <Flex gap='3' wrap='wrap' mt='3'>
                <Kpi title='Snitt per dag' value={`${info.averageScore}`}/>
                <Kpi title='Median per dag' value={`${info.medianScore}`}/>
                <Kpi title='Perfekte dager' value={`${info.perfectCount}`}/>
                {info.lastBestDay && <Kpi title='Siste toppdag'
                                          value={`${formatDate(info.lastBestDay.date)} - ${info.lastBestDay.score}/${info.lastBestDay.total}`}/>}
                {info.lastWorstDay &&
                    <Kpi title='Siste bunndag'
                         value={`${formatDate(info.lastWorstDay.date)} - ${info.lastWorstDay.score}/${info.lastWorstDay.total}`}/>}
            </Flex>


            <Card variant='surface' mt='4'>
                <Flex direction='column' p='3' gap='2'>
                    <Text size='4' weight='bold'>Trend siste 31 dager</Text>
                    <BarChart
                        xAxis={[{data: Array.from(info.trendLastMonth.keys())}]}
                        series={[{data: Array.from(info.trendLastMonth.values())}]}
                        height={300}
                        colors={[theme.palette.primary.dark]}
                    />
                </Flex>
            </Card>

            <Flex gap='4' wrap='wrap' mt='4'>
                <AverageTable title='Snitt per ukedag' columnTitle='Dag' tableData={info.averageByWeekday}/>
                <AverageTable title='Snitt per måned' columnTitle='Måned' tableData={info.averageByMonth}/>
            </Flex>
        </Box>
    )
}

function Kpi({title, value}: Readonly<{ title: string, value: React.ReactNode }>) {
    return (
        <Card variant='surface'>
            <Flex direction='column' p='3'>
                <Text size='2' color='gray'>{title}</Text>
                <Text size='6' weight='bold'>{value}</Text>
            </Flex>
        </Card>
    )
}

function AverageTable({title, columnTitle, tableData}: Readonly<{
    title: string
    columnTitle: string,
    tableData: TableData[]
}>) {
    return (
        <Card variant='surface' style={{flex: 1, minWidth: 320}}>
            <Flex direction='column' p='3' gap='3'>
                <Text size='4' weight='bold'>{title}</Text>
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>{columnTitle}</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Snitt %</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tableData.map(row => (
                            <Table.Row key={row.key}>
                                <Table.RowHeaderCell>{row.key}</Table.RowHeaderCell>
                                <Table.Cell>{round1(row.value)}%</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Flex>
        </Card>
    )
}

