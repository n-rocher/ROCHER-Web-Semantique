
import React from "react";

import {
    formatDate,
    EuiBasicTable,
    EuiBadge,
    EuiTitle,
    EuiPanel,
    EuiLink,
} from '@elastic/eui';

import {
    Chart,
    Settings,
    Axis,
    LineSeries,
    BarSeries,
} from '@elastic/charts';

import '@elastic/charts/dist/theme_only_light.css';

import { getAllGrandPrix, getNumberOfGrandPrixByYear } from "../sparql";
import { getIRI } from "../util";

const BADGE_COLORS = ["#FCF7BC", "#FEA27F", "#BADA55", "#FFA500", "#0000FF"]
const CHART_COLOR = "#FF1801"

export default class Home extends React.Component {

    state = {
        grandPrixLoading: true,
        grandPrix: [],
        numberOfgrandPrixByYearLoading: true,
        numberOfgrandPrixByYear: []
    }

    componentDidMount() {
        getAllGrandPrix().then(data => {
            this.setState({ grandPrixLoading: false, grandPrix: data })
        })

        getNumberOfGrandPrixByYear().then(data => {
            data = data.map(v => [parseInt(v.year.value), parseInt(v.value.value)])
            this.setState({ numberOfgrandPrixByYearLoading: false, numberOfgrandPrixByYear: data })
        })
    }

    columns = [
        {
            field: 'year',
            width: "75px",
            align: "center",
            name: '',
            render: (year) => {
                return <EuiBadge color={BADGE_COLORS[year.value % BADGE_COLORS.length]}>{year.value}</EuiBadge>
            }
        },
        {
            field: 'name',
            name: 'Grand Prix',
            align: "left",
            textOnly: true,
            truncateText: false,
            render: (name, data) => {
                return <EuiLink href={"/grand-prix/" + getIRI(data.uri.value)}>
                    {data.year.value} — {name.value}
                </EuiLink>
            }
        },
        {
            field: 'winner_forename',
            name: 'Gagnant',
            textOnly: true,
            truncateText: true,
            render: (_, data) => {
                return <EuiLink href={"/driver/" + getIRI(data.winner_uri.value)} target="_blank">
                    {data.winner_forename.value} {data.winner_surname.value}
                </EuiLink>
            }
        },
        {
            field: 'date',
            name: 'Date',
            align: "right",
            textOnly: true,
            truncateText: true,
            width: "200px",
            render: (date) => formatDate(date.value, 'dobLong'),
        },
    ]

    render() {
        return <>

            <EuiTitle style={{ marginBottom: 10 }} size="xs"><h4>Nombre de Grand Prix par année</h4></EuiTitle>

            <EuiPanel paddingSize="m" hasBorder>
                <Chart size={{ height: 350 }}>
                    <Settings
                        theme={{ colors: { vizColors: [CHART_COLOR] } }}
                        showLegend={false}
                    />
                    <BarSeries
                        id="bars"
                        name="0"
                        data={this.state.numberOfgrandPrixByYear}
                        xAccessor={0}
                        yAccessors={[1]}
                    />
                    <Axis
                        id="bottom-axis"
                        position="bottom"
                    />
                    <Axis
                        id="left-axis"
                        position="left"
                        showGridLines
                        tickFormat={(d) => Number(d).toFixed(0)}
                    />
                </Chart>
            </EuiPanel>

            <EuiTitle style={{ marginTop: 25, marginBottom: 10 }} size="xs"><h4>Accéder aux informations sur les Grand Prix</h4></EuiTitle>

            <EuiPanel paddingSize="m" hasBorder>
                <EuiBasicTable
                    tableCaption="Liste des grand prix"
                    items={this.state.grandPrix}
                    columns={this.columns}
                />
            </EuiPanel>

        </>
    }
}