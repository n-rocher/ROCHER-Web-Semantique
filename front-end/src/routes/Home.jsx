
import React from "react";

import {
    formatDate,
    EuiBasicTable,
    EuiBadge,
    EuiTitle ,
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

import { getGrandPrix, getNumberOfGrandPrixByYear } from "../sparql";

const BADGE_COLORS = ["#FCF7BC", "#FEA27F", "#BADA55", "#FFA500", "#0000FF"]

export default class Home extends React.Component {

    state = {
        grandPrixLoading: true,
        grandPrix: [],
        numberOfgrandPrixByYearLoading: true,
        numberOfgrandPrixByYear: []
    }

    componentDidMount() {
        getGrandPrix().then(data => {
            this.setState({ grandPrixLoading: false, grandPrix: data })
        })

        getNumberOfGrandPrixByYear().then(data => {
            console.log(data)
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
                return <EuiLink href={data.uri.value}>
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
                return <EuiLink href={data.winner_uri.value} target="_blank">
                    {data.winner_forename.value} {data.winner_surname.value}
                </EuiLink>
            }
        },
        {
            field: 'dateTime',
            name: 'Date',
            align: "right",
            textOnly: true,
            truncateText: true,
            width: "200px",
            render: (dateTime) => formatDate(dateTime.value, 'dobLong'),
        },
    ]

    render() {
        return <>

            <EuiTitle style={{marginBottom: 10}} size="xs"><h4>Nombre de Grand Prix par année</h4></EuiTitle>

            <Chart size={{ height: 350 }}>
                <Settings
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

            <EuiTitle style={{marginTop: 25, marginBottom: 10}} size="xs"><h4>Accéder aux informations sur les Grand Prix</h4></EuiTitle>

            <EuiBasicTable
                tableCaption="Liste des grand prix"
                items={this.state.grandPrix}
                columns={this.columns}
            />

        </>
    }
}