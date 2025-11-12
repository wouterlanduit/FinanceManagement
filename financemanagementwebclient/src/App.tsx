import { FluentProvider, webDarkTheme } from '@fluentui/react-components';
import './App.css'
import MonthlyDetailsGrid from './components/MonthlyDetailsGrid/MonthlyDetailsGrid'
import { AIPDataSource, type DataSource } from './services/data-source-service'

function App() {
    const ds: DataSource = new AIPDataSource();
    ds.useDummyData = window.location.hostname === 'localhost';

    return (
        <>
            <FluentProvider theme={webDarkTheme}>
                <div>
                    <MonthlyDetailsGrid
                        name="September"
                        source={ds}
                        _ISDEBUG_={window.location.hostname === 'localhost'}
                    />
                    </div>
            </FluentProvider>
        </>
    )
}

export default App
