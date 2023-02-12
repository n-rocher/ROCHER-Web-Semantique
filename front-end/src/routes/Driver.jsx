
import React from "react";
import { useLoaderData } from "react-router";

import {
    EuiTitle,
    EuiBadge,
    EuiLink,
    EuiTextColor,
    EuiIcon,
    EuiBasicTable,
    EuiPanel,
    EuiText,
    EuiHorizontalRule,
    EuiImage, EuiFlexItem, EuiFlexGroup,
    euiPaletteForStatus,
} from '@elastic/eui';

import '@elastic/charts/dist/theme_only_light.css';

import {
    Chart,
    Settings,
    Axis,
    LineSeries,
    BarSeries,
} from '@elastic/charts';

import { getIRI } from "../util";

const BADGE_COLORS = ["#FCF7BC", "#FEA27F", "#BADA55", "#FFA500", "#0000FF"]
const CHART_COLOR = "#FF1801"
const STATUS_COLOR = {
    "out": "#ff7070",
    "lap": "#5757ff",
    "ok": "#BADA55",
}

const ARRAY_STATUS_COLOR = Object.values(STATUS_COLOR)

const RESULTS_COLUMNS = [
    {
        field: 'gp_year',
        width: "75px",
        align: "center",
        name: '',
        render: (gp_year) => {
            return <EuiBadge color={BADGE_COLORS[gp_year.value % BADGE_COLORS.length]}>{gp_year.value}</EuiBadge>
        }
    }, {
        field: 'gp_name',
        name: 'Grand Prix',
        align: "left",
        textOnly: true,
        truncateText: false,
        render: (gp_name, data) => <EuiLink target="_blank" href={"/grand-prix/" + getIRI(data.gp_uri.value)}>{gp_name.value}</EuiLink>
    }, {
        field: 'constructor',
        name: 'Équipe',
        align: "left",
        textOnly: true,
        truncateText: false,
        render: (constructor, data) => <EuiLink target="_blank" href={"/constructor/" + getIRI(data.constructor_uri.value)}>{constructor.value}</EuiLink>
    },
    {
        field: 'positionOrder',
        name: 'Classement',
        align: "center",
        render: (positionOrder) => positionOrder?.value,
    }, {
        field: 'grid',
        name: 'Positions',
        align: "center",
        render: (grid, data) => {
            const g_o_p = parseInt(grid?.value || 0) - parseInt(data?.positionOrder?.value || 0)
            const color = g_o_p > 0 ? "success" : g_o_p < 0 ? "danger" : "default"
            const icon = g_o_p > 0 ? "sortUp" : g_o_p < 0 ? "sortDown" : "minus"
            return <EuiTextColor color={color}><EuiIcon type={icon} /> {g_o_p}</EuiTextColor>
        },
    }, {
        field: 'status',
        name: 'Status',
        align: "right",
        render: (status, d) => <EuiBadge color={STATUS_COLOR[d?.status_type?.value]}>{status?.value}</EuiBadge>,
    }
]


export default function GrandPrix() {

    let [driver, grandPrixResults, pointsData] = useLoaderData()

    /* Trouver la plus longue description retournée */
    if (driver.length > 1) {
        let abs_length = driver.map(x => x?.abstract?.value?.length || 0)
        driver = driver[abs_length.indexOf(Math.max(...abs_length))]
    } else {
        driver = driver[0]
    }
    /***************************************************************************/


    /* Organisation des données pour le graphique "Status de fin de grand prix" */
    let value_present_for_year = {}
    pointsData.map(obj => {
        let x = parseInt(obj.gp_year.value)
        let y = parseInt(obj.count.value)
        let g = obj.status_type.value
        if (!(x in value_present_for_year)) value_present_for_year[x] = { "ok": 0, "lap": 0, "out": 0 }
        value_present_for_year[x][g] += y
    })
    const status_list = Object.entries(value_present_for_year).map(([year, values]) => {
        return Object.entries(values).map(v => {
            return { x: year, y: v[1], g: v[0] }
        }).reverse()
    }).flat()
    /***************************************************************************/



    /* Organisation des données pour le graphique "Nombre de point gagné par année" */
    const points_list = Object.entries(pointsData.reduce((pV, x) => {
        if (!(x.gp_year.value in pV)) pV[x.gp_year.value] = 0
        pV[x.gp_year.value] += parseFloat(x.points.value)
        return pV
    }, {}))
    /********************************************************************************/

    return <>

        <EuiPanel paddingSize="l" hasBorder>
            <EuiFlexGroup justifyContent="start">
                {driver?.thumbnail?.value &&
                    <EuiImage alt="Photo du pilote" size="m" src={driver.thumbnail.value} />
                }
                <div>
                    <EuiTitle size="l">
                        <h1>{driver?.forename?.value} {driver?.surname.value}</h1>
                    </EuiTitle>
                    <EuiText grow={true}>
                        <small style={{ display: "block", marginTop: 5, width: "100%", textAlign: "justify" }}>
                            {driver?.abstract?.value}
                        </small>
                    </EuiText>
                </div>

            </EuiFlexGroup>
        </EuiPanel>

        <EuiPanel paddingSize="m" hasBorder style={{ marginTop: 25 }}>
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiTitle size="xs">
                        <h5>Nombre de point gagné par année</h5>
                    </EuiTitle>
                    <Chart size={{ height: 350 }}>
                        <Settings showLegend={false} />
                        <LineSeries
                            id="control"
                            name="Control"
                            data={points_list}
                            xAccessor={0}
                            yAccessors={[1]}
                            color={['black']}
                        />
                        <Axis
                            id="bottom-axis"
                            position="bottom"

                        />
                        <Axis
                            id="left-axis"
                            position="left"
                            showGridLines
                            tickFormat={(d) => Number(d).toFixed(2)}
                        />
                    </Chart>
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiTitle size="xs">
                        <h5>Status de fin de grand prix</h5>
                    </EuiTitle>
                    <Chart size={{ height: 350 }}>
                        <Settings
                            theme={[
                                { colors: { vizColors: ARRAY_STATUS_COLOR } },
                            ]}
                            showLegend={true}
                            legendPosition="right"
                            showLegendDisplayValue={false}
                        />
                        <BarSeries
                            id="bars"
                            name="0"
                            data={status_list}
                            xAccessor={'x'}
                            yAccessors={['y']}
                            splitSeriesAccessors={['g']}
                            stackAccessors={['g']}
                        />
                        <Axis
                            id="bottom-axis"
                            position="bottom"

                        />
                        <Axis
                            id="left-axis"
                            position="left"
                            showGridLines
                            tickFormat={(d) => Number(d).toFixed(2)}
                        />
                    </Chart>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>

        <EuiTitle style={{ marginTop: 25, marginBottom: 10 }} size="xs"><h4>Résultat des Grand Prix</h4></EuiTitle>

        <EuiPanel paddingSize="m" hasBorder>
            <EuiBasicTable
                tableCaption="Résultat des Grand Prix"
                items={grandPrixResults}
                columns={RESULTS_COLUMNS}
            />
        </EuiPanel>
    </>
}