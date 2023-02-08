
import { getGrandPrix } from "../sparql";
import React from "react";

export default class Root extends React.Component {

    state = {
        grandPrixLoading: true,
        grandPrix: []
    }


    componentDidMount() {

        getGrandPrix()

    }


    render() {
        return <h1>Formula 1</h1>;
    }
}

