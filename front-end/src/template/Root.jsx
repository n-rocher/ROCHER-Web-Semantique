import React from "react";

import { EuiPageTemplate } from '@elastic/eui';

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
                pageTitle='Formula 1 data'
                description='Accédez aux dernières données des grand prix de Formule 1 !'
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