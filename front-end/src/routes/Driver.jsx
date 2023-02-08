
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
    formatDate,
} from '@elastic/eui';

import { getIRI } from "../util";

const BADGE_COLORS = ["#FCF7BC", "#FEA27F", "#BADA55", "#FFA500", "#0000FF"]
const CHART_COLOR = "#FF1801"
const STATUS_COLOR = {
    "ok": "#BADA55",
    "lap": "primary",
    "out": "#ff7070"
}

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

    let [driver, grandPrixResults] = useLoaderData()
    driver = driver[0]

    return <>

        <EuiPanel paddingSize="l" hasBorder>
            <EuiFlexGroup justifyContent="start">
                {driver?.thumbnail?.value &&
                    <EuiImage size="m" src={driver.thumbnail.value} />
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