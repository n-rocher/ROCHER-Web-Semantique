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


export default function Constructor() {

    let [constructor, drivers] = useLoaderData()

    /* Trouver la plus longue description retournée */
    if (constructor.length > 1) {
        let abs_length = constructor.map(x => x?.abstract?.value?.length || 0)
        constructor = constructor[abs_length.indexOf(Math.max(...abs_length))]
    } else {
        constructor = constructor[0]
    }
    /***************************************************************************/
    return <>

        <EuiPanel paddingSize="l" hasBorder>
            <EuiFlexGroup justifyContent="start">
                {constructor?.thumbnail?.value &&
                    <EuiImage alt="Photo du constructeur" size="m" src={constructor.thumbnail.value} />
                }
                <div>
                    <EuiTitle size="l">
                        <h1>{constructor?.name.value}</h1>
                    </EuiTitle>
                    <EuiText grow={true}>
                        <small style={{ display: "block", marginTop: 5, width: "100%", textAlign: "justify" }}>
                            {constructor?.abstract?.value}
                        </small>
                    </EuiText>
                </div>

            </EuiFlexGroup>
        </EuiPanel>

    </>
}