
import React from "react";
import { useLoaderData } from "react-router";

import {
	EuiTitle,
	EuiTimelineItem,
	EuiText,
	EuiBadge,
	EuiLink,
	EuiTextColor,
	EuiIcon,
	EuiBasicTable,
	EuiPanel,
	EuiHorizontalRule,
	EuiStat, EuiFlexItem, EuiFlexGroup,
	formatDate,
} from '@elastic/eui';


const STATUS_COLOR = {
	"ok": "#BADA55",
	"lap": "primary",
	"out": "#ff7070"
}

const RESULTS_COLUMNS = [
	{
		field: 'positionOrder',
		name: 'Classement',
		align: "center",
		textOnly: true,
		width: "100px",
		render: (positionOrder) => positionOrder?.value,
	},
	{
		field: 'forename',
		name: 'Pilote',
		align: "left",
		textOnly: true,
		render: (_, data) => <EuiLink href={data?.driver_uri?.value} target="_blank">{data?.forename?.value} {data?.surname?.value}</EuiLink>
	}, {
		field: 'constructor',
		name: 'Constructeur',
		align: "left",
		textOnly: true,
		render: (_, data) => <EuiLink href={data?.constructor_uri?.value} target="_blank">{data?.constructor?.value}</EuiLink>
	}, {
		field: 'grid',
		name: 'Positions',
		align: "center",
		width: 70,
		render: (grid, data) => {
			const g_o_p = parseInt(grid?.value || 0) - parseInt(data?.positionOrder?.value || 0)
			const color = g_o_p > 0 ? "success" : g_o_p < 0 ? "danger" : "default"
			const icon = g_o_p > 0 ? "sortUp" : g_o_p < 0 ? "sortDown" : "minus"
			return <EuiTextColor color={color}><EuiIcon type={icon} /> {g_o_p}</EuiTextColor>
		},
	}, {
		field: 'fastestLapTime',
		name: 'Tour + rapide',
		align: "center",
		render: (fastestLapTime, data) => {
			return data.fastestLapTime ? <>{fastestLapTime?.value}<br />{data.fastestLapSpeed?.value} km/h</> : <><br /><br /></>
		},
	},
	{
		field: 'status',
		name: 'Status',
		align: "right",
		render: (status, d) => <EuiBadge color={STATUS_COLOR[d?.status_type?.value]}>{status?.value}</EuiBadge>,
	},
]


export default function GrandPrix() {

	let [grandPrix, resultats] = useLoaderData()
	grandPrix = grandPrix[0]

	console.log(grandPrix, resultats)


	const timeline = [["fp1_date", "FP1"], ["fp2_date", "FP2"], ["fp3_date", "FP3"], ["sprint_date", "Sprint"], ["qualification_date", "Qualification"], ["gp_date", "Course"]]


	return <>

		<EuiFlexGroup justifyContent="spaceAround">
			<EuiTitle size="l">
				<h1>{grandPrix?.year?.value} - {grandPrix?.name?.value}</h1>
			</EuiTitle>
		</EuiFlexGroup>

		<EuiFlexGroup justifyContent="spaceAround">
			<div style={{ width: 250 }}>
				<EuiHorizontalRule margin="l" />
			</div>
		</EuiFlexGroup>

		<EuiFlexGroup>
			{
				timeline.map(type => {
					let time = grandPrix[type[0].split("_")[0] + "_time"]?.value
					return grandPrix[type[0]] && <EuiFlexItem>
						<EuiPanel paddingSize="s" hasBorder>
							<EuiStat
								title={<p>{formatDate(grandPrix[type[0]]?.value, "shortDate")}{time && <><br /><h6>{time}</h6></>}</p>}
								description={type[1]}
								textAlign="center"
								titleSize="xs"
							/>
						</EuiPanel>
					</EuiFlexItem>
				})
			}
		</EuiFlexGroup>

		<EuiTitle style={{ marginTop: 25, marginBottom: 10 }} size="xs"><h4>Résultat du Grand Prix</h4></EuiTitle>

		<EuiPanel paddingSize="m" hasBorder>
			<EuiBasicTable
				tableCaption="Résultat du Grand Prix"
				items={resultats}
				columns={RESULTS_COLUMNS}
			/>
		</EuiPanel>

	</>
}