
import React from "react";

import {
    ComposableMap,
    Geographies,
    Geography,
    Marker
} from "react-simple-maps";

import {
    formatDate,
    EuiBasicTable,
    EuiBadge,
    EuiTitle,
    EuiPanel,
    EuiToolTip,
    EuiFlexGroup,
    EuiFlexItem,
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

import { getNumberOfGPByCircuit, getAllGrandPrix, getNumberOfGrandPrixByYear } from "../sparql";
import { getIRI } from "../util";



const BADGE_COLORS = ["#FCF7BC", "#FEA27F", "#BADA55", "#FFA500", "#0000FF"]
const CHART_COLOR = "#FF1801"



const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";


const data = [{ "rank": "1", "country_code": "392", "country": "Japan", "city_code": "21671", "city": "Tokyo", "lat": "35.6895", "lng": "139.6917", "population": "37" }, { "rank": "2", "country_code": "356", "country": "India", "city_code": "21228", "city": "Delhi", "lat": "28.6667", "lng": "77.2167", "population": "30" }, { "rank": "3", "country_code": "156", "country": "China", "city_code": "20656", "city": "Shanghai", "lat": "31.2222", "lng": "121.4581", "population": "27" }, { "rank": "4", "country_code": "76", "country": "Brazil", "city_code": "20287", "city": "São Paulo", "lat": "-23.5475", "lng": "-46.6361", "population": "22" }, { "rank": "5", "country_code": "484", "country": "Mexico", "city_code": "21853", "city": "Ciudad de México (Mexico City)", "lat": "19.4273", "lng": "-99.1419", "population": "22" }, { "rank": "6", "country_code": "50", "country": "Bangladesh", "city_code": "20119", "city": "Dhaka", "lat": "23.7104", "lng": "90.4074", "population": "21" }, { "rank": "7", "country_code": "818", "country": "Egypt", "city_code": "22812", "city": "Al-Qahirah (Cairo)", "lat": "30.0392", "lng": "31.2394", "population": "21" }, { "rank": "8", "country_code": "156", "country": "China", "city_code": "20464", "city": "Beijing", "lat": "39.9075", "lng": "116.3972", "population": "20" }, { "rank": "9", "country_code": "356", "country": "India", "city_code": "21206", "city": "Mumbai (Bombay)", "lat": "19.0740", "lng": "72.8808", "population": "20" }, { "rank": "10", "country_code": "392", "country": "Japan", "city_code": "206459", "city": "Kinki M.M.A. (Osaka)", "lat": "34.6758", "lng": "135.5538", "population": "19" }, { "rank": "11", "country_code": "840", "country": "United States of America", "city_code": "23083", "city": "New York-Newark", "lat": "40.7170", "lng": "-74.0037", "population": "19" }, { "rank": "12", "country_code": "586", "country": "Pakistan", "city_code": "22044", "city": "Karachi", "lat": "24.9056", "lng": "67.0822", "population": "16" }, { "rank": "13", "country_code": "156", "country": "China", "city_code": "20484", "city": "Chongqing", "lat": "29.5628", "lng": "106.5528", "population": "16" }, { "rank": "14", "country_code": "792", "country": "Turkey", "city_code": "22691", "city": "Istanbul", "lat": "41.0138", "lng": "28.9497", "population": "15" }, { "rank": "15", "country_code": "32", "country": "Argentina", "city_code": "20058", "city": "Buenos Aires", "lat": "-34.6051", "lng": "-58.4004", "population": "15" }, { "rank": "16", "country_code": "356", "country": "India", "city_code": "21211", "city": "Kolkata (Calcutta)", "lat": "22.5335", "lng": "88.3560", "population": "15" }, { "rank": "17", "country_code": "566", "country": "Nigeria", "city_code": "22007", "city": "Lagos", "lat": "6.4531", "lng": "3.3958", "population": "14" }, { "rank": "18", "country_code": "180", "country": "Democratic Republic of the Congo", "city_code": "20853", "city": "Kinshasa", "lat": "-4.3276", "lng": "15.3136", "population": "14" }, { "rank": "19", "country_code": "608", "country": "Philippines", "city_code": "22109", "city": "Manila", "lat": "14.6042", "lng": "120.9822", "population": "14" }, { "rank": "20", "country_code": "156", "country": "China", "city_code": "20689", "city": "Tianjin", "lat": "39.1088", "lng": "117.1886", "population": "14" }, { "rank": "21", "country_code": "76", "country": "Brazil", "city_code": "20272", "city": "Rio de Janeiro", "lat": "-22.9028", "lng": "-43.2075", "population": "13" }, { "rank": "22", "country_code": "156", "country": "China", "city_code": "20517", "city": "Guangzhou, Guangdong", "lat": "23.1255", "lng": "113.2574", "population": "13" }, { "rank": "23", "country_code": "586", "country": "Pakistan", "city_code": "22046", "city": "Lahore", "lat": "31.5497", "lng": "74.3436", "population": "13" }, { "rank": "24", "country_code": "643", "country": "Russian Federation", "city_code": "22299", "city": "Moskva (Moscow)", "lat": "55.7550", "lng": "37.6218", "population": "13" }, { "rank": "25", "country_code": "840", "country": "United States of America", "city_code": "23052", "city": "Los Angeles-Long Beach-Santa Ana", "lat": "34.0317", "lng": "-118.2417", "population": "12" }, { "rank": "26", "country_code": "156", "country": "China", "city_code": "20667", "city": "Shenzhen", "lat": "22.5415", "lng": "114.0634", "population": "12" }, { "rank": "27", "country_code": "356", "country": "India", "city_code": "21176", "city": "Bangalore", "lat": "12.9719", "lng": "77.5937", "population": "12" }, { "rank": "28", "country_code": "250", "country": "France", "city_code": "20985", "city": "Paris", "lat": "48.8534", "lng": "2.3488", "population": "11" }, { "rank": "29", "country_code": "170", "country": "Colombia", "city_code": "20837", "city": "Bogotá", "lat": "4.6097", "lng": "-74.0818", "population": "11" }, { "rank": "30", "country_code": "356", "country": "India", "city_code": "21321", "city": "Chennai (Madras)", "lat": "13.0531", "lng": "80.2488", "population": "11" }]

export default class Home extends React.Component {

    state = {
        grandPrixLoading: true,
        grandPrix: [],
        numberOfgrandPrixByYearLoading: true,
        numberOfgrandPrixByYear: [],
        numberOfGPByCircuit: []
    }

    componentDidMount() {
        getAllGrandPrix().then(data => {
            this.setState({ grandPrixLoading: false, grandPrix: data })
        })

        getNumberOfGrandPrixByYear().then(data => {
            data = data.map(v => [parseInt(v.year.value), parseInt(v.value.value)])
            this.setState({ numberOfgrandPrixByYearLoading: false, numberOfgrandPrixByYear: data })
        })

        getNumberOfGPByCircuit().then(data => {
            console.log(data)
            this.setState({ numberOfGPByCircuit: data })
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
            <EuiFlexGroup justifyContent="start">
                <EuiFlexItem>
                    <EuiTitle style={{ marginBottom: 10 }} size="xs"><h4>Nombre de Grand Prix par année</h4></EuiTitle>

                    <EuiPanel paddingSize="m" hasBorder>
                        <Chart size={{ height: "100%" }}>
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
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiTitle style={{ marginBottom: 10 }} size="xs"><h4>Grand Prix dans le monde</h4></EuiTitle>
                    <EuiPanel paddingSize="m" hasBorder>
                        <ComposableMap projectionConfig={{ rotate: [-10, 0, 0] }}>
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => (
                                        <Geography key={geo.rsmKey} geography={geo} fill="#DDD" />
                                    ))
                                }
                            </Geographies>
                            {this.state.numberOfGPByCircuit.map(({ gp_name, longitude, latitude, nbr_gp }) => {
                                return (
                                    <Marker key={gp_name.value} coordinates={[longitude.value, latitude.value]}>
                                        <circle fill="#F53" stroke="#FFF" r={8} />
                                    </Marker>
                                );
                            })}
                        </ComposableMap>
                    </EuiPanel>
                </EuiFlexItem>
            </EuiFlexGroup>


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