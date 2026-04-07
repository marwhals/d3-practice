import Chart from "./components/Chart";
import BarChart from "./components/BarChart";

function App() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>D3 + React Dashboard</h1>

            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
                <div>
                    <h2>Sine Wave</h2>
                    <Chart />
                </div>
                <div>
                    <h2>Bar Chart</h2>
                    <BarChart />
                </div>
            </div>
        </div>
    );
}

export default App;