import * as React from 'react'
import {Box, Card, Flex, Text, Table} from '@radix-ui/themes'
import {Result, TableData} from '../../data/types'
import {BarChart} from '@mui/x-charts/BarChart'
import calculateStatistics, {relationDate, round1} from '../../data/statistics'
import './StatisticsPage.css'
import {useNavigate} from "react-router-dom";
import ShowError from "../ui/ShowError";
import Loading from "../ui/Loading";
import {ArrowDownIcon} from "@radix-ui/react-icons";
import Confetti from "../ui/Confetti";
import {rainbowColors} from "../../theme/colours";

export default function StatisticsPage({results, error, loading}: Readonly<{
    results: Result[],
    error: string | null,
    loading: boolean
}>) {
    const navigate = useNavigate();
    const trendSize = 31
    const rainbowLength = 1200

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
    const trendBarColours = trendValues.map((v, i) => (v === 100 ? 'url(#rainbowBarGradient)' : trendColours[i]))
    const trendDateStrings = Array.from(info.trendLastQuizzes.values()).map(v => v.dateString)

    return (
        <>
            {trendValues && trendValues.length > 0 && trendValues[trendValues.length - 1] === 100 &&
                <Confetti/>
            }
            <Box p='4'>
                <Flex gap='3' wrap='wrap'>
                    <Kpi title='Snitt per dag' value={`${info.averageScore}%`}/>
                    <Kpi title='Median per dag' value={`${info.medianScore}%`}/>
                    <Kpi title='Antall quizer' value={`${info.totalNumberOfQuizzes}`}/>
                    <Kpi title='Perfekte dager' value={`${info.perfectCount}`}/>
                    {info.lastBestDay &&
                        <Kpi title='Siste toppdag' value={`${relationDate(info.lastBestDay.date)}`}
                             oncClick={() => navigate(`/${info?.lastBestDay?.dateString}`)}/>}
                    {info.lastWorstDay &&
                        <Kpi title='Siste bunndag' value={`${relationDate(info.lastWorstDay.date)}`}
                             oncClick={() => navigate(`/${info?.lastWorstDay?.dateString}`)}/>}
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
                                        colors: trendBarColours,
                                    },
                                },
                            ]}
                            yAxis={[{scaleType: 'linear'}]}
                            series={[{data: trendValues}]}
                            height={300}
                            borderRadius={8}
                            onItemClick={(_, {dataIndex}) => {
                                navigate(`/${trendDateStrings[dataIndex]}`)
                            }}>

                            <defs>
                                <linearGradient id="rainbowBarGradient" x1="0" y1={rainbowLength} x2={rainbowLength}
                                                y2="0" gradientUnits="userSpaceOnUse" spreadMethod="repeat">
                                    {rainbowColors.map((color, index) => (
                                        <stop key={color}
                                              offset={`${index * 100 / rainbowColors.length}%`}
                                              stopColor={color}
                                        />
                                    ))}
                                    <animateTransform
                                        attributeName="gradientTransform" type="translate" from="0 0"
                                        to={`${rainbowLength} -${rainbowLength}`} dur="3s" repeatCount="indefinite"
                                    />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </Flex>
                </Card>

                <Flex gap='4' wrap='wrap' mt='4'>
                    <AverageTable title='Snitt per ukedag' columnTitle='Dag' tableData={info.averageByWeekday}/>
                    <AverageTable title='Snitt per måned' columnTitle='Måned' tableData={info.averageByMonth}/>
                </Flex>
            </Box>
        </>
    )
}

function Kpi({title, value, oncClick}: Readonly<{ title: string, value: string, oncClick?: () => void }>) {
    return (
        <Card variant='surface'
              className={oncClick ? 'kpi-clickable' : ''}
              onClick={oncClick ? () => oncClick() : undefined}>
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
                            {columnTitle === 'Dag' ? (
                                <>
                                    <Table.ColumnHeaderCell>{columnTitle}</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Snitt<ArrowDownIcon/></Table.ColumnHeaderCell>
                                </>
                            ) : (
                                <>
                                    <Table.ColumnHeaderCell>{columnTitle}<ArrowDownIcon/></Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Snitt</Table.ColumnHeaderCell>
                                </>
                            )}
                            <Table.ColumnHeaderCell>Antall</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tableData.map(row => (
                            <Table.Row key={row.key}>
                                <Table.RowHeaderCell>{row.key}</Table.RowHeaderCell>
                                <Table.Cell>{round1(row.value)}%</Table.Cell>
                                <Table.Cell>{row.length}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Flex>
        </Card>
    )
}
