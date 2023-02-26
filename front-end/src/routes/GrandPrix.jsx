
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
	EuiImage,
	EuiText,
	EuiStat, EuiFlexItem, EuiFlexGroup,
	formatDate,
	EuiCollapsibleNavGroup,
	EuiCode,
} from '@elastic/eui';

import { getIRI } from "../util";


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
		width: "100px",
		render: (positionOrder) => positionOrder?.value,
	}, {
		field: 'forename',
		name: 'Pilote',
		align: "left",
		render: (_, data) => <EuiLink href={"/driver/" + getIRI(data?.driver_uri?.value)} target="_blank">
			{data?.driver_forename?.value} {data?.driver_surname?.value}
		</EuiLink>
	}, {
		field: 'constructor',
		name: 'Constructeur',
		align: "left",
		render: (_, data) => <EuiLink href={"/constructor/" + getIRI(data?.constructor_uri?.value)} target="_blank">
			{data?.constructor?.value}
		</EuiLink>
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
	}, {
		field: 'status',
		name: 'Status',
		align: "right",
		render: (status, d) => <EuiBadge color={STATUS_COLOR[d?.status_type?.value]}>{status?.value}</EuiBadge>,
	},
]


export default function GrandPrix() {

	let [grandPrix, resultats] = useLoaderData()
	grandPrix = grandPrix[0]

	const timeline = [["fp1_date", "FP1"], ["fp2_date", "FP2"], ["fp3_date", "FP3"], ["sprint_date", "Sprint"], ["qualification_date", "Qualification"], ["gp_date", "Course"]]

	return <>

		<EuiFlexGroup justifyContent="spaceAround">
			<EuiTitle size="l">
				<h1>{grandPrix?.year?.value} - {grandPrix?.name?.value}</h1>
			</EuiTitle>
		</EuiFlexGroup>

		<EuiFlexGroup style={{ marginTop: 25 }}>
			{
				timeline.map(type => {
					if (type[0] in grandPrix) {
						let time = grandPrix[type[0].split("_")[0] + "_time"]?.value
						return grandPrix[type[0]] && <EuiFlexItem key={type[0]}>
							<EuiPanel paddingSize="s" hasBorder>
								<EuiStat
									title={<p>{formatDate(grandPrix[type[0]]?.value, "shortDate")}{time && <><br /><h6>{time}</h6></>}</p>}
									description={type[1]}
									textAlign="center"
									titleSize="xs"
								/>
							</EuiPanel>
						</EuiFlexItem>
					}
				})
			}
		</EuiFlexGroup>

		{grandPrix?.gp_abstract?.value && <>
			<EuiPanel paddingSize="xxs" hasBorder style={{ marginTop: 25 }}>
				<EuiCollapsibleNavGroup
					title="Description du Grand Prix"
					isCollapsible={true}
					initialIsOpen={grandPrix?.gp_abstract?.value.length < 400}
				>
					<EuiText grow={true} style={{ margin: "0px 15px 15px 15px", textAlign: "justify" }}>
						<small>
							{grandPrix?.gp_abstract?.value}
						</small>
					</EuiText>
				</EuiCollapsibleNavGroup>
			</EuiPanel>
		</>}

		{grandPrix?.circuit_abstract?.value &&
			<EuiPanel paddingSize="xxs" hasBorder style={{ marginTop: 25 }}>
				<EuiCollapsibleNavGroup
					title={"Découvrir le circuit de " + grandPrix?.circuit_name?.value}
					isCollapsible={true}
					initialIsOpen={false}>

					<EuiFlexGroup alignItems="center" style={{ margin: "0px 15px 15px 15px" }}>

						{grandPrix?.circuit_thumbnail?.value &&
							<EuiImage size="m" alt="Circuit" src={grandPrix.circuit_thumbnail.value} />
						}

						<EuiText grow={true} style={{ marginLeft: 15, textAlign: "justify" }}>
							<small>
								{grandPrix?.circuit_abstract?.value}
							</small>
						</EuiText>
					</EuiFlexGroup>
				</EuiCollapsibleNavGroup>
			</EuiPanel>
		}

		<EuiTitle style={{ marginTop: 25, marginBottom: 10 }} size="xs"><h4>Résultat de course</h4></EuiTitle>

		<EuiPanel paddingSize="m" hasBorder>
			<EuiBasicTable
				tableCaption="Résultat de course"
				items={resultats}
				columns={RESULTS_COLUMNS}
			/>
		</EuiPanel>

	</>
}