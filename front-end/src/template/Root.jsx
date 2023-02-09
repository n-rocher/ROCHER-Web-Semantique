import React from "react";

import {
    EuiPageTemplate,
    EuiFlexGroup,
    EuiButton
} from '@elastic/eui';

export default function Root({
    panelled,
    restrictWidth,
    bottomBorder,
    offset,
    grow,
    children
}) {
    return (
        <EuiPageTemplate
            panelled={panelled}
            restrictWidth={restrictWidth}
            bottomBorder={bottomBorder}
            offset={offset}
            grow={grow}>

            <EuiPageTemplate.Header
                bottomBorder={true}
                pageTitle='Formula 1'
                description='Accédez aux dernières données des grand prix de Formule 1 !'
                rightSideItems={[
                    <EuiButton href="/">Liste des grand prix</EuiButton>,
                ]}
            />

            <EuiPageTemplate.Section
                grow={false}
                color="subdued"
                bottomBorder="extended">
                {children}
            </EuiPageTemplate.Section>

        </EuiPageTemplate>
    );
};