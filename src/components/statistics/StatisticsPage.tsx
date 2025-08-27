import * as React from 'react'
import {Box, Card, Flex, Text, Table, Separator} from '@radix-ui/themes'
import {Result, TableData} from '../../data/types'
import {Centered} from '../ui/centered/Centered'
import {BarChart} from '@mui/x-charts/BarChart'
import calculateStatistics, {formatDate, round1} from '../../data/statistics'
import './StatisticsPage.css'
import {useNavigate} from "react-router-dom";

export default function StatisticsPage({results, error, loading}: Readonly<{
    results: Result[],
    error: string | null,
    loading: boolean
}>) {
    const navigate = useNavigate();

    const info = React.useMemo(() => {
        if (!results || results.length === 0) {
            return null
        }
        return calculateStatistics(results)
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

    const trendLastMonthData = Array.from(info.trendLastMonth.keys())
    const trendLastMonthValues = Array.from(info.trendLastMonth.values()).map(v => v.value)
    const trendLastMonthColours = Array.from(info.trendLastMonth.values()).map(v => v.colour)
    const trendLastMonthDateString = Array.from(info.trendLastMonth.values()).map(v => v.dateString)

    return (
        <Box p='4'>
            <Text size='8' weight='bold'>Quiz statistikk</Text>
            <Separator size='4' mt='3' mb='3'/>

            <Flex gap='3' wrap='wrap' mt='3'>
                <Kpi title='Snitt per dag' value={`${info.averageScore}`}/>
                <Kpi title='Median per dag' value={`${info.medianScore}`}/>
                <Kpi title='Antall quizer' value={`${info.totalNumberOfQuizzes}`}/>
                <Kpi title='Perfekte dager' value={`${info.perfectCount}`}/>
                {info.lastBestDay && <Kpi title='Siste toppdag'
                                          value={`${formatDate(info.lastBestDay.date)} - ${info.lastBestDay.score}/${info.lastBestDay.total}`}/>}
                {info.lastWorstDay &&
                    <Kpi title='Siste bunndag'
                         value={`${formatDate(info.lastWorstDay.date)} - ${info.lastWorstDay.score}/${info.lastWorstDay.total}`}/>}
            </Flex>


            <Card variant='surface' mt='4'>
                <Flex direction='column' p='3' gap='2'>
                    <Text size='4' weight='bold'>Trend siste 31 quizer</Text>
                    <BarChart
                        xAxis={[
                            {
                                scaleType: 'band',
                                data: trendLastMonthData,
                                colorMap: {
                                    type: 'ordinal',
                                    values: trendLastMonthData,
                                    colors: trendLastMonthColours,
                                },
                            },
                        ]}
                        yAxis={[{scaleType: 'linear'}]}
                        series={[{data: trendLastMonthValues}]}
                        height={300}
                        borderRadius={8}
                        onItemClick={(_, {dataIndex}) => {
                            navigate(`/${trendLastMonthDateString[dataIndex]}`)
                        }}
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
                            <Table.ColumnHeaderCell>Snitt</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Antall</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tableData.map(row => (
                            <Table.Row key={row.key}>
                                <Table.RowHeaderCell>{row.key}</Table.RowHeaderCell>
                                <Table.Cell>{round1(row.value)}</Table.Cell>
                                <Table.Cell>{row.length}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Flex>
        </Card>
    )
}
