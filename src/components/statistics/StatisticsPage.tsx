import * as React from 'react'
import {Box, Card, Flex, Text, Table} from '@radix-ui/themes'
import {Result, TableData} from '../../data/types'
import {BarChart} from '@mui/x-charts/BarChart'
import calculateStatistics, {relationDate, round1} from '../../data/statistics'
import './StatisticsPage.css'
import {useNavigate} from "react-router-dom";
import ShowError from "../ui/ShowError";
import Loading from "../ui/Loading";

export default function StatisticsPage({results, error, loading}: Readonly<{
    results: Result[],
    error: string | null,
    loading: boolean
}>) {
    const navigate = useNavigate();
    const trendSize = 31

    const info = React.useMemo(() => {
        if (!results || results.length === 0) {
            return null
        }
        return calculateStatistics(results, trendSize)
    }, [results])

    if (loading) {
        return <Loading loadingText={'Henter statistikk'}/>
    }
    if (error) {
        return <ShowError errorMessage={`Kunne ikke laste statistikk: ${error}`}/>
    }
    if (results.length === 0) {
        return <ShowError errorMessage={'Ops, her fantes det ikke noe data'}/>
    }
    if (!info) {
        return <ShowError errorMessage='Klarte ikke å regne ut statistikk'/>
    }

    const trendData = Array.from(info.trendLastQuizzes.keys())
    const trendValues = Array.from(info.trendLastQuizzes.values()).map(v => v.value)
    const trendColours = Array.from(info.trendLastQuizzes.values()).map(v => v.colour)
    const trendDateStrings = Array.from(info.trendLastQuizzes.values()).map(v => v.dateString)

    return (
        <Box p='4'>
            <Flex gap='3' wrap='wrap'>
                <Kpi title='Snitt per dag' value={`${info.averageScore}`}/>
                <Kpi title='Median per dag' value={`${info.medianScore}`}/>
                <Kpi title='Antall quizer' value={`${info.totalNumberOfQuizzes}`}/>
                <Kpi title='Perfekte dager' value={`${info.perfectCount}`}/>
                {info.lastBestDay && <Kpi title='Siste toppdag' value={`${relationDate(info.lastBestDay.date)}`}/>}
                {info.lastWorstDay && <Kpi title='Siste bunndag' value={`${relationDate(info.lastWorstDay.date)}`}/>}
            </Flex>


            <Card variant='surface' mt='4'>
                <Flex direction='column' p='3' gap='2'>
                    <Text size='4' weight='bold'>{`Trend siste ${trendSize} quizer`}</Text>
                    <BarChart
                        xAxis={[
                            {
                                scaleType: 'band',
                                data: trendData,
                                colorMap: {
                                    type: 'ordinal',
                                    values: trendData,
                                    colors: trendColours,
                                },
                            },
                        ]}
                        yAxis={[{scaleType: 'linear'}]}
                        series={[{data: trendValues}]}
                        height={300}
                        borderRadius={8}
                        onItemClick={(_, {dataIndex}) => {
                            navigate(`/${trendDateStrings[dataIndex]}`)
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
