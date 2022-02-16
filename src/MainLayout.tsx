import React from 'react';
import './App.css';
import {TVChartContainer} from "./components/TVChartContainer/TVChartContainer";
import RightPanel from "./components/RightPanel";

class MainLayout extends React.Component {
    render() {
        return (
            <div>
                {/*<RightPanel/>*/}
                <TVChartContainer/>
            </div>
        );
    }
}

export default MainLayout;