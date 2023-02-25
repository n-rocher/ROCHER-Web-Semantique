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

const BADGE_COLORS = ["#ff48f6", "#FEA27F", "#BADA55", "#FFA500", "#4848ff"]
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
        name: 'Année',
        render: (gp_year) => {
            return <EuiBadge color={BADGE_COLORS[gp_year.value % BADGE_COLORS.length]}>{gp_year.value}</EuiBadge>
        }
    }, {
        field: 'driver_number',
        name: 'Numéro',
        align: "center",
        width: "150px",
        textOnly: true,
        truncateText: false,
        render: (driver_number) => <EuiBadge color={"lightgrey"}>{driver_number.value}</EuiBadge>
    }, {
        field: 'driver_forename',
        name: 'Pilote',
        align: "left",
        textOnly: true,
        truncateText: false,
        render: (constructor, data) => <EuiLink target="_blank" href={"/driver/" + getIRI(data.driver_uri.value)}>{data.driver_forename.value} {data.driver_surname.value}</EuiLink>
    }, {
        field: "driver_nbr_gp",
        name: "Nombre de Grand Prix",
        align:"right",
        textOnly:true,
        truncateText:false,
        render: (nbr) => nbr.value
    }
]


export default function Constructor() {

    let [constructor, drivers] = useLoaderData()

    console.log(drivers)

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

		<EuiTitle style={{ marginTop: 25, marginBottom: 10 }} size="xs"><h4>Liste des pilotes de l'écurie</h4></EuiTitle>

        <EuiPanel paddingSize="m" hasBorder>
			<EuiBasicTable
				tableCaption="Pilote par année"
				items={drivers}
				columns={RESULTS_COLUMNS}
			/>
		</EuiPanel>


    </>
}